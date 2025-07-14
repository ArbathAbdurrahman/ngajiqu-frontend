import Image from "next/image";

export function IntroHomeUI() {
    return (
        <div className="flex flex-row sm:gap-30 gap-1 justify-between w-full items-center sm:px-60 px-5 sm:py-10 py-10 bg-[#E8F5E9]">
            <div className="flex flex-1 gap-5 flex-col">
                <h1 className="sm:text-3xl/tight text-base/tight font-semibold text-left">Progres Ngaji di Ujung Jari, Terpantau Sepenuh Hati</h1>
                <p className="text-left text-xs sm:text-base">NgajiQu hadir untuk memudahkan pengajar mengorganisir data santri sehingga orang tua/wali bisa memantau kegiatan TPQ putra-putrinya.</p>
            </div>
            <Image
                alt="NgajiQu"
                src="/welcome.png"
                width={1600}
                height={1600}
                className="h-auto w-[170px] sm:w-[270px] object-contain"
            />

        </div>
    );
}