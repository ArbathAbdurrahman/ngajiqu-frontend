'use client'

import { RegisterUI } from "@/components/auth_ui/register_ui"
import { useGuestRoute } from "@/hooks/useAuthRedirect";
import { Suspense } from "react";

function RegisterContent() {
    // Redirect to dashboard if already authenticated
    const { isLoading } = useGuestRoute();

    // Show loading while checking auth or redirecting
    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#4CAF50]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#4CAF50]">
            <RegisterUI />
        </main>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex justify-center items-center bg-[#4CAF50]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
            </div>
        }>
            <RegisterContent />
        </Suspense>
    );
}