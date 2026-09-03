"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getUserIdFromToken } from "@/context/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav
      className="flex justify-between items-center px-8 py-5 border-b"
      style={{ borderColor: "var(--border)" }}
    >
      <Link href="/" className="font-didot text-3xl">
        Weblog ᝰ 
      </Link>

      <div className="flex items-center gap-3">
          {token ? (
            <>
              <Link href="/search" className="btn btn-ghost font-didot text-lg">
                Search
              </Link>
              <Link href={`/profile/${getUserIdFromToken(token)}`} className="btn btn-ghost font-didot text-lg">
                Profile
              </Link>
              <Link href="/posts/new" className="btn btn-primary font-didot text-lg">
                + New Post
              </Link>
              <button onClick={logout} className="btn btn-ghost font-didot text-lg">
                Logout
              </button>
            </>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost font-didot text-lg">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary font-didot text-lg">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}