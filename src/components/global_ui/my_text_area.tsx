import clsx from "clsx";
import React from "react";

interface textAreaProps {
    title: string;
    placeholder?: string;
    bgColor?: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    required?: boolean;
    rows?: number;
}

export function MyTextArea({ title, placeholder, bgColor, value, required = false, rows = 3, onChange }: textAreaProps) {
    return (
        <div className="flex flex-col gap-2">
            <label className="font-medium text-sm text-[#374151]">{title}</label>
            <div className="relative">
                <textarea
                    placeholder={placeholder}
                    value={value}
                    required={required}
                    rows={rows}
                    onChange={onChange}
                    className={clsx("border-[1px] min-h-[50px] w-full placeholder:font-medium rounded-md focus:border-[#74B49B] border-[#C8B560] px-2 py-1 outline-none resize-y", bgColor)}
                />
            </div>
        </div>
    )
}