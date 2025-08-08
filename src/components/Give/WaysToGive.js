"use client";

import React, { useState, useRef } from "react";
import { Copy, Landmark, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const WaysToGive = () => {
  const [activeTab, setActiveTab] = useState("NGN");
  const [copied, setCopied] = useState(""); // stores the last copied text
  const timeoutRef = useRef(null);

  const accounts = {
    NGN: [
      {
        bank: "Access Bank",
        accounts: [
          { label: "Main Account", number: "0692529997" },
          { label: "Rent Account", number: "1911578888" },
        ],
      },
      {
        bank: "Providus Bank",
        accounts: [
          { label: "Main Account", number: "1911603344" },
          { label: "Building Account", number: "1911506050" },
        ],
      },
    ],
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);

      // Clear any existing timer and start a new one
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(""), 2000);
    } catch {
      // Optional: you could set an error toast here instead
    }
  };

  return (
    <section className="py-16 px-4 bg-white relative">
      <div className="max-w-6xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-4xl md:text-4xl font-normal mb-3 ">
          <span className="text-black">Ways to </span>
          <span className="text-[#af601a]">Give</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Stand with us in faith and action, investing in the spread of the
          gospel in our generation.
        </p>

        {/* Toggle Tabs */}
        <div className="inline-flex border border-gray-300 rounded-full overflow-hidden mb-10">
          {["NGN", "DOMICILIARY"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-[#af601a] text-white"
                  : "bg-white text-gray-700"
              } cursor-pointer`}
            >
              {tab} ACCOUNT
            </button>
          ))}
        </div>

        {/* NGN ACCOUNTS */}
        {activeTab === "NGN" ? (
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {accounts.NGN.map((bank, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg shadow-sm p-6 bg-white"
              >
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <Landmark className="w-5 h-5 text-gray-800" />
                  {bank.bank}
                </h4>
                <ul className="space-y-3">
                  {bank.accounts.map((acc, i) => {
                    const isJustCopied = copied === acc.number;
                    return (
                      <li
                        key={i}
                        className="flex items-center justify-between border px-4 py-3 rounded-lg bg-gray-50"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {acc.label}
                          </p>
                          <p className="text-sm text-gray-800">{acc.number}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(acc.number)}
                          title={
                            isJustCopied ? "Copied!" : "Copy Account Number"
                          }
                          className={`inline-flex items-center gap-1 text-gray-500 hover:text-black cursor-pointer transition ${
                            isJustCopied ? "text-green-700" : ""
                          }`}
                          aria-live="polite"
                        >
                          {isJustCopied ? (
                            <>
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="text-xs font-medium hidden sm:inline">
                                Copied
                              </span>
                            </>
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          // DOMICILIARY ACCOUNT COMING SOON
          <div className="bg-blue-50 p-6 rounded-lg shadow max-w-4xl mx-auto text-center border border-blue-100">
            <CheckCircle2 className="w-8 h-8 text-blue-800 mx-auto mb-4 opacity-60" />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Domiciliary Account
            </h4>
            <p className="text-gray-600">Coming Soon</p>
          </div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            key="copy-toast"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50"
            aria-live="polite"
            role="status"
          >
            <div className="flex items-center gap-3 bg-gray-900 text-white rounded-lg shadow-lg px-4 py-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span className="text-sm">
                Account number <strong>{copied}</strong> copied
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default WaysToGive;
