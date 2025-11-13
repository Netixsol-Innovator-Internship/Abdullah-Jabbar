# IP Tracker Backend

A robust NestJS application for tracking and logging client IP addresses from incoming HTTP requests with advanced security features and privacy protection.

## Description

This application captures and logs IP addresses from all incoming HTTP requests with the following features:

### 🔐 Security & Privacy Features
- **IP Hashing**: All IPs are hashed using SHA-256 with configurable salt for privacy compliance
- **Optional Raw Storage**: Raw IP storage is disabled by default (enable via `STORE_RAW_IP=true`)
- **Trust Proxy Configuration**: Restrictive proxy settings to prevent IP spoofing
- **Private IP Filtering**: Automatically filters out private/internal IPs from `X-Forwarded-For` headers

### 🌐 IP Address Handling
- **IPv4 & IPv6 Support**: Full support for both IP protocols
- **IP Normalization**: Consistent canonical format for all IPs
  - IPv6 addresses compressed (e.g., `::1` instead of `0000:0000:0000:0000:0000:0000:0000:0001`)
  - IPv4-mapped IPv6 addresses converted to IPv4 (e.g., `::ffff:192.0.2.1` → `192.0.2.1`)
- **Multiple Header Support**: Checks multiple headers in priority order:
  1. `req.ip` (when trust proxy enabled)
  2. `X-Forwarded-For` (first public IP)
  3. `CF-Connecting-IP` (Cloudflare)
  4. `X-Real-IP` (Nginx)
  5. Socket remote address (fallback)

### 📊 Logging
- **File-based Logging**: Stores logs in `logs/ip-requests.log` as newline-delimited JSON
- **Comprehensive Data**: Captures IP, user agent, HTTP method, request path, and timestamp
- **Non-blocking**: Fire-and-forget logging doesn't slow down request processing

### 🚫 Virtual Adapter Filtering
Automatically filters out virtual network adapters on startup:
- VMware (192.168.194.x, 192.168.68.x)
- VirtualBox (192.168.56.x, 172.16.x)
- Docker (192.168.99.x, 172.17.x)
- Hyper-V/WSL (10.0.75.x)

## Project Setup

### Prerequisites
- Node.js (v18 or higher)
- pnpm package manager

### Installation

```bash
# Install dependencies
$ pnpm install
```

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
# Server Configuration
PORT=3000

# IP Logging Configuration
STORE_RAW_IP=false          # Set to 'true' to store raw IPs (privacy risk)
IP_SALT=your_secret_salt    # Custom salt for IP hashing (change in production!)
```

**Important**: 
- Keep `STORE_RAW_IP=false` unless you have a specific need and legal basis for storing raw IPs
- Change `IP_SALT` to a cryptographically random string in production

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Log Format

Each log entry is a JSON object with the following structure:

```json
{
  "hashedIp": "6043ed381e3eb73f926c7f6bf6f610dfde9b0078c34228cbf4fbd28f23e236bf",
  "rawIp": null,
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "method": "GET",
  "path": "/",
  "createdAt": "2025-11-13T09:57:42.247Z"
}
```

Logs are stored in `logs/ip-requests.log` as newline-delimited JSON (NDJSON).

## Network Access

When the server starts, it displays accessible network addresses:

```
http://localhost:3000
http://192.168.1.100:3000
```

The application automatically:
- Binds to `0.0.0.0` to accept connections from any network interface
- Tests connectivity to each IP address
- Filters out virtual adapter IPs that aren't accessible
- Only displays reachable addresses

## Architecture

### Middleware
`IpLoggerMiddleware` intercepts all HTTP requests and extracts client IPs using a robust fallback chain.

### Service
`IpLoggerService` handles IP hashing and file-based logging with async file operations.

### Entity
`IpLog` entity is defined but TypeORM is currently disabled (file-based logging active).

## Security Considerations

### Trust Proxy Settings
Current configuration: `'loopback, linklocal, uniquelocal'`

This restricts trusted proxies to:
- **Loopback**: 127.0.0.0/8, ::1
- **Link-local**: 169.254.0.0/16, fe80::/10
- **Unique local**: fc00::/7, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16

**For production behind CDN/load balancers**: Adjust trust proxy settings based on your infrastructure.

### Privacy Compliance
- IPs are hashed by default (GDPR/privacy-friendly)
- Raw IP storage is opt-in only
- Consider your legal obligations before enabling raw IP logging

## Known Limitations

⚠️ **Not compatible with serverless platforms** (Vercel, Netlify, AWS Lambda) without modifications:
- File system is read-only/ephemeral in serverless
- Requires migration to database or external logging service
- See deployment documentation for serverless adaptations

## Dependencies

### Core
- **NestJS** - Progressive Node.js framework
- **Express** - Underlying HTTP server
- **TypeORM** - ORM (currently disabled)

### Utilities
- **ipaddr.js** - IP address parsing and normalization
- **crypto** (built-in) - SHA-256 hashing
- **fs/path** (built-in) - File system operations

## Troubleshooting

### Issue: Seeing private/internal IPs
**Solution**: The middleware filters private IPs from `X-Forwarded-For`. If you're testing locally, you'll see private IPs from `req.socket.remoteAddress`.

### Issue: Virtual adapter IPs showing on startup
**Solution**: The code filters common virtual adapters (VMware, VirtualBox, Docker, Hyper-V). Add your specific ranges to the filter in `main.ts`.

### Issue: Not getting real client IPs behind proxy
**Solution**: Ensure your proxy/load balancer sets `X-Forwarded-For` header and adjust `trust proxy` settings accordingly.

### Issue: TypeScript/ESLint warnings about `any` types
**Solution**: These warnings are from `ipaddr.js` which doesn't have TypeScript definitions. They don't affect functionality.

## Contributing

This is a learning/internship project. Feel free to fork and customize for your needs.

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [ipaddr.js GitHub](https://github.com/whitequark/ipaddr.js)
- [Express Trust Proxy](https://expressjs.com/en/guide/behind-proxies.html)

## License

UNLICENSED - Private project for learning purposes.
