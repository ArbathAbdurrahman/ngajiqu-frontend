import { Plus } from "lucide-react";

interface PlusButtonProps {
    title: string;
    onClick?: () => void;
    className?: string;
}

export function PlusButton({ title, onClick, className = "" }: PlusButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`bg-[#4CAF50] flex flex-row gap-1 justify-center items-center pl-3 rounded-full hover:bg-[#45a049] transition-colors duration-200 ${className}`}
        >
            <p className="text-white text-sm font-semibold">
                {title}
            </p>
            <div className="bg-black rounded-full p-1.5">
                <Plus color="#4CAF50" size={20} />
            </div>
        </button>
    )
}