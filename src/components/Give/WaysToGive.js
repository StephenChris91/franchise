"use client";

import React, { useState } from "react";
import { Copy, Banknote, Landmark } from "lucide-react";

const WaysToGive = () => {
  const [activeTab, setActiveTab] = useState("NGN");

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-4xl md:text-4xl font-bold mb-3 text-[#af601a]">
          Ways to Give
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Join us as we put our money right where our faith is, partnering with
          God for the spread of the gospel in our day.
        </p>

        {/* Toggle Tabs */}
        <div className="inline-flex border border-gray-300 rounded-full overflow-hidden mb-10">
          {["NGN", "DOMICILIARY"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-red-800 text-white"
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
                  {bank.accounts.map((acc, i) => (
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
                        title="Copy Account Number"
                        className="text-gray-500 hover:text-black cursor-pointer"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          // DOMICILIARY ACCOUNT SECTION
          <div className="bg-blue-50 p-6 rounded-lg shadow max-w-4xl mx-auto text-left border border-blue-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Banknote className="w-6 h-6 text-blue-800" />
                <h4 className="text-lg font-semibold text-gray-800">
                  Stanbic IBTC Bank
                </h4>
              </div>
              <div className="text-green-700 text-xs font-semibold tracking-wide border border-green-600 px-2 py-1 rounded">
                NIGERIA
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* SORT CODE */}
              <div className="bg-white p-4 rounded-md border">
                <p className="text-xs text-gray-500 font-medium mb-1">
                  SORT CODE
                </p>
                <p className="text-lg font-semibold text-black">80892</p>
              </div>

              {/* USD */}
              <div className="bg-white p-4 rounded-md border flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    USD - DOMICILIARY ACCOUNT
                  </p>
                  <p className="text-lg font-semibold text-black">0064035072</p>
                </div>
                <button
                  onClick={() => copyToClipboard("0064035072")}
                  className="text-gray-400 hover:text-black transition cursor-pointer"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>

              {/* GBP */}
              <div className="bg-white p-4 rounded-md border flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    GBP - DOMICILIARY ACCOUNT
                  </p>
                  <p className="text-lg font-semibold text-black">0067017121</p>
                </div>
                <button
                  onClick={() => copyToClipboard("0067017121")}
                  className="text-gray-400 hover:text-black transition cursor-pointer"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>

              {/* EURO */}
              <div className="bg-white p-4 rounded-md border flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    EURO - DOMICILIARY ACCOUNT
                  </p>
                  <p className="text-lg font-semibold text-black">0067017138</p>
                </div>
                <button
                  onClick={() => copyToClipboard("0067017138")}
                  className="text-gray-400 hover:text-black transition cursor-pointer"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WaysToGive;
