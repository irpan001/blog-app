// src/app/write-post/page.tsx
"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { TagsInput } from "react-tag-input-component";
import api from "@/lib/api"; // Pastikan path ini benar
import { BlogPost } from "@/types/blog"; // Pastikan path ini benar
import Button from "@/components/Button"; // Pastikan path ini benar
import axios, { AxiosError } from "axios"; // Pastikan diimpor
import NotificationComponent from "@/components/ui/NotificationComponent";

// --- TIpTap Imports ---
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { ErrorResponse } from "@/types/auth";
import Header from "@/components/layout/Header";

// Tidak ada import Heroicons lagi, kita akan menggunakan SVG inline

export default function WritePostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showToast, setShowToast] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
      }),
      ImageExtension,
    ],
    content: "<p>Enter your content here...</p>",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[250px] p-4 border rounded-md",
      },
    },
    immediatelyRender: false, // Penting untuk Next.js agar editor tidak render di server
  });

  // --- Toolbar untuk TipTap ---
  // Komponen MenuBar dan CircleIcon didefinisikan di sini
  const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
      return null;
    }

    // Komponen SVG ikon lingkaran hitam
    const CircleIcon = ({ className }: { className?: string }) => (
      <svg className={`w-5 h-5 ${className}`} fill="currentColor" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" />
      </svg>
    );

    return (
      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-gray-50 mb-2">
        <NotificationComponent
          variant="success"
          open={showToast}
          setOpen={setShowToast}
          title="Horeee Berhasil Memposting"
          description={`Postingan anda telah dibuat`}
        />
        {/* Tombol Bold */}
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1 rounded text-gray-700 ${editor.isActive("bold") ? "bg-blue-200" : "hover:bg-gray-200"}`}>
          <CircleIcon />
        </button>
        {/* Tombol Italic */}
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1 rounded text-gray-700 ${editor.isActive("italic") ? "bg-blue-200" : "hover:bg-gray-200"}`}>
          <CircleIcon />
        </button>
        {/* Tombol List Bullet */}
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1 rounded text-gray-700 ${editor.isActive("bulletList") ? "bg-blue-200" : "hover:bg-gray-200"}`}>
          <CircleIcon />
        </button>
        {/* Tombol List Ordered */}
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1 rounded text-gray-700 ${editor.isActive("orderedList") ? "bg-blue-200" : "hover:bg-gray-200"}`}>
          <CircleIcon />
        </button>
        {/* Tombol Link */}
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("URL:");
            if (url) {
              editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            }
          }}
          className={`p-1 rounded text-gray-700 ${editor.isActive("link") ? "bg-blue-200" : "hover:bg-gray-200"}`}
        >
          <CircleIcon />
        </button>
        {/* Tombol Unlink */}
        <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")} className="p-1 rounded text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
          Unlink
        </button>
        {/* Tombol Image */}
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("Image URL:");
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          className="p-1 rounded text-gray-700 hover:bg-gray-200"
        >
          <CircleIcon />
        </button>
        {/* Tombol Undo */}
        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-1 rounded text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <CircleIcon />
        </button>
        {/* Tombol Redo */}
        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-1 rounded text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <CircleIcon />
        </button>
      </div>
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setGeneralError("Ukuran gambar maksimal 5MB.");
        setCoverImage(null);
        setFilePreview(null);
        return;
      }
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        setGeneralError("Hanya format PNG atau JPG yang diperbolehkan.");
        setCoverImage(null);
        setFilePreview(null);
        return;
      }

      setCoverImage(file);
      setFilePreview(URL.createObjectURL(file));
      setGeneralError(null);
    } else {
      setCoverImage(null);
      setFilePreview(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setGeneralError("Ukuran gambar maksimal 5MB.");
        setCoverImage(null);
        setFilePreview(null);
        return;
      }
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        setGeneralError("Hanya format PNG atau JPG yang diperbolehkan.");
        setCoverImage(null);
        setFilePreview(null);
        return;
      }

      setCoverImage(file);
      setFilePreview(URL.createObjectURL(file));
      setGeneralError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setIsLoading(true);

    if (!title.trim() || !content.trim() || tags.length === 0 || !coverImage) {
      setGeneralError("Semua field (Title, Content, Cover Image, Tags) harus diisi.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    tags.forEach((tag) => formData.append("tags[]", tag));
    formData.append("image", coverImage);

    try {
      const response = await api.post<BlogPost>("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Post created successfully:", response.data);
      setShowToast(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (error: unknown) {
      console.error("Error creating post:", error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>; // Pastikan ErrorResponse diimpor atau didefinisikan
        console.error("Axios Error response:", axiosError.response?.data);
        console.error("Axios Error status:", axiosError.response?.status);

        if (axiosError.response?.status === 401) {
          setGeneralError("Autentikasi gagal. Silakan login kembali.");
          localStorage.removeItem("authToken");
          router.push("/login");
        } else if (axiosError.response) {
          setGeneralError(axiosError.response.data?.message || "Terjadi kesalahan saat membuat postingan.");
        } else if (axiosError.request) {
          setGeneralError("Tidak ada respon dari server. Pastikan API berjalan.");
        } else {
          setGeneralError("Terjadi kesalahan saat mengatur permintaan. Silakan coba lagi.");
        }
      } else if (error instanceof Error) {
        setGeneralError(error.message || "Terjadi kesalahan yang tidak diketahui.");
      } else {
        setGeneralError("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <Link href="/" className="flex items-center text-gray-600 hover:text-blue-500 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span className="font-semibold">Back Home</span>
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-gray-700 text-lg font-bold mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your title"
                className="shadow-sm border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Content (TipTap Editor) */}
            <div className="mb-6">
              <label className="block text-gray-700 text-lg font-bold mb-2">Content</label>
              {editor && <MenuBar editor={editor} />}
              <EditorContent editor={editor} className="bg-white min-h-[250px] border border-gray-300 rounded-md" />
            </div>

            {/* Cover Image */}
            <div className="mb-6">
              <label className="block text-gray-700 text-lg font-bold mb-2">Cover Image</label>
              <div
                className={`border-2 border-dashed ${filePreview ? "border-gray-300" : "border-blue-300"} rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {filePreview ? (
                  <div className="relative w-full h-48 overflow-hidden rounded-md mx-auto mb-2">
                    <Image src={filePreview} alt="Cover Preview" fill style={{ objectFit: "contain" }} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <p className="text-gray-500 mt-2">Click to upload or drag and drop</p>
                    <p className="text-gray-400 text-sm">PNG or JPG (max. 5MB)</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} accept=".png,.jpg,.jpeg" onChange={handleFileChange} className="hidden" />
              </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <label htmlFor="tags" className="block text-gray-700 text-lg font-bold mb-2">
                Tags
              </label>
              <TagsInput value={tags} onChange={setTags} name="tags" placeHolder="Enter your tags (press Enter or comma)" />
              <em className="text-gray-500 text-sm mt-1 block">Tekan Enter atau koma setelah setiap tag.</em>
            </div>

            {generalError && <p className="text-red-500 text-center text-md mb-4">{generalError}</p>}

            {/* Finish Button */}
            <Button type="submit" className="w-full py-3" disabled={isLoading}>
              {isLoading ? "Processing..." : "Finish"}
            </Button>
          </form>

          <div className="text-center text-gray-500 text-sm mt-8">© {new Date().getFullYear()} Web Programming Hack Blog. All rights reserved.</div>
        </div>
      </div>
    </>
  );
}
