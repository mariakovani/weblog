"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, getUserIdFromToken } from "@/context/AuthContext";
import { deletePost } from "@/lib/api";

export default function EditPostLink({
  postId,
  authorId,
}: {
  postId: number;
  authorId: number;
}) {
  const { token } = useAuth();
  const router = useRouter();

  if (!token) return null;

  const currentUserId = getUserIdFromToken(token);
  if (currentUserId !== authorId) return null;

  async function handleDelete() {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost(postId, token);
      router.push("/");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete post.");
    }
  }

  return (
    <div className="flex justify-start mb-4 gap-2">
    <Link
      href={`/posts/${postId}/edit`}
      className="text-sm text-black border border-black px-3 py-1 rounded hover:bg-black hover:text-white transition"
    >
      Edit Post
    </Link>
    <button onClick={handleDelete} className="text-sm text-black border border-black px-3 py-1 rounded hover:bg-[#e34c51] hover:text-black transition">
        Delete Post
      </button>
  </div>
  );
}