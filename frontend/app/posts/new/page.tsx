"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCategories, createPost } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Category } from "@/types";

export default function NewPostPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState<number | "">("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState("");
    const { token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        getCategories().then(setCategories).catch(() => setError("Failed to load categories"));
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("You must be logged in to create a post.");
            return;
        }

        if (categoryId === "") {
            setError("Please select a category.");
            return;
        }

        try {
            await createPost(title, content, categoryId, token);
            router.push("/");
        } catch (err) {
            setError("Failed to create post.");
        }
    }

    return (
        <main className="max-w-xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">
            New Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
        <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded"
        required
        />

        <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onInput={(e) => {
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
        }}
        className="w-full border p-2 rounded"
        required
        />

        <select
        value={categoryId}
        onChange={(e) => setCategoryId(Number(e.target.value))}
        className="w-full border p-2 rounded"
        required
        >
        <option value="">Select a category</option>
        {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
            {cat.name}
            </option>
        ))}
        </select>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" className="w-full bg-black text-white py-2 rounded">
            Publish
        </button>
        </form>
        </main>
    );
}
