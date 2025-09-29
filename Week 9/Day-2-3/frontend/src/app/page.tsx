"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../store/hooks";
import FullScreenLoader from "../components/FullScreenLoader";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (!isClient) return;
    if (isAuthenticated) router.push("/chat");
    else router.push("/login");
  }, [isClient, isAuthenticated, router]);

  return (
    <FullScreenLoader
      label={isClient ? "Redirecting" : "Preparing dashboard"}
      subLabel={
        isClient ? "Taking you to the chat if authenticated..." : undefined
      }
    />
  );
}
