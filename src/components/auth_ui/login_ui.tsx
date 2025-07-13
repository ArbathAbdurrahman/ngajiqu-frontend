'use client'

import Link from "next/link";
import { FilledButton } from "../global_ui/filled_button";
import { MyTextField } from "../global_ui/my_text_field";
import { MyCard } from "../global_ui/my_card";
import { useAuthActions, useAuthError, useAuthLoading } from "@/store/auth_store";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import React, { useState, useEffect } from "react";
import { Message } from "rsuite";

export function LoginUI() {
    const { login, clearError } = useAuthActions();
    const isLoading = useAuthLoading();
    const error = useAuthError();

    // Handle redirects after successful login
    useAuthRedirect();

    const [authData, setAuthData] = useState<{ email: string, password: string }>({
        email: "",
        password: "",
    });

    // Clear error when component mounts or when user starts typing
    useEffect(() => {
        if (error) {
            clearError();
        }
    }, [authData.email, authData.password]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear any previous errors
        clearError();

        // Perform login
        await login(authData.email, authData.password);
    }


    return (

        <MyCard width="w-auto" height="h-auto" bgColor="bg-[#F5F5F5]" className="flex flex-col gap-4 sm:px-10 px-5 py-5 justify-center items-center">
            <div className="flex flex-col gap-3 items-center">
                {/* <Link href={"/"}>
                        <Image src={"/logo.svg"} alt="logo" width={33} height={33} className="w-[33px] h-[33px]" />
                    </Link> */}
                <h1 className="text-xl font-semibold">Login ke NgajiQu</h1>
            </div>

            {error && (
                <div className="w-full sm:w-[400px]">
                    <Message type="error" showIcon>
                        <strong>Error!</strong> {error}
                    </Message>
                </div>
            )}

            <form
                onSubmit={handleLogin}
                className="flex flex-col gap-6 sm:w-[400px] w-[290px]"
            >
                <MyTextField
                    title="Email"
                    type="email"
                    required={true}
                    placeholder="Masukkan email"
                    onChange={(event) => {
                        setAuthData({ ...authData, email: event.target.value });
                    }}
                    value={authData.email}
                />
                <MyTextField
                    title="Password"
                    type="password"
                    required={true}
                    placeholder="Masukkan password"
                    onChange={(event) => {
                        setAuthData({ ...authData, password: event.target.value });
                    }}
                    value={authData.password}
                />
                <FilledButton
                    isLoading={isLoading}
                    type="submit"
                    width="w-full"
                >
                    Login
                </FilledButton>

            </form>
            <div className="flex flex-col gap-3 justify-center items-center">
                <p
                    className="font-medium"
                >
                    Belum memiliki akun?
                    <Link href="/register" className="text-[#388E3C]"> Register</Link>
                </p>
            </div>
        </MyCard>

    )
}