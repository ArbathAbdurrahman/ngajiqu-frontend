import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";


interface FilledButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    bgColor?: string;
    width?: string;
    color?: string;
    paddingx?: string;
    paddingy?: string;
}

export function FilledButton({ children, bgColor = "bg-[#74B49B]", color = "text-white", paddingx = "px-6", paddingy = "py-3", width = "w-auto", ...rest }: FilledButtonProps) {
    return (
        <button
            {...rest}
            className={clsx("inline-block h-auto rounded-lg cursor-pointer", bgColor, color, paddingx, paddingy, width)}
        >
            {children}
        </button>
    )
}