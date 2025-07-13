import React from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { Calendar } from "lucide-react";

interface MyDatePickerProps {
    label?: string;
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
}

export function MyDatePicker({
    label = "Select a Date",
    value,
    onChange,
    placeholder = "Pick a date",
    required = false,
    className = ""
}: MyDatePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleDateSelect = (date: Date | undefined) => {
        onChange?.(date);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                <input
                    type="text"
                    readOnly
                    value={value ? format(value, "dd/MM/yyyy") : ""}
                    placeholder={placeholder}
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8B560] focus:border-transparent cursor-pointer"
                />
                <Calendar
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                    <DayPicker
                        mode="single"
                        selected={value}
                        onSelect={handleDateSelect}
                        showOutsideDays
                        className="border-0"
                        classNames={{
                            caption: "flex justify-center py-2 mb-4 relative items-center",
                            caption_label: "text-sm font-medium text-gray-900",
                            nav: "flex items-center",
                            nav_button:
                                "h-6 w-6 bg-transparent hover:bg-gray-100 p-1 rounded-md transition-colors duration-300",
                            nav_button_previous: "absolute left-1.5",
                            nav_button_next: "absolute right-1.5",
                            table: "w-full border-collapse",
                            head_row: "flex font-medium text-gray-900",
                            head_cell: "m-0.5 w-9 font-normal text-sm",
                            row: "flex w-full mt-2",
                            cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-[#C8B560]/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-[#C8B560]/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                            day: "h-9 w-9 p-0 font-normal hover:bg-gray-100 rounded-md transition-colors",
                            day_range_end: "day-range-end",
                            day_selected:
                                "rounded-md bg-[#C8B560] text-white hover:bg-[#C8B560] hover:text-white focus:bg-[#C8B560] focus:text-white",
                            day_today: "rounded-md bg-gray-200 text-gray-900",
                            day_outside:
                                "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                            day_disabled: "text-gray-500 opacity-50",
                            day_hidden: "invisible",
                        }}
                    />
                </div>
            )}

            {/* Backdrop to close when clicking outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}