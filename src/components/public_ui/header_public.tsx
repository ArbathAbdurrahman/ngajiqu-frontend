import Link from "next/link";

export function HeaderPublic() {
    return (
        <div className="flex flex-row justify-start items-center px-5 py-4.5 bg-white ">
            <Link className="font-bold sm:text-2xl text-xl text-[#4CAF50]" href="/">NgajiQu</Link>
        </div>
    )
}