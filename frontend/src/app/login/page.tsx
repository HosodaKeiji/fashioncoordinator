"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_id: loginId,
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "ログインに失敗しました");
        setLoading(false);
        return;
      }

      const data = await res.json();

      localStorage.setItem("access_token", data.access_token);

      alert("ログイン成功");
      router.push("/home"); // /homeに遷移

    } catch (err) {
      setError("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  const styles = {
    container: {
      maxWidth: 400,
      margin: "60px auto",
      backgroundColor: "#fff",
      padding: 30,
      borderRadius: 10,
      boxShadow: "0 2px 10px rgba(0, 114, 230, 0.15)",
      fontFamily:
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: "#333",
    },
    title: {
      color: "#0072e6",
      textAlign: "center" as const,
      marginBottom: 25,
      fontWeight: "700",
      fontSize: 28,
    },
    label: {
      display: "block",
      marginBottom: 6,
      fontWeight: 600,
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      marginBottom: 15,
      border: "1.5px solid #80bfff",
      borderRadius: 6,
      fontSize: 16,
      boxSizing: "border-box" as const,
      transition: "border-color 0.3s ease",
    },
    inputFocus: {
      borderColor: "#0072e6",
      outline: "none",
    },
    button: {
      backgroundColor: "#0072e6",
      color: "white",
      border: "none",
      width: "100%",
      padding: "12px 0",
      borderRadius: 8,
      fontSize: 18,
      fontWeight: 700,
      cursor: "pointer",
      transition: "background-color 0.25s ease",
    },
    buttonHover: {
      backgroundColor: "#005bb5",
    },
    error: {
      color: "red",
      marginBottom: 12,
      textAlign: "center" as const,
    },
    footerText: {
      textAlign: "center" as const,
      marginTop: 18,
      fontSize: 14,
      color: "#80bfff",
    },
    footerLink: {
      color: "#0072e6",
      fontWeight: 600,
      textDecoration: "none",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>ログイン</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="loginId" style={styles.label}>
          ログインID
        </label>
        <input
          id="loginId"
          type="text"
          value={loginId}
          style={styles.input}
          onChange={(e) => setLoginId(e.target.value)}
          required
          autoComplete="username"
        />

        <label htmlFor="password" style={styles.label}>
          パスワード
        </label>
        <input
          id="password"
          type="password"
          value={password}
          style={styles.input}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
          style={styles.button}
          type="submit"
          disabled={loading}
          onMouseOver={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#005bb5")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#0072e6")
          }
        >
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </form>

      <p style={styles.footerText}>
        アカウントをお持ちでないですか？{" "}
        <a href="/register" style={styles.footerLink}>
          新規登録はこちら
        </a>
      </p>
    </div>
  );
}
