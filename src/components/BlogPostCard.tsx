import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/blog";
import { formatPostDate } from "@/lib/posts";

interface BlogPostCardProps {
  post: BlogPost;
  variant?: "default" | "compact";
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, variant = "default" }) => {
  // Gunakan placeholder
  const imageUrl = post.imageUrl || "/images/placeholder-blog.jpg";

  if (variant === "compact") {
    return (
      <Link href={`/posts/${post.id}`} className="flex items-center space-x-3 group">
        <div className="relative w-20 h-16 flex-shrink-0">
          <Image src={imageUrl} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ objectFit: "cover", borderRadius: "4px" }} priority={true} />
        </div>
        <div>
          <h3 className="text-md font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{post.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{formatPostDate(post.createdAt)}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/posts/${post.id}`} className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative w-full h-48 sm:h-56 lg:h-64">
        <Image src={imageUrl} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ objectFit: "cover" }} priority={true} />
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h2>
        <div className="flex flex-wrap gap-2 text-xs font-semibold mb-4">
          {post.tags.map((tag, index) => (
            <span key={`${tag}-${index}`} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-gray-700 text-base line-clamp-3 mb-4">{post.content}</p>
        <div className="flex items-center text-gray-600 text-sm">
          {post.author && (
            <div className="flex items-center mr-4">
              <span className="font-semibold text-gray-800">{post.author.name}</span>
            </div>
          )}
          <span>{formatPostDate(post.createdAt)}</span>
          <span className="ml-auto flex items-center">
            {/* Icon Likes */}
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12.586l4.293-4.293a1 1 0 011.414 1.414L10 15.414l-5.707-5.707a1 1 0 011.414-1.414L10 12.586z"></path>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM5 8a.5.5 0 01.5-.5h4a.5.5 0 010 1h-4A.5.5 0 015 8z" clipRule="evenodd"></path>
            </svg>
            {post.likes}
          </span>
          <span className="ml-2 flex items-center">
            {/* Icon Comments */}
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm10 0a1 1 0 100 2 1 1 0 000-2zm-3 0a1 1 0 100 2 1 1 0 000-2zm-3 0a1 1 0 100 2 1 1 0 000-2z"></path>
            </svg>
            {post.comments}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;
