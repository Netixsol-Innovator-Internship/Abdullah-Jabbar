import { Wallet, Loader2 } from "lucide-react";

interface WalletButtonProps {
  isConnected: boolean;
  isConnecting: boolean;
  address?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletButton({
  isConnected,
  isConnecting,
  address,
  onConnect,
  onDisconnect,
}: WalletButtonProps) {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnecting) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium opacity-75 cursor-not-allowed"
      >
        <Loader2 className="w-5 h-5 animate-spin" />
        Connecting...
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="font-mono text-sm">{formatAddress(address)}</span>
        </div>
        <button
          onClick={onDisconnect}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors transform hover:scale-105"
    >
      <Wallet className="w-5 h-5" />
      Connect Wallet
    </button>
  );
}
