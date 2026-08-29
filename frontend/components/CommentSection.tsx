"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getCommentsByPost, createComment, deleteComment, updateComment } from "@/lib/api";
import { Comment } from "@/types";
import { getDisplayDate } from "@/lib/utils";
import Link from "next/dist/client/link";

export default function CommentSection({ postId }: { postId: number }) {
  const { token } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    loadComments();
  }, [postId]);

  async function loadComments() {
    try {
      const data = await getCommentsByPost(postId);
      setComments(data);
    } catch (err) {
      setError("Failed to load comments");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setError("You must be logged in to comment.");
      return;
    }
    if (!newComment.trim()) return;

    try {
      await createComment(newComment, postId, token);
      setNewComment("");
      await loadComments();
    } catch (err) {
      setError("Failed to post comment.");
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;
    try {
      await deleteComment(id, token);
      await loadComments();
    } catch (err) {
      setError("You don't have permission to delete this comment.");
    }
  }

  function startEdit(comment: Comment) {
    setEditingId(comment.id);
    setEditContent(comment.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditContent("");
  }

  async function saveEdit(id: number) {
    if (!token) return;
    try {
      await updateComment(id, editContent, token);
      setEditingId(null);
      await loadComments();
    } catch (err) {
      setError("Failed to update comment.");
    }
  }

  function getCurrentUsername(): string | null {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub;
    } catch {
      return null;
    }
  }

  function isEdited(comment: Comment): boolean {
    return !!comment.updatedAt && comment.updatedAt !== comment.createdAt;
  }

  const currentUsername = getCurrentUsername();

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">
        Comments
      </h2>

      {token && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="input"
            rows={2}
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
            }}
          />
          <button type="submit" className="btn btn-primary">
            Post Comment
          </button>
        </form>
      )}

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}

        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-2">
            {editingId === comment.id ? (
  <div className="space-y-2">
    <textarea
      value={editContent}
      onChange={(e) => setEditContent(e.target.value)}
      onInput={(e) => {
        e.currentTarget.style.height = "auto";
        e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
      }}
      className="input"
      rows={2}
    />
    <div className="flex gap-2">
      <button onClick={() => saveEdit(comment.id)} className="btn btn-primary" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}>
        Save
      </button>
      <button onClick={cancelEdit} className="btn btn-ghost" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}>
        Cancel
      </button>
    </div>
  </div>
) : (
  <div className="flex justify-between items-start">
    <div>
      <Link href={`/profile/${comment.author?.id}`} className="text-sm font-bold hover:underline">
        {comment.author?.username}
      </Link>
      <p className="text-sm ">{comment.content}</p>
      <p className="text-sm text-gray-500">{getDisplayDate(comment.createdAt, comment.updatedAt)}</p>
    </div>

    {currentUsername === comment.author?.username && (
      <div className="flex gap-3">
        <button onClick={() => startEdit(comment)} className="btn btn-danger" style={{ color: "var(--amber)" }}>
          Edit
        </button>
        <button onClick={() => handleDelete(comment.id)} className="btn btn-danger">
          Delete
        </button>
      </div>
    )}
  </div>
)}
          </div>
        ))}
      </div>
    </div>
  );
}