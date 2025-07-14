'use client'

import { useIsAuth } from "@/store/auth_store";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarProps, Dropdown } from "rsuite";



export function HeaderHomeUI() {
    const isAuth = useIsAuth();

    const renderToggle = (props: AvatarProps) => (
        <Avatar circle {...props} />
    );

    return (
        <div className="flex items-center flex-row px-3 py-2 justify-between w-full h-fit z-50 top-0 bg-white">
            <div className="flex items-center gap-2">
                <Link
                    href="/"
                >
                    <Image
                        src={"/logo.png"}
                        alt="logo"
                        width={575}
                        height={300}
                        className=" w-[110px] "
                    />
                </Link>

            </div>
            <div className="flex felx-row gap-2 items-center justify-center">
                {!isAuth ? (
                    <div className="flex flex-row gap-2 justify-center items-center">
                        <Link
                            href={"/login"}
                            className="font-normal text-[#4CAF50] sm:px-6 px-3 py-2"
                        >
                            Masuk
                        </Link>
                        <Link
                            href={"/register"}
                            className="font-white rounded-md text-white bg-[#4CAF50] sm:px-6 px-3 py-2"
                        >
                            Daftar
                        </Link>
                    </div>
                ) : (

                    <div>
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
                )}

            </div>
        </div>
    );
}