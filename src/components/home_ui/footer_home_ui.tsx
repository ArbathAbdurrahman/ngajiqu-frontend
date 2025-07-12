import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function FooterUI() {
    return (
        <footer
            className="flex flex-col w-full py-12 gap-8 sm:px-20 px-10 bg-white"
        >
            <div className="flex sm:flex-row flex-col gap-8">
                <div className="flex flex-col gap-6 flex-1">
                    <div className="flex items-center gap-2">
                        {/* <Image
                            src={"/logo.svg"}
                            alt="logo"
                            width={24}
                            height={24}
                            className="w-[24px] h-[24px]"
                        /> */}
                        <h4 className="font-bold text-lg text-[#4CAF50]">NgajiQu</h4>
                    </div>
                    <p className="text-[#4B5563] text-sm">Progres Ngaji di Ujung Jari, Terpantau Sepenuh Hati.</p>
                </div>
                <div className="flex flex-2 flex-col gap-4">
                    <h4 className="text-lg font-bold">kontak</h4>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-2">
                            <Phone color="#388E3C" />
                            <p className="text-[#4B5563] text-sm">0800-1234-5678</p>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Mail color="#388E3C" />
                            <p className="text-[#4B5563] text-sm">help@kopkas.org</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-2 flex-col gap-4">
                    <h4 className="text-lg font-bold">Media Sosial</h4>
                    <div className="flex flex-row gap-2">
                        <Link
                            href={""}
                            className="flex justify-center items-center p-3 rounded-full w-10 h-10 bg-[#388E3C] ">
                            <Image
                                src={"/svg/facebook.svg"}
                                alt="facebook"
                                width={20} height={20}
                                className="w-3"
                            />
                        </Link>
                        <Link
                            href={""}
                            className="flex justify-center items-center p-3 rounded-full w-10 h-10 bg-[#388E3C] ">
                            <Image
                                src={"/svg/twitter.svg"}
                                alt="twitter"
                                width={20} height={20}
                                className="w-4"
                            />
                        </Link>
                        <Link
                            href={""}
                            className="flex justify-center items-center p-3 rounded-full w-10 h-10 bg-[#388E3C] ">
                            <Image
                                src={"/svg/instagram.svg"}
                                alt="instagram"
                                width={20} height={20}
                                className="w-3.5"
                            />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex justify-center text-sm items-center pt-8 border-t-[1px] border-[#E5E7EB]">
                <p>© 2025 NgajiQu. Hak Cipta Dilindungi.</p>
            </div>
        </footer>
    )
}