import { Github, ExternalLink } from "lucide-react";

export function Header() {
  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">T</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            TodoChain
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Decentralized Task Management
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <Github className="w-5 h-5" />
        </a>
        <a
          href="https://explorer-testnet.kasplex.org"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>
    </header>
  );
}
