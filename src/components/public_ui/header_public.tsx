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
        <div className="flex flex-row justify-between items-center px-3 sm:px-5 py-2 sm:py-0 bg-white ">
            <Link
                href="/"
            >
                <Image
                    src={"/logo.png"}
                    alt="logo"
                    width={5750}
                    height={300}
                    className=" w-[110px] sm:w-[150px] "
                />
            </Link>
            {isClient && selectedKelas && (
                <Link href={`/${selectedKelas.slug}`}>
                    <h1 className="font-semibold sm:text-2xl text-lg text-[#4CAF50] ml-4">
                        {selectedKelas.nama}
                    </h1>
                </Link>
            )}
        </div>
    )
}