'use client'

import { Search } from "lucide-react";
import { useState } from "react";

interface SearchInputProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    className?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function SearchInput({
    placeholder = "Cari...",
    value: controlledValue,
    onChange,
    onSearch,
    className = "",
    disabled = false,
    size = 'md'
}: SearchInputProps) {
    const [internalValue, setInternalValue] = useState("");

    // Use controlled value if provided, otherwise use internal state
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        if (controlledValue === undefined) {
            setInternalValue(newValue);
        }

        onChange?.(newValue);
    };

    const handleSearch = () => {
        onSearch?.(value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Size variants
    const sizeClasses = {
        sm: "py-1.5 pl-3 pr-20 text-xs",
        md: "py-2 pl-3 pr-24 text-sm",
        lg: "py-3 pl-4 pr-28 text-base"
    };

    const buttonSizeClasses = {
        sm: "px-2",
        md: "px-2.5",
        lg: "px-3"
    };

    const iconSizeClasses = {
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-5 h-5"
    };

    return (
        <div className={`w-full max-w-sm min-w-[185px] ${className}`}>
            <div className="relative">
                <input
                    value={value}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    disabled={disabled}
                    className={`w-full bg-[#F5F5F5] placeholder:text-gray-400 text-gray-700 border-2 border-[#C8B560] rounded-md transition duration-300 ease focus:outline-none focus:border-[#C8B560] focus:ring-2 focus:ring-[#C8B560]/20 hover:border-[#B8A550] shadow-sm focus:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]}`}
                    placeholder={placeholder}
                />
                <button
                    onClick={handleSearch}
                    disabled={disabled}
                    className={`absolute top-0 right-0 flex items-center justify-center rounded-r bg-white h-full border-2 border-[#C8B560] text-center text-white transition-all shadow-sm hover:bg-[#B8A550] hover:border-[#B8A550] focus:shadow-md focus:outline-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${buttonSizeClasses[size]}`}
                    type="button"
                    aria-label="Search"
                >
                    <Search className={iconSizeClasses[size]} color="black" />
                </button>
            </div>
        </div>
    )
}