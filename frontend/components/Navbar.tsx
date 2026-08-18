"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <Link href="/" className="font-bold text-lg">
        Weblog
      </Link>

      <div className="flex gap-4">
        {token ? (
          <button onClick={logout} className="text-red-600">
            Logout
          </button>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
