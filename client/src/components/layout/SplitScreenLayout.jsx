import { useState } from "react";

export default function SplitScreenLayout({ left, center, right }) {
  const [activeTab, setActiveTab] = useState("center");

  return (
    <>
      {/* Mobile Tabs */}
      <div className="lg:hidden flex border-b-2 border-gray-300 bg-white">
        <button
          onClick={() => setActiveTab("left")}
          className={`flex-1 py-3 font-semibold ${activeTab === "left" ? "bg-slate-700 text-white" : "bg-gray-100 text-gray-700"}`}
        >
          Side A
        </button>
        <button
          onClick={() => setActiveTab("center")}
          className={`flex-1 py-3 font-semibold ${activeTab === "center" ? "bg-slate-700 text-white" : "bg-gray-100 text-gray-700"}`}
        >
          Controls
        </button>
        <button
          onClick={() => setActiveTab("right")}
          className={`flex-1 py-3 font-semibold ${activeTab === "right" ? "bg-slate-700 text-white" : "bg-gray-100 text-gray-700"}`}
        >
          Side B
        </button>
      </div>

      {/* Mobile View - Show active tab only */}
      <div className="lg:hidden h-[calc(100vh-112px)] overflow-y-auto bg-white">
        {activeTab === "left" && <div className="p-4">{left}</div>}
        {activeTab === "center" && <div className="p-4">{center}</div>}
        {activeTab === "right" && <div className="p-4">{right}</div>}
      </div>

      {/* Desktop View - Side by side */}
      <div className="hidden lg:flex h-[calc(100vh-60px)] bg-gray-50">
        <div className="w-1/4 border-r border-gray-300 p-4 overflow-y-auto bg-white">{left}</div>
        <div className="w-1/2 border-r border-gray-300 p-4 overflow-y-auto bg-white">{center}</div>
        <div className="w-1/4 p-4 overflow-y-auto bg-white">{right}</div>
      </div>
    </>
  );
}
