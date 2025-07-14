'use client'

import { LoginUI } from "@/components/auth_ui/login_ui";
import { useGuestRoute } from "@/hooks/useAuthRedirect";
import { Suspense } from "react";

function LoginContent() {
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
        <div className="min-h-screen flex justify-center items-center bg-[#4CAF50]">
            <LoginUI />
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex justify-center items-center bg-[#4CAF50]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}