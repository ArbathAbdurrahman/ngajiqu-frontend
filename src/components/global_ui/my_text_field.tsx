import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import React, { HTMLInputTypeAttribute, useState } from "react";

interface textFieldProps {
    title: string;
    type: HTMLInputTypeAttribute;
    placeholder?: string;
    bgColor?: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

export function MyTextField({ title, type, placeholder, bgColor, value, required = false, onChange }: textFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="flex flex-col gap-2">
            <label className="font-medium text-sm text-[#374151]">{title}</label>
            <div className="relative">
                <input
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    required={required}
                    onChange={onChange}
                    className={clsx("border-[1px] h-[50px] w-full placeholder:font-medium rounded-md focus:border-[#74B49B]  border-[#C8B560] px-2 py-1 outline-none", bgColor)}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-700 hover:text-green-800"
                    >
                        {showPassword ? (
                            <Eye />
                        ) : (
                            <EyeOff />
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}