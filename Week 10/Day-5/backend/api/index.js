const serverless = require('serverless-http');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

let cachedHandler;

async function getHandler() {
  if (!cachedHandler) {
    try {
      // Import the compiled JS output from Nest build
      const { createServer } = require('../dist/main.server.js');

      if (!createServer) {
        throw new Error(
          'createServer function not found in dist/main.server.js',
        );
      }

      const expressApp = await createServer();
      cachedHandler = serverless(expressApp);

      console.log('✅ Nest server created and cached');
    } catch (error) {
      console.error('❌ Failed to initialize Nest server:', error);
      throw error;
    }
  }
  return cachedHandler;
}

module.exports = async (req, res) => {
  try {
    const handler = await getHandler();
    return handler(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
};
