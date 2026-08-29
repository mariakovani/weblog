"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function EditPostLink({
  postId,
  authorUsername,
}: {
  postId: number;
  authorUsername: string;
}) {
  const { token } = useAuth();

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.sub !== authorUsername) return null;
  } catch {
    return null;
  }

  return (
    <div className="flex justify-start mb-4">
    <Link
      href={`/posts/${postId}/edit`}
      className="text-sm text-black border border-black px-3 py-1 rounded hover:bg-black hover:text-white transition"
    >
      Edit Post
    </Link>
  </div>
  );
}