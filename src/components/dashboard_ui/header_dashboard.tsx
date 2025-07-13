import Link from "next/link";
import { Avatar } from "rsuite";

export function HeaderDashboard() {
    return (
        <div className="flex flex-row justify-between items-center px-5 py-2 bg-white ">
            <Link className="font-bold sm:text-2xl text-xl text-[#4CAF50]" href="/dashboard">NgajiQu</Link>
            <div>
                <Avatar circle />
            </div>
        </div>
    )
}