"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getLikesByPost, likePost, unlikePost } from "@/lib/api";
import { Like } from "@/types";

export default function LikeButton({ postId }: { postId: number }) {
  const { token } = useAuth();
  const [likes, setLikes] = useState<Like[]>([]);
  const [myLikeId, setMyLikeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLikes();
  }, [postId]);

  async function loadLikes() {
    try {
      const data: Like[] = await getLikesByPost(postId);
      setLikes(data);

      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const mine = data.find((l) => l.user.username === payload.sub);
        setMyLikeId(mine ? mine.id : null);
      }
    } catch (err) {
      // silently ignore for now
    }
  }

  async function handleClick() {
    if (!token) {
      alert("You must be logged in to like a post.");
      return;
    }

    setLoading(true);
    try {
      if (myLikeId) {
        await unlikePost(myLikeId, token);
      } else {
        await likePost(postId, token);
      }
      await loadLikes();
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`text-sm px-3 py-1 rounded border ${
        myLikeId ? "bg-red-100 border-red-400 text-red-600" : "border-gray-300"
      }`}
    >
      {myLikeId ? "★" : "☆"} {likes.length}
    </button>
  );
}