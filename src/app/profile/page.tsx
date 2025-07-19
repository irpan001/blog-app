'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { BlogPost } from '@/types/blog';
import MyPost from '@/components/layout/MyPost';
import { getPostsByUser } from '@/lib/posts';

const ProfilePage = () => {
  const [userPosts, setUserPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);

      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const decoded = JSON.parse(atob(token.split('.')[1]));
        const userId = decoded?.id;

        const result = await getPostsByUser(userId, 10, currentPage);
        setUserPosts(result.data);
        setTotalPage(result.lastPage);
      } catch (err) {
        console.error('Gagal fetch post user:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  return (
    <div>
      <Header />
      <main className="py-5 sm:py-6 px-4 sm:px-30">
        <MyPost
          posts={userPosts}
          currentPage={currentPage}
          totalPage={totalPage}
          onPageChange={setCurrentPage}
          isSearch={true}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default ProfilePage;
