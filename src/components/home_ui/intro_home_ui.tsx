import Image from "next/image";

export function IntroHomeUI() {
    return (
        <div className="flex flex-row sm:gap-20 gap-1 sm:px-48 px-5 sm:py-10 py-10 bg-[#E8F5E9]">
            <div className="flex flex-1 sm:gap-16 gap-5 flex-col">
                <h1 className="sm:text-5xl/tight text-base/tight font-semibold text-left">Progres Ngaji di Ujung Jari, Terpantau Sepenuh Hati</h1>
                <p className="text-left text-xs">NgajiQu hadir untuk memudahkan para ustadz mengorganisir data para santri sehingga orang tua/wali bisa memantau kegiatan TPQ anaknya.</p>
            </div>
            <div className="flex flex-1">
                <Image
                    alt="kopkas"
                    src="/welcome.png"
                    width={1600}
                    height={1600}
                    className="h-auto max-h-[594px] w-[170px] object-contain"
                />
            </div>
        </div>
    );
}