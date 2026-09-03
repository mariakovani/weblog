"use client";

import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  getPostById,
  getCategories,
  updatePost,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Category } from "@/types";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const postId = Number(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const post = await getPostById(postId);

        setTitle(post.title);
        setContent(post.content);
        setCategoryId(post.category.id);
        setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
        }, 0);

        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to load edit page:", err);
        setError(err instanceof Error ? err.message : "Failed to load post.");
      }
    }

    loadData();
  }, [postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("You must be logged in.");
      return;
    }

    if (categoryId === "") {
      setError("Please select a category.");
      return;
    }

    try {
      await updatePost(
        postId,
        title,
        content,
        categoryId,
        token
      );

      router.push(`/posts/${postId}`);
    } catch (err) {
      console.error("Failed to update post:", err);
      setError(err instanceof Error ? err.message : "Failed to update post.");
    }
  }

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="font-didot font-bold text-2xl">
        Edit Post
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onInput={(e) => {
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
          }}
          className="w-full border p-2 rounded resize-none overflow-hidden break-words"
          required
        />

        <select
          value={categoryId}
          onChange={(e) =>
            setCategoryId(Number(e.target.value))
          }
          className="w-full border p-2 rounded"
          required
        >
          <option value="" disabled>
            Select a category
          </option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {error && (
          <p className="text-red-600 text-sm">
            {error}
          </p>
        )}

        <button type="submit" className="w-full bg-black text-white py-2 rounded">
          Save Changes
        </button>
      </form>
    </main>
  );
}