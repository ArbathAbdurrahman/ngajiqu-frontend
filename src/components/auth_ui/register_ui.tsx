'use client'

import Link from "next/link";
import { FilledButton } from "../global_ui/filled_button";
import { MyTextField } from "../global_ui/my_text_field";
import { MyCard } from "../global_ui/my_card";
import { useAuthStore } from "@/store/auth_store";
import React, { useState } from "react";

export function RegisterUI() {
    const { register, isLoading, clearErorr } = useAuthStore();
    // const user = userUser();

    const [authData, setAuthData] = useState<{ email: string, password: string, confirmPass: string, name: string }>({
        email: "",
        password: "",
        name: "",
        confirmPass: "",
    });

    const [validationErrors, setValidationErrors] = useState<{
        confirmPass?: string,
        password?: string
    }>({});

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        setValidationErrors({});

        const errors: { confirmPass?: string, password?: string } = {};

        if (authData.password.length < 6) {
            errors.password = "Password minimal 6 karakter";
        }

        if (authData.password !== authData.confirmPass) {
            errors.confirmPass = "Password dan konfirmasi password tidak sama";
        }

        await register({
            email: authData.email,
            password: authData.password,
            name: authData.name,
        });
    }


    return (
        <MyCard width="w-auto" height="h-auto" className="flex flex-col gap-4 sm:px-10 px-5 py-5 justify-center items-center">
            <div className="flex flex-col gap-3 items-center">
                {/* <Link href={"/"}>
                    <Image src={"/logo.svg"} alt="logo" width={33} height={33} className="w-[33px] h-[33px]" />
                </Link> */}
                <h1 className="text-3xl font-semibold text-[#1F2937]">Daftar ke KOPKAS</h1>
            </div>
            <form onSubmit={handleRegister} className="flex flex-col gap-4 sm:w-[400px] w-[290px]">
                <MyTextField
                    title="Email"
                    type="email"
                    required={true}
                    placeholder="Masukkan email"
                    onChange={(event) => setAuthData({ ...authData, email: event.target.value })}
                    value={authData.email}
                />
                <MyTextField
                    title="Username"
                    type="text"
                    required={true}
                    placeholder="Buat Username"
                    onChange={(event) => {
                        setAuthData({ ...authData, name: event.target.value })
                        clearErorr();
                    }}
                    value={authData.name}
                />
                <MyTextField
                    title="Password"
                    type="password"
                    required={true}
                    placeholder="Masukkan password"
                    onChange={(event) => {
                        setAuthData({ ...authData, password: event.target.value })
                        clearErorr();
                    }}
                    value={authData.password}
                />
                <MyTextField
                    title="Konfirmasi Password"
                    type="password"
                    required={true}
                    placeholder="Konfirmasi password"
                    onChange={(event) => {
                        setAuthData({ ...authData, confirmPass: event.target.value })
                        setValidationErrors({ ...validationErrors, confirmPass: undefined });
                        clearErorr();
                    }}
                    value={authData.confirmPass}
                />

                {/* <div className="flex flex-col items-start gap-1">
                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            required={true}
                            id="terms-checkbox"
                            checked={authData.terms}
                            onChange={(e) => setAuthData({ ...authData, terms: e.target.checked })}
                            className="mt-1"
                        />
                        <label htmlFor="terms-checkbox" className="text-sm text-gray-700">
                            Saya setuju dengan <Link href="/register/terms" className="text-[#3CB371] hover:underline">Syarat dan Ketentuan</Link> KOPKAS
                        </label>
                    </div>

                    {errors.terms && (
                        <p className="text-red-500 text-sm ml-6">{errors.terms}</p>
                    )}
                </div> */}
                <FilledButton
                    isLoading={isLoading}
                    width='w-full'
                    type="submit"
                    bgColor="bg-[#5C8D89]"

                >
                    Register
                </FilledButton>
            </form>

            <div className="flex flex-col gap-3 justify-center items-center">
                <p className="font-medium">
                    Sudah memiliki akun? <Link href="/login" className="text-[#3CB371]">Login</Link>
                </p>
            </div>
        </MyCard>
    )
}