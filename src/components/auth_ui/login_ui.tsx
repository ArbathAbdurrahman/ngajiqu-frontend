'use client'

import Link from "next/link";
import { FilledButton } from "../global_ui/filled_button";
import { MyTextField } from "../global_ui/my_text_field";
import { MyCard } from "../global_ui/my_card";
import { useAuthStore, userUser } from "@/store/auth_store";
import React, { useState } from "react";

export function LoginUI() {
    const { login, isLoading, error, clearErorr } = useAuthStore();
    const user = userUser();

    const [authData, setAuthData] = useState<{ email: string, password: string }>({
        email: "",
        password: "",
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(authData.email, authData.password);
    }


    return (

        <MyCard width="w-auto" height="h-auto" bgColor="bg-[#F5F5F5]" className="flex flex-col gap-4 sm:px-10 px-5 py-5 justify-center items-center">
            <div className="flex flex-col gap-3 items-center">
                {/* <Link href={"/"}>
                        <Image src={"/logo.svg"} alt="logo" width={33} height={33} className="w-[33px] h-[33px]" />
                    </Link> */}
                <h1 className="text-lg font-semibold text-[#1F2937]">Login ke KOPKAS</h1>
            </div>
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
                        clearErorr();
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
                        clearErorr();
                    }}
                    value={authData.password}
                />
                <FilledButton
                    isLoading={isLoading}
                    type="submit"
                    width="w-full"
                    bgColor="bg-[#5C8D89]"
                >
                    Login
                </FilledButton>

            </form>
            <div className="flex flex-col gap-3 justify-center items-center">
                <p
                    className="font-medium"
                >
                    Belum memiliki akun?
                    <Link href="/register" className="text-[#3CB371]"> Register</Link>
                </p>
                <Link href="login/forget" className="text-[#3CB371] font-medium">Lupa password?</Link>
            </div>
        </MyCard>

    )
}