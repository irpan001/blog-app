'use client';

import React from 'react';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';

type Props = {
  posts: BlogPost[];
};

const MostLiked: React.FC<Props> = ({ posts }) => {
  return (
    <div className='hidden sm:block col-span-1'>
      <div className='flex flex-col justify-start items-start gap-6'>
        <h1 className='text-[#181D27] text-lg font-bold'>Most Liked</h1>
      </div>

      {posts.map((post) => (
        <div key={post.id}>
          <div key={post.id} className='flex flex-col justify-start items-start gap-4 mt-4'>
            <p className='text-[#181D27] text-sm font-bold line-clamp-2'>{post.title}</p>

            <div className='text-[#181D27] font-normal text-xs line-clamp-2'>{post.content}</div>

            <div className='flex items-center justify-start gap-5'>
              <div className='flex items-center justify-start gap-[6px]'>
                <Image src='/icon/icon-like.svg' alt='icon-like' width={20} height={20} />
                <p className='text-[#535862] text-xs font-normal'>{post.likes}</p>
              </div>
              <div className='flex items-center justify-start gap-[6px]'>
                <Image src='/icon/icon-comment.svg' alt='icon-comment' width={20} height={20} />
                <p className='text-[#535862] text-xs font-normal'>{post.comments}</p>
              </div>
            </div>
          </div>
          <div className='w-full h-[1px] bg-[#D5D7DA] mt-2' />
        </div>
      ))}
    </div>
  );
};

export default MostLiked;
