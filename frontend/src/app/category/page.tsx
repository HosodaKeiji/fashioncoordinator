"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: number;
  name: string;
};

export default function CategoryList() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/categories");
      if (!res.ok) throw new Error("カテゴリ一覧の取得に失敗しました");
      const data = await res.json();
      setCategories(data.data || data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleAddCategory() {
    setError(null);
    if (!newName.trim()) {
      setError("名前を入力してください");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "追加に失敗しました");
      }
      setNewName("");
      setModalOpen(false);
      await fetchCategories();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#0072e6", borderBottom: "3px solid #0072e6", paddingBottom: 6 }}>
        カテゴリ一覧
      </h2>

      {loading && <p style={{ color: "#0072e6" }}>読み込み中...</p>}
      {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {categories.map((cat) => (
          <li
            key={cat.id}
            style={{
              backgroundColor: "#80bfff",
              marginBottom: 8,
              padding: "10px 14px",
              borderRadius: 6,
              color: "#003a75",
              fontWeight: "600",
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            }}
          >
            {cat.name}
          </li>
        ))}
      </ul>

      <button
        onClick={() => setModalOpen(true)}
        style={{
          backgroundColor: "#0072e6",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "12px 24px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 3px 6px rgba(0,114,230,0.4)",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0072e6")}
      >
        カテゴリを追加
      </button>

      <button
        onClick={() => router.push("/home")}
        style={{
          backgroundColor: "#80bfff",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "12px 24px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 3px 6px rgba(0,114,230,0.4)",
          transition: "background-color 0.3s ease",
          margin: "10px",
        }}
      >
        ホームに戻る
      </button>

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: 24,
              borderRadius: 10,
              width: 320,
              boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, marginBottom: 16, color: "#0072e6" }}>カテゴリ追加</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="名前を入力してください"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 6,
                border: "1.5px solid #80bfff",
                marginBottom: 16,
                fontSize: 16,
                outline: "none",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#0072e6")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#80bfff")}
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleAddCategory}
                style={{
                  backgroundColor: "#0072e6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "10px 18px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 3px 6px rgba(0,114,230,0.4)",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0072e6")}
              >
                追加する
              </button>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  marginLeft: 10,
                  backgroundColor: "#80bfff",
                  color: "#003a75",
                  border: "none",
                  borderRadius: 6,
                  padding: "10px 18px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 3px 6px rgba(128,191,255,0.6)",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5f9fe0")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#80bfff")}
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
