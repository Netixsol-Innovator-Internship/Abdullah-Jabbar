"use client";

import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-section">
          <h3 className="footer-brand">Planer's Mint</h3>
          <p className="footer-tagline">
            Mint, Swap, Create — All in One Place.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li>
              <a href="/dex">DEX Trading</a>
            </li>
            <li>
              <a href="/marketplace">NFT Marketplace</a>
            </li>
            <li>
              <a href="/portfolio">Portfolio</a>
            </li>
            <li>
              <a href="/">Faucet</a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div className="footer-section">
          <h4 className="footer-heading">Resources</h4>
          <ul className="footer-links">
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Network Info */}
        <div className="footer-section">
          <h4 className="footer-heading">Network</h4>
          <p className="footer-text">Built on Ethereum Sepolia</p>
          <p className="footer-text text-small">
            Testnet only - For development
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="footer-divider"></div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p className="footer-text">
          © {currentYear} Planer's Mint. All rights reserved.
        </p>
        <div className="footer-credits">
          <a href="#" className="footer-link-small">
            Privacy Policy
          </a>
          <span className="footer-separator">•</span>
          <a href="#" className="footer-link-small">
            Terms of Service
          </a>
          <span className="footer-separator">•</span>
          <a href="#" className="footer-link-small">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
