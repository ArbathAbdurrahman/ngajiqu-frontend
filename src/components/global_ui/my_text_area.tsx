import clsx from "clsx";
import React, { useRef, useEffect } from "react";

interface textAreaProps {
    title: string;
    placeholder?: string;
    bgColor?: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    required?: boolean;
    rows?: number;
    autoFocus?: boolean;
}

export function MyTextArea({ title, placeholder, bgColor, value, required = false, rows = 3, autoFocus = false, onChange }: textAreaProps) {
    console.log('MyTextArea render:', { title, value, autoFocus });

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (autoFocus && textAreaRef.current) {
            console.log('Focusing textarea via useEffect');
            const timeoutId = setTimeout(() => {
                textAreaRef.current?.focus();
                console.log('TextArea focused via timeout');
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [autoFocus]);

    return (
        <div className="flex flex-col gap-2">
            <label className="font-medium text-sm text-[#374151]">{title}</label>
            <div className="relative">
                <textarea
                    ref={textAreaRef}
                    placeholder={placeholder}
                    value={value}
                    required={required}
                    rows={rows}
                    onChange={(e) => {
                        console.log('TextArea changed:', e.target.value);
                        onChange(e);
                    }}
                    onFocus={() => console.log('TextArea focused')}
                    onBlur={() => console.log('TextArea blurred')}
                    className={clsx("border-[1px] min-h-[50px] w-full placeholder:font-medium rounded-md focus:border-[#74B49B] border-[#C8B560] px-2 py-1 outline-none resize-y", bgColor)}
                />
            </div>
        </div>
    )
}