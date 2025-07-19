"use client";

import React, { useState } from "react";
import LabelComponent from "@/components/ui/LabelComponent";
import ButtonComponent from "@/components/ui/ButtonComponent";
import Link from "next/link";
import api from "@/lib/api";
import { RegisterPayload, RegisterResponse, ErrorResponse } from "@/types/auth";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import NotificationComponent from "@/components/ui/NotificationComponent";

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name) newErrors.name = "Nama tidak boleh kosong.";
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
    if (!confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password tidak boleh kosong.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password dan konfirmasi password tidak cocok.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const payload: RegisterPayload = { name, email, password };

    try {
      const response = await api.post<RegisterResponse>("/auth/register", payload);
      setRegisteredEmail(response.data.email);
      console.log("Registration successful:", response.data);
      setShowToast(true); // trigger toast
      setTimeout(() => router.push("/login"), 2000);
      router.push("/login");
    } catch (error: unknown) {
      // <-- Ganti 'any' jadi 'unknown'
      console.error("Registration error:", error);

      // --- Cek Tipe Error dengan Type Guard ---
      if (axios.isAxiosError(error)) {
        // <-- Gunakan type guard AxiosError
        const axiosError = error as AxiosError<ErrorResponse>; // Cast ke AxiosError<ErrorResponse>
        console.error("Axios Error response:", axiosError.response?.data);
        console.error("Axios Error status:", axiosError.response?.status);

        if (axiosError.response) {
          // Error dari backend (misal: 400 Bad Request, 409 Conflict - email sudah terdaftar)
          const errorData: ErrorResponse = axiosError.response.data; // Data error dari backend
          setErrors({ general: errorData.message || "Pendaftaran gagal. Email mungkin sudah terdaftar." });
        } else if (axiosError.request) {
          // Request dibuat tapi tidak ada respon (misal: server mati, koneksi terputus)
          setErrors({ general: "Tidak ada respon dari server. Pastikan API berjalan." });
        } else {
          // Error lain saat mengatur request
          setErrors({ general: "Terjadi kesalahan saat mengatur permintaan. Silakan coba lagi." });
        }
      } else if (error instanceof Error) {
        // Error JavaScript standar
        setErrors({ general: error.message || "Terjadi kesalahan yang tidak diketahui." });
      } else {
        // Jenis error lain yang tidak terduga
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
        title="Horeee Registrasi Berhasil"
        description={`Akun ${registeredEmail} berhasil dibuat. Silakan login.`}
      />

      <div className='flex flex-col item-start gap-5 p-6 rounded-2xl border border-[#E9EAEB] w-[345px] sm:w-[400px]'>
        <h1 className='text-2xl font-bold text-[#181D27]'>Register</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <LabelComponent
            id="name"
            label="Nama"
            type="text"
            placeholder="masukan nama anda"
            value={name}
            onChange={(e) => setName(e.target.value)} error={errors.name}
          />
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
          <LabelComponent
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="masukan password anda"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword}
          />
          <ButtonComponent type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </ButtonComponent>
          <div className="text-center mt-4">
            <p className="text-sm font-normal text-[#0A0D12]">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-blue-500 hover:text-blue-800">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage