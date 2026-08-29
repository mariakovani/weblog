"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function EditProfileLink({
  userId,
  authorUsername,
}: {
  userId: number;
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
    <Link href={`/profile/${userId}/edit`} className="btn btn-ghost mt-3" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}>
      Edit Profile
    </Link>
  );
}