'use client';

import React from 'react';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { formatPostDate } from '@/lib/posts';

type Props = {
  posts: BlogPost[];
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  isSearch?: boolean;
  isLoading?: boolean;
};

const RecommendedPosts: React.FC<Props> = ({
  posts,
  currentPage,
  totalPage,
  onPageChange,
  isSearch = false,
  isLoading = false,
}) => {
  return (
    <div className='col-span-3 sm:col-span-2'>
      <div className='flex flex-col justify-start items-start gap-6'>
        <h1 className='text-[#181D27] text-2xl font-bold'>
          {isSearch ? 'Hasil Pencarian' : 'Recommend For You'}
        </h1>

        {isLoading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : posts.length === 0 ? (
          <div className='flex flex-col justify-center items-center gap-6'>
            <Image src='/img/no-data.png' alt='no-data' width={200} height={200} />
            <p className="text-[#181D27] text-sm">No posts from this user yet</p>
            <p className="text-gray-500 text-sm">Stay tuned for future posts</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id}>
              <div
                className='flex items-center justify-start gap-6 mb-10 hover:opacity-90 transition-all'
              >
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={340}
                  height={258}
                  className='hidden sm:block rounded-xl object-cover'
                />
                <div className='flex flex-col justify-start items-start gap-4'>
                  <p className='text-[#181D27] text-xl font-bold break-all leading-snug line-clamp-2'>
                    {post.title}
                  </p>

                  <div className='flex items-center justify-start gap-2 flex-wrap'>
                    {post.tags.map((tag, index) => (
                      <div
                        key={`${tag}-${index}`}
                        className='border border-[#D5D7DA] rounded-lg px-2 py-1 text-[#181D27] font-normal text-xs'
                      >
                        {tag}
                      </div>
                    ))}
                  </div>

                  <div className='text-[#181D27] font-normal text-sm'>
                    {post.content.length > 120
                      ? `${post.content.substring(0, 120)}...`
                      : post.content}
                  </div>

                  <div className='flex items-center justify-start gap-3'>
                    <div className='flex items-center justify-start gap-2'>
                      <Image src='/icon/icon-user.png' alt='icon-user' width={40} height={40} />
                      <p className='text-[#181D27] text-sm font-medium'>{post.author.name}</p>
                    </div>
                    <Image src='/icon/icon-titik.png' alt='icon-dot' width={4} height={4} />
                    <p className='text-[#535862] text-sm font-medium'>
                      {formatPostDate(post.createdAt)}
                    </p>
                  </div>

                  <div className='flex items-center justify-start gap-5'>
                    <div className='flex items-center justify-start gap-[6px]'>
                      <Image src='/icon/icon-like.svg' alt='icon-like' width={20} height={20} />
                      <p className='text-[#535862] text-sm font-normal'>{post.likes}</p>
                    </div>
                    <div className='flex items-center justify-start gap-[6px]'>
                      <Image src='/icon/icon-comment.svg' alt='icon-comment' width={20} height={20} />
                      <p className='text-[#535862] text-sm font-normal'>{post.comments}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-full h-[1px] bg-[#D5D7DA]' />
            </div>
          ))
        )}

        {/* Pagination hanya muncul kalau bukan search */}
        {!isSearch && posts.length > 0 && (
          <div className='flex items-center justify-center gap-4 mt-6 w-full'>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Previous
            </button>
            <span className='text-sm text-gray-700'>
              Page {currentPage} of {totalPage}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPage}
              className='px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedPosts;
