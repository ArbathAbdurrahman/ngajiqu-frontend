'use client'

import Link from "next/link";
import { FilledButton } from "../global_ui/filled_button";
import { MyTextField } from "../global_ui/my_text_field";
import { MyCard } from "../global_ui/my_card";

export function LoginUI() {
    return (
        <div>
            <MyCard width="w-auto" height="h-auto" className="flex flex-col gap-4 sm:px-10 px-5 py-5 justify-center items-center">
                <div className="flex flex-col gap-3 items-center">
                    {/* <Link href={"/"}>
                        <Image src={"/logo.svg"} alt="logo" width={33} height={33} className="w-[33px] h-[33px]" />
                    </Link> */}
                    <h1 className="text-3xl font-semibold text-[#1F2937]">Login ke KOPKAS</h1>
                </div>
                <form
                    // onSubmit={handleSubmit}
                    className="flex flex-col gap-6 sm:w-[400px] w-[290px]"
                >
                    <MyTextField
                        title="Email"
                        type="email"
                        required={true}
                        placeholder="Masukkan email"
                        onChange={(event) => {
                            // setAuthData({ ...authData, email: event.target.value });
                            // setErrors({ ...errors, email: undefined });
                        }}
                        value={""}
                    />
                    <MyTextField
                        title="Password"
                        type="password"
                        required={true}
                        placeholder="Masukkan password"
                        onChange={(event) => {
                            // setAuthData({ ...authData, password: event.target.value });
                            // setErrors({ ...errors, password: undefined });
                        }}
                        value={""}
                    />
                    <FilledButton
                        type="submit"
                        width="w-full"
                        className="font-medium flex justify-center items-center gap-2"
                        bgColor="bg-[#5C8D89]"
                    // disabled={isDisable}
                    >
                        <div className='flex justify-center items-center'>
                            <p>Login</p>
                        </div>
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
        </div>
    )
}