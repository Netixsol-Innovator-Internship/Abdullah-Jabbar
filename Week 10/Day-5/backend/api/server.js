const serverless = require('serverless-http');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

let cachedHandler;
let initializationPromise;

async function getHandler() {
  // If we're already initializing, wait for that to complete
  if (initializationPromise) {
    console.log('⏳ Waiting for ongoing initialization...');
    return initializationPromise;
  }

  // If already cached, return immediately
  if (cachedHandler) {
    return cachedHandler;
  }

  // Start initialization
  initializationPromise = (async () => {
    try {
      console.log('🔧 Initializing Nest server...');
      console.log('Environment variables loaded:', {
        NODE_ENV: process.env.NODE_ENV,
        MONGODB_URI: process.env.MONGODB_URI ? '✓ Set' : '✗ Not set',
        GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '✓ Set' : '✗ Not set',
      });

      // Import the compiled JS output from Nest build
      const { createServer } = require('../dist/main.server.js');

      if (!createServer) {
        throw new Error(
          'createServer function not found in dist/main.server.js',
        );
      }

      // Set a timeout for server creation (8s to stay under Vercel's 10s limit)
      const timeout = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error('Server initialization timeout')),
          8000,
        );
      });

      const expressApp = await Promise.race([createServer(), timeout]);

      cachedHandler = serverless(expressApp, {
        binary: [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
      });

      console.log('✅ Nest server created and cached successfully');
      return cachedHandler;
    } catch (error) {
      console.error('❌ Failed to initialize Nest server:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });

      // Reset cache so next request can try again
      cachedHandler = null;
      initializationPromise = null;

      throw error;
    }
  })();

  return initializationPromise;
}

module.exports = async (req, res) => {
  console.log(`📨 Incoming request: ${req.method} ${req.url}`);

  try {
    const handler = await getHandler();
    return handler(req, res);
  } catch (error) {
    console.error('❌ Handler error:', error);

    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  }
};
