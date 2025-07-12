import { FiturHomeUI } from "@/components/home_ui/fitur_home_ui";
import { FooterUI } from "@/components/home_ui/footer_home_ui";
import { HeaderHomeUI } from "@/components/home_ui/header_home_ui";
import { IntroHomeUI } from "@/components/home_ui/intro_home_ui";

export default function Home() {
  return (
    <main className="flex flex-col h-full">
      <HeaderHomeUI />
      <div>
        <IntroHomeUI />
        <div className="w-full h-[18px] bg-[#4CAF50]" />
        <FiturHomeUI />
        <div className="w-full h-[18px] bg-[#4CAF50]" />
      </div>
      <FooterUI />
    </main>
  );
}
