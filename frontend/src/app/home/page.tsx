"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");

  // ユーザー情報取得
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:8000/api/user", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("ユーザー情報の取得に失敗しました");
        return res.json();
      })
      .then((data) => {
        setUsername(data.name);
      })
      .catch((err) => {
        console.error(err);
        router.push("/login");
      });
  }, [router]);

  async function handleLogout() {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("ログアウトに失敗しました");
      }

      localStorage.removeItem("access_token");
      router.push("/login"); // ログインページへ遷移
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div
      style={{
        maxWidth: 600,
        margin: "100px auto",
        padding: 20,
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        color: "#0072e6",
        textAlign: "center",
      }}
    >
      <h1>{`${username}さんのクローゼット`}</h1>

      <div style={{ marginTop: 30, display: "flex", justifyContent: "center", gap: 20 }}>
        <button
          onClick={() => router.push("/category")}
          style={{
            padding: "10px 20px",
            fontSize: 16,
            backgroundColor: "#0072e6",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            boxShadow: "0 3px 6px rgba(0,114,230,0.4)",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0072e6")}
        >
          カテゴリ一覧ページへ
        </button>

        <button
          onClick={() => router.push("/type")}
          style={{
            padding: "10px 20px",
            fontSize: 16,
            backgroundColor: "#0072e6",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            boxShadow: "0 3px 6px rgba(0,114,230,0.4)",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0072e6")}
        >
          タイプ一覧ページへ
        </button>
      </div>

      <button
        onClick={handleLogout}
        disabled={loading}
        style={{
          marginTop: 40,
          padding: "10px 20px",
          fontSize: 16,
          backgroundColor: "#0072e6",
          color: "#fff",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "ログアウト中..." : "ログアウト"}
      </button>

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </div>
  );
}
