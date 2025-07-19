// src/app/login/page.tsx
"use client";

import React, { useState } from "react";
import NotificationComponent from "@/components/ui/NotificationComponent";
import LabelComponent from "@/components/ui/LabelComponent";
import ButtonComponent from "@/components/ui/ButtonComponent";
import Link from "next/link";
import api from "@/lib/api";
import { LoginPayload, LoginResponse, ErrorResponse } from "@/types/auth";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email tidak boleh kosong.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid.";
    }
    if (!password) {
      newErrors.password = "Password tidak boleh kosong.";
    } else if (password.length < 6) {
      newErrors.password = "Password minimal 6 karakter.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const payload: LoginPayload = { email, password };

    try {
      const response = await api.post<LoginResponse>("/auth/login", payload);
      console.log("Login successful:", response.data);

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);

        // Decode JWT untuk mendapatkan nama (tanpa library)
        const decoded = JSON.parse(atob(response.data.token.split(".")[1]));
        const name = decoded?.name || "User";
        localStorage.setItem("userName", name);

        setShowToast(true);
        setTimeout(() => router.push("/"), 2000);
      } else {
        setErrors({ general: "Login berhasil tapi token tidak ditemukan." });
      }
    } catch (error: unknown) {
      console.error("Login error:", error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        console.error("Axios Error response:", axiosError.response?.data);
        console.error("Axios Error status:", axiosError.response?.status);

        if (axiosError.response) {
          const errorData: ErrorResponse = axiosError.response.data;
          setErrors({ general: errorData.message || "Email atau password salah." });
        } else if (axiosError.request) {
          setErrors({ general: "Tidak ada respon dari server. Pastikan API berjalan." });
        } else {
          setErrors({ general: "Terjadi kesalahan saat mengatur permintaan. Silakan coba lagi." });
        }
      } else if (error instanceof Error) {
        setErrors({ general: error.message || "Terjadi kesalahan yang tidak diketahui." });
      } else {
        setErrors({ general: "Terjadi kesalahan yang tidak diketahui." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <NotificationComponent
        variant="success"
        open={showToast}
        setOpen={setShowToast}
        title="Horeee Login Berhasil"
        description={`Selamat Datang`}
      />

      <div className='flex flex-col item-start gap-5 p-6 rounded-2xl border border-[#E9EAEB] w-[345px] sm:w-[400px]'>
        <h1 className='text-2xl font-bold text-[#181D27]'>Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <LabelComponent
            id="email"
            label="Email"
            type="text"
            placeholder="masukan email anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)} error={errors.email}
          />
          <LabelComponent
            id="password"
            label="Password"
            type="password"
            placeholder="masukan password anda"
            value={password}
            onChange={(e) => setPassword(e.target.value)} error={errors.password}
          />
          <ButtonComponent type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </ButtonComponent>
          <div className="text-center mt-4">
            <p className="text-sm font-normal text-[#0A0D12]">
              Dont have an account?{" "}
              <Link href="/register" className="font-bold text-blue-500 hover:text-blue-800">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
