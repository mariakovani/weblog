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
    <Link href={`/posts/${postId}/edit`} className="text-sm text-blue-600 block mb-4">
      Edit Post
    </Link>
  );
}