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
        icon: "/feature/intwhiteboard.png",
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
        <div className="flex flex-col justify-center items-center gap-8 sm:px-48 px-5 py-16 bg-white">
            <h2 className="text-[#1F2937] font-bold sm:text-start text-center text-3xl">Fitur Utama</h2>
            <div className="grid grid-cols-2 gap-3">
                {featureContent.map(({ title, icon, }, index) => (
                    <MyCard
                        key={index}
                        bgColor="bg-[#388E3C]"
                        shadow="shadow-xs"
                        className="flex flex-row justify-center items-center flex-1 gap-1"
                        padding="p-3"
                    >
                        <Image
                            src={icon}
                            color="white"
                            alt={title}
                            width={500} height={500}
                            className=" w-full text-white"
                        />
                        <h3
                            className="text-[#F5F5F5] font-semibold text-sm"
                        >{title}</h3>
                    </MyCard>

                ))}
            </div>
            <Link
                href={"/dashboard"}
            >
                <FilledButton
                    paddingy="py-1"
                >
                    Ayo Buat Kelas
                </FilledButton>
            </Link>

        </div>
    );
}