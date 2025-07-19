// src/lib/posts.ts
import api from "./api";
import { PaginatedPostsResponse, BlogPost } from "@/types/blog";

interface GetPostsParams {
  limit?: number;
  page?: number;
}

export async function getRecommendedPosts(
  params: GetPostsParams = { limit: 10, page: 1 } // Default limit 10, page 1
): Promise<PaginatedPostsResponse> {
  try {
    const response = await api.get<PaginatedPostsResponse>("/posts/recommended", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching recommended posts:", error);
    throw error;
  }
}

export async function getMostLikedPosts(
  params: GetPostsParams = { limit: 10, page: 1 } // Default limit 10, page 1
): Promise<PaginatedPostsResponse> {
  try {
    const response = await api.get<PaginatedPostsResponse>("/posts/most-liked", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching most liked posts:", error);
    throw error;
  }
}

// Fungsi untuk memformat tanggal agar lebih mudah dibaca
export function formatPostDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options); // Contoh: "27 May 2025"
}


export async function getPostById(id: string): Promise<BlogPost | null> {
  try {
    const res = await api.get(`/posts/${id}`);
    return res.data;
  } catch (error) {
    console.error("Gagal fetch post detail:", error);
    return null;
  }
}

export async function getPostsBySearch(query: string): Promise<BlogPost[]> {
  try {
    const response = await api.get(`/posts/search`, {
      params: { query }
    });
    return response.data.data || [];
  } catch (error) {
    console.error("Error searching posts:", error);
    return [];
  }
}


export async function getPostsByUser(userId: number, limit = 10, page = 1) {
  const res = await api.get(`/posts/by-user/${userId}?limit=${limit}&page=${page}`);
  return res.data as {
    data: BlogPost[];
    page: number;
    lastPage: number;
  };
}

export async function deletePostById(id: number): Promise<{ success: boolean }> {
  try {
    const res = await api.delete(`/posts/${id}`);
    return res.data;
  } catch (error) {
    console.error("Gagal menghapus post:", error);
    throw error;
  }
}
