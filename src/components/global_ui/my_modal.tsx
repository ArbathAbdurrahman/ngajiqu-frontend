import { MyCard } from "./my_card";
import { FilledButton } from "./filled_button";
import { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: ReactNode;

    // Action buttons
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;

    // Styling options
    size?: 'sm' | 'md' | 'lg';
    showCloseButton?: boolean;
    isLoading?: boolean;
    showNote?: boolean;
    noteText?: string;

    // Behavior
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
}

export function MyModal({
    isOpen,
    onClose,
    title,
    children,
    confirmText = "IYA",
    cancelText = "TIDAK",
    onConfirm,
    onCancel,
    size = 'md',
    showCloseButton = false,
    isLoading = false,
    showNote = true,
    noteText = "Note: Data yang dihapus tidak bisa dikembalikan*",
    closeOnBackdrop = true,
    closeOnEscape = true
}: ModalProps) {

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleEscape = (e: React.KeyboardEvent) => {
        if (closeOnEscape && e.key === 'Escape') {
            onClose();
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            onClose();
        }
    };

    const getSizeClass = () => {
        switch (size) {
            case 'sm': return 'max-w-sm';
            case 'md': return 'max-w-md';
            case 'lg': return 'max-w-lg';
            default: return 'max-w-md';
        }
    };

    return (
        <div
            className="fixed inset-0 flex bg-black/30 items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
            onKeyDown={handleEscape}
            tabIndex={-1}
        >
            <div className={`bg-white rounded-2xl shadow-xl ${getSizeClass()} w-full overflow-hidden`}>
                {/* Header */}
                <div className="px-6 py-4 text-center border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                        {title}
                    </h2>
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
                            disabled={isLoading}
                        >
                            ×
                        </button>
                    )}
                </div>

                {/* Content */}
                {children && (
                    <div className="px-6 py-6 text-center">
                        {children}
                    </div>
                )}

                {/* Action Buttons */}
                {(onConfirm || onCancel) && (
                    <div className="px-6 pb-6 flex gap-4 justify-center">
                        {onConfirm && (
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "..." : confirmText}
                            </button>
                        )}
                        {onCancel && (
                            <button
                                onClick={handleCancel}
                                disabled={isLoading}
                                className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {cancelText}
                            </button>
                        )}
                    </div>
                )}

                {/* Note footer (if needed) */}
                {showNote && (onConfirm || onCancel) && (
                    <div className="px-6 pb-4 text-center">
                        <p className="text-xs text-gray-500 italic">
                            {noteText}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}