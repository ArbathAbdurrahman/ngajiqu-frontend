'use client'

import Link from "next/link";
import { FilledButton } from "../global_ui/filled_button";
import { MyTextField } from "../global_ui/my_text_field";
import { MyCard } from "../global_ui/my_card";
import { useAuthActions, useAuthError, useAuthLoading } from "@/store/auth_store";
import React, { useState, useEffect, useRef } from "react";
import { Message, useToaster } from "rsuite";
import { useGuestRoute } from "@/hooks/useAuthRedirect";
import { X } from "lucide-react";
import Image from "next/image";

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-green-500 text-white p-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Syarat dan Ketentuan</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-green-600 p-1 rounded"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[70vh]">
                    <div className="space-y-4 text-sm">
                        <p className="text-gray-700">
                            Dengan mengakses dan menggunakan layanan NgajiQu, Anda dianggap telah membaca, memahami, dan menyetujui seluruh Syarat dan Ketentuan di bawah ini.
                        </p>

                        <div className="space-y-3">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">1. Tujuan Penggunaan</h3>
                                <p className="text-gray-700">
                                    NgajiQu ini disediakan untuk membantu penggunanya dalam belajar Al-Qur&apos;an, menghafal atau mengembangkan kegiatan belajar mengajar, dan administrasi santri.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">2. Akses Pengguna</h3>
                                <ul className="text-gray-700 space-y-1">
                                    <li>• Pengguna bertanggung jawab menggunakan data yang benar, akurat, dan terkini.</li>
                                    <li>• Pengguna bertanggung jawab mengawasi kerahasiaan akun (username & password).</li>
                                    <li>• Setiap aktivitas yang dilakukan melalui akun Anda adalah tanggung jawab Anda sepenuhnya.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">3. Privasi dan Keamanan</h3>
                                <ul className="text-gray-700 space-y-1">
                                    <li>• Data akan dikelola sesuai dengan kebijakan privasi yang berlaku.</li>
                                    <li>• Pengelola akan menjaga kerahasiaan data sesuai dengan kemampuan dan menggunakannya untuk kepentingan operasional TPQ.</li>
                                    <li>• Data tidak akan dibagikan kepada pihak ketiga tanpa izin, kecuali jika diwajibkan oleh hukum.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">4. Larangan Penggunaan</h3>
                                <ul className="text-gray-700 space-y-1">
                                    <li>• Menyalahgunakan aplikasi untuk kegiatan yang melanggar hukum atau merugikan pihak lain.</li>
                                    <li>• Menggunakan atau mendistribusikan konten yang bersifat ilegal, fitnah, atau mengandung unsur SARA.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">5. Hubungi Kami</h3>
                                <ul className="text-gray-700 space-y-1">
                                    <li>• Email: [alamat email resmi TPQ]</li>
                                    <li>• Telepon/WA: [nomor kontak]</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 border-t">
                    <button
                        onClick={onClose}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        </div>
    );
};

export function RegisterUI(): React.JSX.Element {
    const { register, clearError } = useAuthActions();
    const isLoading = useAuthLoading();
    const error = useAuthError();
    const toaster = useToaster();
    const errorShownRef = useRef<string | null>(null);

    // Redirect authenticated users to dashboard
    useGuestRoute();

    const [authData, setAuthData] = useState<{
        email: string,
        password: string,
        confirmPass: string,
        name: string,
        terms: boolean
    }>({
        email: "",
        password: "",
        name: "",
        confirmPass: "",
        terms: false,
    });

    const [validationErrors, setValidationErrors] = useState<{
        confirmPass?: string,
        password?: string,
        terms?: string
    }>({});

    const [showTermsModal, setShowTermsModal] = useState<boolean>(false);

    // Show error toaster when error occurs - with duplicate prevention
    useEffect(() => {
        if (error && error !== errorShownRef.current) {
            errorShownRef.current = error;

            toaster.push(
                <Message type="error" showIcon closable>
                    <strong>Registrasi Gagal!</strong> {error}
                </Message>,
                { placement: 'topCenter' }
            );

            // Clear error setelah delay singkat
            const timeoutId = setTimeout(() => {
                clearError();
                errorShownRef.current = null;
            }, 100);

            return () => clearTimeout(timeoutId);
        }
    }, [error, clearError, toaster]);

    // Clear error when user starts typing
    useEffect(() => {
        if (error) {
            clearError();
        }
    }, [authData.email, authData.password, authData.name, clearError, error]);

    const handleRegister = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        setValidationErrors({});
        // Tidak perlu clearError() karena auth store sudah clear otomatis

        const errors: { confirmPass?: string, password?: string, terms?: string } = {};

        if (authData.password.length < 6) {
            errors.password = "Password minimal 6 karakter";
        }

        if (authData.password !== authData.confirmPass) {
            errors.confirmPass = "Password dan konfirmasi password tidak sama";
        }

        if (!authData.terms) {
            errors.terms = "Anda harus menyetujui syarat dan ketentuan";
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            await register({
                username: authData.name,
                email: authData.email,
                password1: authData.password,
                password2: authData.confirmPass,
            });

            // Show success message
            toaster.push(
                <Message type="success" showIcon closable>
                    <strong>Registrasi Berhasil!</strong> Selamat datang di NgajiQu.
                </Message>,
                { placement: 'topCenter' }
            );
        } catch (error) {
            // Error akan ditangani oleh useEffect di atas
            console.error('Register error:', error);
        }
    }

    return (
        <>
            <MyCard width="w-auto" height="h-auto" className="flex flex-col gap-4 sm:px-10 px-5 py-5 justify-center items-center">
                <div className="flex flex-col items-center">
                    <Link
                        href="/"
                    >
                        <Image
                            src={"/Logo2.png"}
                            alt="logo"
                            width={500}
                            height={500}
                            className=" w-[70px] "
                        />
                    </Link>
                    <h1 className="text-xl font-semibold">Daftar ke NgajiQu</h1>
                </div>

                <div className="flex flex-col gap-4 sm:w-[400px] w-[290px]">
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
                            clearError();
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
                            clearError();
                        }}
                        value={authData.password}
                    // error={validationErrors.password}
                    />
                    <MyTextField
                        title="Konfirmasi Password"
                        type="password"
                        required={true}
                        placeholder="Konfirmasi password"
                        onChange={(event) => {
                            setAuthData({ ...authData, confirmPass: event.target.value })
                            setValidationErrors({ ...validationErrors, confirmPass: undefined });
                            clearError();
                        }}
                        value={authData.confirmPass}
                    // error={validationErrors.confirmPass}
                    />

                    <div className="flex flex-col items-start gap-1">
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                required={true}
                                id="terms-checkbox"
                                checked={authData.terms}
                                onChange={(e) => {
                                    setAuthData({ ...authData, terms: e.target.checked });
                                    setValidationErrors({ ...validationErrors, terms: undefined });
                                }}
                                className="mt-1"
                            />
                            <label htmlFor="terms-checkbox" className="text-sm text-gray-700">
                                Saya setuju dengan{" "}
                                <button
                                    type="button"
                                    onClick={() => setShowTermsModal(true)}
                                    className="text-[#3CB371] hover:underline"
                                >
                                    Syarat dan Ketentuan
                                </button>{" "}
                                NgajiQu
                            </label>
                        </div>

                        {validationErrors.terms && (
                            <p className="text-red-500 text-sm ml-6">{validationErrors.terms}</p>
                        )}
                    </div>

                    <FilledButton
                        isLoading={isLoading}
                        width='w-full'
                        type="submit"
                        onClick={handleRegister}
                    >
                        Register
                    </FilledButton>
                </div>

                <div className="flex flex-col gap-3 justify-center items-center">
                    <p className="font-medium">
                        Sudah memiliki akun? <Link href="/login" className="text-[#388E3C]">Login</Link>
                    </p>
                </div>
            </MyCard>

            <TermsModal
                isOpen={showTermsModal}
                onClose={() => setShowTermsModal(false)}
            />
        </>
    )
}