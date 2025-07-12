'use client'

import Image from "next/image";
import Link from "next/link";



export function HeaderHomeUI() {

    return (
        <div className="flex items-center flex-row sm:px-20 px-3 py-4 justify-between w-full h-fit z-50 top-0 bg-white">
            <div className="flex items-center gap-2">
                {/* <Image
                    src={"/logo.svg"}
                    alt="logo"
                    width={24}
                    height={24}
                    className="w-[24px] h-[24px]"
                /> */}
                <Link className="font-bold sm:text-2xl text-xl text-[#4CAF50]" href="/">Logo</Link>
            </div>
            <div className="flex felx-row gap-2 items-center justify-center">
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
            </div>
        </div>
    );
}