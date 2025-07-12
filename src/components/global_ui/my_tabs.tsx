'use client'

import React from "react";

interface TabItem {
    label: string;
    value: string;
}

interface MyTabsProps {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (value: string) => void;
    className?: string;
    maxWidth?: string;
    backgroundColor?: string;
    activeColor?: string;
    inactiveColor?: string;
    borderColor?: string;
}

export function MyTabs({
    tabs,
    activeTab,
    onTabChange,
    className = "",
    maxWidth = "max-w-md",
    backgroundColor = "bg-white",
    activeColor = "#C8B560",
    inactiveColor = "text-gray-600",
    borderColor = "border-gray-200"
}: MyTabsProps) {
    return (
        <div className={`flex justify-center ${maxWidth} mx-auto ${backgroundColor} ${borderColor} border-b ${className}`}>
            <div className="flex w-full">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => onTabChange(tab.value)}
                        className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 border-b-2 ${activeTab === tab.value
                            ? `border-[${activeColor}] text-black font-semibold`
                            : `border-transparent ${inactiveColor} hover:text-gray-800 hover:border-gray-300`
                            }`}
                        style={{
                            borderBottomColor: activeTab === tab.value ? activeColor : 'transparent'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}