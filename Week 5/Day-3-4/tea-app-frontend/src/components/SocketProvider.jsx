import React, { useEffect, useMemo, useState } from "react";
import { getSocket } from "../lib/socket";
import { SocketContext } from "../hooks/useSocket";

export default function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = getSocket(); // configured to use /nest proxy, credentials, etc.
    setSocket(s);

    // Optional: surface connection state for debugging
    const logConnect = () => console.info("[socket] connected", s.id);
    const logDisconnect = (reason) =>
      console.info("[socket] disconnected", reason);

    s.on("connect", logConnect);
    s.on("disconnect", logDisconnect);

    return () => {
      s.off("connect", logConnect);
      s.off("disconnect", logDisconnect);
      s.disconnect();
    };
  }, []);

  // Memo so consumers don't re-render needlessly on unrelated state
  const value = useMemo(() => socket, [socket]);

  return React.createElement(SocketContext.Provider, { value }, children);
}
