"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
import { useI18n } from "@/i18n/i18nContext";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
  const { account, isConnected, connectWallet, disconnectWallet } = useWallet();
  const { t } = useI18n();
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h2 className="nav-brand-title">Planer&apos;s Mint</h2>
        </div>

        <div className="nav-links">
          <Link href="/" className={pathname === "/" ? "active" : ""}>
            {t("navbar.faucet")}
          </Link>
          <Link href="/dex" className={pathname === "/dex" ? "active" : ""}>
            {t("navbar.dex")}
          </Link>
          <Link
            href="/marketplace"
            className={pathname === "/marketplace" ? "active" : ""}
          >
            {t("navbar.marketplace")}
          </Link>
          <Link
            href="/portfolio"
            className={pathname === "/portfolio" ? "active" : ""}
          >
            {t("navbar.portfolio")}
          </Link>
        </div>

        <div className="nav-wallet">
          <div className="nav-controls">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
          {isConnected ? (
            <div className="wallet-info">
              <span className="wallet-address">
                {account.substring(0, 6)}...{account.substring(38)}
              </span>
              <button onClick={disconnectWallet} className="btn-disconnect">
                {t("common.disconnect")}
              </button>
            </div>
          ) : (
            <button onClick={connectWallet} className="btn-connect">
              {t("common.connect")}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
