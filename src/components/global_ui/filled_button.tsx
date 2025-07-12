import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";


interface FilledButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    isLoading?: boolean;
    bgColor?: string;
    width?: string;
    color?: string;
    paddingx?: string;
    paddingy?: string;
}

export function FilledButton({ children, isLoading, bgColor = "bg-[#4CAF50]", color = "text-white", paddingx = "px-6", paddingy = "py-2", width = "w-auto", ...rest }: FilledButtonProps) {
    return (
        <button
            className={clsx(
                "inline-block h-auto rounded-lg font-medium transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:opacity-90",
                isLoading ? "bg-gray-400" : bgColor,
                color,
                paddingx,
                paddingy,
                width
            )}
            disabled={isLoading}
            {...rest}
        >
            <div className="flex items-center justify-center gap-2">
                {isLoading && (
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                )}
                <span>{isLoading ? 'Loading...' : children}</span>
            </div>
        </button>
    )
}