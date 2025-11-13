import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as os from 'os';
import * as net from 'net';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // If your app is behind nginx or a trusted load balancer in production,
  // enable trust proxy on the underlying Express app so express sets req.ip from X-Forwarded-For.
  // Be careful: only enable if you control the proxy.
  const server = app.getHttpAdapter()?.getInstance?.() ?? undefined;
  if (server && typeof server.set === 'function') {
    // In production (Vercel), trust the proxy infrastructure
    // In development, only trust local/private proxies to prevent spoofing
    const isProduction =
      process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

    if (isProduction) {
      // Trust Vercel's proxy infrastructure
      server.set('trust proxy', true);
    } else {
      // Development: Trust only loopback, link-local, and unique local addresses
      // This prevents spoofing from untrusted sources while allowing local testing
      server.set('trust proxy', 'loopback, linklocal, uniquelocal');
    }
  }

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  // Bind to all interfaces so other devices on the same network can connect
  await app.listen(port, '0.0.0.0');

  // Print accessible addresses
  const interfaces = os.networkInterfaces();
  const addrs: string[] = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] ?? []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addrs.push(iface.address);
      }
    }
  }

  // Print simple address lines (no internal/external separation)
  console.log(`http://localhost:${port}`);

  // Filter out virtual adapter IPs (VMware, VirtualBox, Hyper-V, WSL, etc.)
  // Only show real network interfaces
  const filteredAddrs = addrs.filter((addr) => {
    // Common virtual adapter patterns to exclude
    const isVirtualAdapter =
      addr.startsWith('192.168.194.') || // VMware NAT
      addr.startsWith('192.168.68.') || // VMware Host-Only
      addr.startsWith('192.168.56.') || // VirtualBox Host-Only
      addr.startsWith('192.168.99.') || // Docker Machine
      addr.startsWith('172.16.') || // VirtualBox NAT
      addr.startsWith('172.17.') || // Docker default bridge
      addr.startsWith('10.0.75.'); // Hyper-V/WSL

    return !isVirtualAdapter;
  });

  // Only print IPs that accept a local TCP connection on the chosen port
  const checkAddr = (addr: string, portNum: number, timeout = 250) =>
    new Promise<boolean>((resolve) => {
      const s = new net.Socket();
      let done = false;
      const cleanup = (res: boolean) => {
        if (done) return;
        done = true;
        try {
          s.destroy();
        } catch {
          // Ignore socket cleanup errors
        }
        resolve(res);
      };
      s.setTimeout(timeout, () => cleanup(false));
      s.once('error', () => cleanup(false));
      s.connect(portNum, addr, () => cleanup(true));
    });

  for (const a of filteredAddrs) {
    // test connectivity to the local server on this address
    try {
      // await result and print only if reachable
      // small timeout keeps startup snappy

      const ok = await checkAddr(a, port);
      if (ok) console.log(`http://${a}:${port}`);
    } catch {
      // ignore connectivity check errors
    }
  }
}

void bootstrap();
