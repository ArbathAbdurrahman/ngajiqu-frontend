'use client'

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarProps, Dropdown } from "rsuite";

export function HeaderDashboard() {

    const renderToggle = (props: AvatarProps) => (
        <Avatar circle {...props} />
    );

    return (
        <div className="flex flex-row justify-between items-center px-3 sm:px-5 py-2 sm:py-0 bg-white ">
            <Link
                href="/"
            >
                <Image
                    src={"/logo.png"}
                    alt="logo"
                    width={575}
                    height={300}
                    className=" w-[110px] sm:w-[150px] "
                />
            </Link>

            <Dropdown
                renderToggle={renderToggle}
                placement="leftStart"
            >
                <Dropdown.Item as={Link} href={"/dashboard"}>
                    Dashboard
                </Dropdown.Item>
                <Dropdown.Item as={Link} href={"/dashboard/profile"}>
                    Profile
                </Dropdown.Item>
            </Dropdown>
        </div>
    )
}