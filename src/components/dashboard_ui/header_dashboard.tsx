import Image from "next/image";
import Link from "next/link";
import { Avatar } from "rsuite";

export function HeaderDashboard() {
    return (
        <div className="flex flex-row justify-between items-center px-3 py-2 bg-white ">
            <Link
                href="/dashboard"
            >
                <Image
                    src={"/logo.png"}
                    alt="logo"
                    width={575}
                    height={300}
                    className=" w-[110px] "
                />
            </Link>
            <div>
                <Link href={"/dashboard/profile"}>
                    <Avatar circle />
                </Link>
            </div>
        </div>
    )
}