'use client'

import Link from "next/link";
import { useSelectedKelas } from "@/store/kelas_store";
import Image from "next/image";
import { useEffect, useState } from "react";

export function HeaderPublic() {
    const selectedKelas = useSelectedKelas();
    const [isClient, setIsClient] = useState(false);

    // Only run on client side to prevent hydration mismatch
    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="flex flex-row justify-between items-center px-3 py-4.5 bg-white ">
            <Link
                href="/"
            >
                <Image
                    src={"/logo.png"}
                    alt="logo"
                    width={5750}
                    height={300}
                    className=" w-[110px] "
                />
            </Link>
            {isClient && selectedKelas && (
                <h1 className="font-semibold sm:text-2xl text-lg text-[#4CAF50] ml-4">
                    {selectedKelas.nama}
                </h1>
            )}
        </div>
    )
}