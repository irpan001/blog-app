'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { getRecommendedPosts, getMostLikedPosts, getPostsBySearch } from '@/lib/posts';
import { BlogPost } from '@/types/blog';
import RecommendedPosts from '@/components/layout/RecomendedPost';
import MostLiked from '@/components/layout/MostLiked';
import { useSearchParams } from 'next/navigation';
import Footer from '@/components/layout/Footer';



const HomePage = () => {
  const [recommendedPosts, setRecommendedPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [mostLikedPosts, setMostLikedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query') || '';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (searchQuery.trim()) {
          // Kalau ada query, pakai search API
          const results = await getPostsBySearch(searchQuery);
          setRecommendedPosts(results);
          setTotalPage(1);
          setCurrentPage(1);
        } else {
          // Kalau ga ada query, tampilkan normal
          const recommended = await getRecommendedPosts({ limit: 10, page: currentPage });
          setRecommendedPosts(recommended.data);
          setTotalPage(recommended.lastPage);

          const mostLiked = await getMostLikedPosts({ limit: 5 });
          setMostLikedPosts(mostLiked.data);
        }
      } catch (error) {
        console.error('Gagal fetch posts', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchQuery]);

  return (
    <div>
      <Header />

      <div className={`grid ${searchQuery ? 'grid-cols-2' : 'grid-cols-3'} py-5 sm:py-6 px-4 sm:px-30 gap-12`}>
        < RecommendedPosts
          posts={recommendedPosts}
          currentPage={currentPage}
          totalPage={totalPage}
          onPageChange={setCurrentPage}
          isSearch={!!searchQuery}
          isLoading={isLoading}
        />
        {!searchQuery && <MostLiked posts={mostLikedPosts} />}
      </div>
      <Footer />
    </div >
  );
};

export default HomePage;
