'use client'

import SearchInput from "@/components/global_ui/search_input";
import { FiturHomeUI } from "@/components/home_ui/fitur_home_ui";
import { FooterUI } from "@/components/home_ui/footer_home_ui";
import { HeaderHomeUI } from "@/components/home_ui/header_home_ui";
import { IntroHomeUI } from "@/components/home_ui/intro_home_ui";
import { PWAInstallPrompt } from "@/components/home_ui/manifest";
import { useGetKelasBySlug } from "@/store/kelas_store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Message, useToaster } from "rsuite";

export default function Home() {
  const router = useRouter();
  const toaster = useToaster();
  const getKelasBySlug = useGetKelasBySlug();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (kodeKelas: string) => {
    if (!kodeKelas.trim()) {
      toaster.push(
        <Message type="warning" showIcon closable>
          Silakan masukkan kode kelas
        </Message>,
        { placement: 'topCenter' }
      );
      return;
    }

    setIsSearching(true);
    try {
      // Attempt to get kelas by slug
      await getKelasBySlug(kodeKelas.trim());

      // If successful, navigate to the kelas page
      router.push(`/${kodeKelas.trim()}`);

    } catch (error) {
      // Handle error (likely 404)
      console.error('Kelas search error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Kode kelas tidak ditemukan';

      toaster.push(
        <Message type="error" showIcon closable>
          {errorMessage}
        </Message>,
        { placement: 'topCenter' }
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
<main className="flex flex-col h-full">
      <HeaderHomeUI />
      <div>
        <PWAInstallPrompt/>
        <IntroHomeUI />
        <div className="pb-5 px-4 sm:px-10 bg-[#E8F5E9] flex justify-center">
          <div className="w-full sm:w-auto sm:min-w-[400px] sm:max-w-[500px]">
            <SearchInput
              placeholder="Masukkan Kode Kelas..."
              onSearch={handleSearch}
              disabled={isSearching}
            />
          </div>
        </div>
        <div className="w-full h-[18px] bg-[#4CAF50]" />
        <FiturHomeUI />
        <div className="w-full h-[18px] bg-[#4CAF50]" />
      </div>
      <FooterUI />
    </main>
  );
}
