"use client";

import Link from "next/link";
import { useAuth, getUserIdFromToken } from "@/context/AuthContext";

export default function EditProfileLink({
  userId,
}: {
  userId: number;
}) {
  const { token } = useAuth();

  if (!token) return null;

  const currentUserId = getUserIdFromToken(token);
  if (currentUserId !== userId) return null;

  return (
    <Link href={`/profile/${userId}/edit`} className="btn btn-ghost mt-3" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}>
      Edit Profile
    </Link>
  );
}