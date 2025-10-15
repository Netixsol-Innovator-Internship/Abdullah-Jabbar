"use client";

import { useState } from "react";
import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
import { Shield, Settings } from "lucide-react";
import MintPanel from "./admin/MintPanel";
import TaxPanel from "./admin/TaxPanel";
import BlacklistPanel from "./admin/BlacklistPanel";
import PausePanel from "./admin/PausePanel";
import SnapshotPanel from "./admin/SnapshotPanel";

interface AdminPanelProps {
  userAddress: `0x${string}` | undefined;
}

export default function AdminPanel({ userAddress }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState("mint");

  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "owner",
  });

  const isOwner =
    owner && userAddress && owner.toLowerCase() === userAddress.toLowerCase();

  if (!isOwner) return null;

  const tabs = [
    { id: "mint", label: "Mint", icon: "🪙" },
    { id: "tax", label: "Tax Config", icon: "💰" },
    { id: "blacklist", label: "Blacklist", icon: "🚫" },
    { id: "pause", label: "Pause/Unpause", icon: "⏸️" },
    { id: "snapshot", label: "Snapshot", icon: "📸" },
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-red-500 to-pink-500 p-2 rounded-lg">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>
          <p className="text-sm text-slate-400">Owner-only functions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-slate-900/30 rounded-xl p-6">
        {activeTab === "mint" && <MintPanel />}
        {activeTab === "tax" && <TaxPanel />}
        {activeTab === "blacklist" && <BlacklistPanel />}
        {activeTab === "pause" && <PausePanel />}
        {activeTab === "snapshot" && <SnapshotPanel />}
      </div>
    </div>
  );
}
