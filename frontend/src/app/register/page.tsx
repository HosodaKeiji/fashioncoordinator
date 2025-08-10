"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== passwordConfirm) {
      setError("パスワードが一致しません");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          login_id: loginId,
          password,
          password_confirmation: passwordConfirm,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "登録に失敗しました");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch (err) {
      setError("ネットワークエラーが発生しました");
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
      <h1 style={styles.title}>新規登録</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name" style={styles.label}>
          名前
        </label>
        <input
          id="name"
          type="text"
          value={name}
          style={styles.input}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
        />

        <label htmlFor="passwordConfirm" style={styles.label}>
          パスワード（確認）
        </label>
        <input
          id="passwordConfirm"
          type="password"
          value={passwordConfirm}
          style={styles.input}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
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
          {loading ? "登録中..." : "登録"}
        </button>
      </form>

      <p style={styles.footerText}>
        すでにアカウントをお持ちですか？{" "}
        <a href="/login" style={styles.footerLink}>
          ログインはこちら
        </a>
      </p>
    </div>
  );
}
