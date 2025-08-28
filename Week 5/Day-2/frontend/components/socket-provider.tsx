'use client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '../lib/socket';

const SocketContext = createContext<Socket | null>(null);

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = getSocket(); // configured to use NEXT_PUBLIC_API_URL, credentials, etc.
    setSocket(s);

    // Optional: surface connection state for debugging
    const logConnect = () => console.info('[socket] connected', s.id);
    const logDisconnect = (reason: string) => console.info('[socket] disconnected', reason);

    s.on('connect', logConnect);
    s.on('disconnect', logDisconnect);

    return () => {
      s.off('connect', logConnect);
      s.off('disconnect', logDisconnect);
      s.disconnect();
    };
  }, []);

  // Memo so consumers don't re-render needlessly on unrelated state
  const value = useMemo(() => socket, [socket]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);
