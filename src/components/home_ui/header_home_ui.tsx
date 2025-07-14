'use client'

import { useIsAuth } from "@/store/auth_store";
import Image from "next/image";
import Link from "next/link";



export function HeaderHomeUI() {
    const isAuth = useIsAuth();

    return (
        <div className="flex items-center flex-row sm:px-20 px-3 py-2 justify-between w-full h-fit z-50 top-0 bg-white">
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
                        <Link
                            href={"/dashboard"}
                            className="font-white rounded-md text-white bg-[#4CAF50] sm:px-6 px-3 py-2"
                        >
                            Dashboard
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}