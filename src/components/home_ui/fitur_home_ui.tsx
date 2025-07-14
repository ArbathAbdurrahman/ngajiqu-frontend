import Image from "next/image";
import { MyCard } from "../global_ui/my_card";
import { FilledButton } from "../global_ui/filled_button";
import Link from "next/link";

interface FeatureItem {
    title: string;
    icon: string;
}

//nav item
const featureContent: FeatureItem[] = [
    {
        title: "Update Progres",
        icon: "/feature/whiteboard.png",
    },
    {
        title: "Kustom Kelas",
        icon: "/feature/Intwhiteboard.png",
    },
    {
        title: "Grafik Progres",
        icon: "/feature/graph.png",
    },
    {
        title: "Dashboard Santri",
        icon: "/feature/people.png",
    },
]

export function FiturHomeUI() {
    return (
        <div className="flex flex-col justify-center items-center gap-6 sm:gap-8 px-4 py-12 sm:py-16 bg-white">
            <h2 className="text-[#1F2937] text-center sm:text-3xl/tight text-base/tight font-semibold">
                Fitur Utama
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 w-full max-w-6xl mx-auto">
                {featureContent.map(({ title, icon }, index) => (
                    <MyCard
                        key={index}
                        bgColor="bg-[#388E3C]"
                        shadow="shadow-xs"
                        className="flex flex-col justify-center items-center gap-2 sm:gap-3 lg:gap-4 h-[120px] sm:h-[140px] lg:h-[160px] w-full"
                        padding="p-3 sm:p-4 lg:p-4"
                    >
                        <div className="w-8 h-8 sm:w-16 sm:h-16 lg:w-14 lg:h-14 relative flex-shrink-0">
                            <Image
                                src={icon}
                                alt={title}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h3 className="text-[#F5F5F5] font-semibold text-xs sm:text-sm lg:text-sm text-center leading-tight">
                            {title}
                        </h3>
                    </MyCard>
                ))}
            </div>

            <div className="mt-4 sm:mt-6">
                <Link href={"/dashboard"}>
                    <FilledButton
                        paddingy="py-2 sm:py-1"
                    >
                        Ayo Buat Kelas
                    </FilledButton>
                </Link>
            </div>
        </div>
    );
}