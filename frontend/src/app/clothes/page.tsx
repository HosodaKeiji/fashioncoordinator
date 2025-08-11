"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

interface Type {
  id: number;
  name: string;
}

interface Clothes {
  id: number;
  name: string;
  color: string;
  season: string[];
  category_id: number;
  type_id: number;
}

export default function ClothesPage() {
  const router = useRouter();
  const [clothes, setClothes] = useState<Clothes[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentClothes, setCurrentClothes] = useState<Omit<Clothes, "id"> & { id?: number }>({
    name: "",
    color: "",
    season: [],
    category_id: 0,
    type_id: 0,
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const fetchClothes = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/clothes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("服一覧の取得に失敗しました");
      const data = await res.json();
      setClothes(data.data || data);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("カテゴリ一覧の取得に失敗しました");
      const data = await res.json();
      setCategories(data.data || data);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchTypes = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/types", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("タイプ一覧の取得に失敗しました");
      const data = await res.json();
      setTypes(data.data || data);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    fetchCategories();
    fetchTypes();
    fetchClothes();
  }, [token, router]);

  const handleSave = async () => {
    if (!token) return;
    if (!currentClothes.name.trim()) {
      setError("服の名前を入力してください");
      return;
    }
    if (currentClothes.category_id === 0 || currentClothes.type_id === 0) {
      setError("カテゴリとタイプを選択してください");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      let res: Response;
      if (modalMode === "add") {
        res = await fetch("http://localhost:8000/api/clothes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(currentClothes),
        });
      } else {
        res = await fetch(`http://localhost:8000/api/clothes/${currentClothes.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(currentClothes),
        });
      }
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "操作に失敗しました");
      }
      setModalOpen(false);
      setCurrentClothes({ name: "", color: "", season: [], category_id: 0, type_id: 0 });
      await fetchClothes();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (item: Clothes) => {
    setCurrentClothes(item);
    setModalMode("edit");
    setError(null);
    setModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentClothes({ name: "", color: "", season: [], category_id: 0, type_id: 0 });
    setModalMode("add");
    setError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!confirm("削除しますか？")) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/clothes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("削除に失敗しました");
      await fetchClothes();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#0072e6" }}>服一覧</h1>

      <div style={{ display: "flex", gap: 16, marginTop: 20, marginBottom: 20 }}>
        <button
          onClick={openAddModal}
          style={{
            background: "#0072e6",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: 5,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          服を追加
        </button>

        <button
          style={{
            background: "#0072e6",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: 5,
            cursor: "pointer",
            flexShrink: 0,
          }}
          onClick={() => router.push("/home")}
        >
          ホームへ戻る
        </button>
      </div>

      {loading && <p style={{ color: "#0072e6" }}>読み込み中...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 追加・編集共通モーダル */}
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
          onClick={() => {
            if (!loading) setModalOpen(false);
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: 24,
              borderRadius: 10,
              width: 400,
              boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, marginBottom: 16, color: "#0072e6" }}>
              {modalMode === "add" ? "服の追加" : "服の更新"}
            </h3>

            <input
              type="text"
              placeholder="服の名前"
              value={currentClothes.name}
              onChange={(e) =>
                setCurrentClothes({ ...currentClothes, name: e.target.value })
              }
              disabled={loading}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 6,
                border: "1.5px solid #80bfff",
                marginBottom: 12,
                fontSize: 16,
                outline: "none",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#0072e6")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#80bfff")}
            />
            <input
              type="text"
              placeholder="色"
              value={currentClothes.color}
              onChange={(e) =>
                setCurrentClothes({ ...currentClothes, color: e.target.value })
              }
              disabled={loading}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 6,
                border: "1.5px solid #80bfff",
                marginBottom: 12,
                fontSize: 16,
                outline: "none",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#0072e6")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#80bfff")}
            />
            <div
                style={{
                    marginBottom: 12,
                    border: "1.5px solid #80bfff",
                    borderRadius: 6,
                    padding: 10,
                    fontSize: 16,
                    color: "#333",
                    userSelect: "none",
                }}
                >
                <label style={{ display: "block", marginBottom: 6, fontWeight: "600" }}>
                    季節
                </label>
                <div style={{ display: "flex", gap: 12 }}>
                    {["春", "夏", "秋", "冬"].map((s) => (
                    <label
                        key={s}
                        style={{
                        cursor: loading ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: loading ? "#aaa" : "#000",
                        }}
                    >
                        <input
                        type="checkbox"
                        value={s}
                        checked={currentClothes.season.includes(s)}
                        disabled={loading}
                        onChange={(e) => {
                            const checked = e.target.checked;
                            if (checked) {
                            setCurrentClothes({
                                ...currentClothes,
                                season: [...currentClothes.season, s],
                            });
                            } else {
                            setCurrentClothes({
                                ...currentClothes,
                                season: currentClothes.season.filter((v) => v !== s),
                            });
                            }
                        }}
                        style={{ cursor: loading ? "not-allowed" : "pointer" }}
                        />
                        {s}
                    </label>
                    ))}
                </div>
            </div>
            <select
              value={currentClothes.category_id}
              onChange={(e) =>
                setCurrentClothes({ ...currentClothes, category_id: Number(e.target.value) })
              }
              disabled={loading}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 6,
                border: "1.5px solid #80bfff",
                marginBottom: 12,
                fontSize: 16,
                outline: "none",
                transition: "border-color 0.3s",
              }}
            >
              <option value={0}>カテゴリ選択</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={currentClothes.type_id}
              onChange={(e) =>
                setCurrentClothes({ ...currentClothes, type_id: Number(e.target.value) })
              }
              disabled={loading}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 6,
                border: "1.5px solid #80bfff",
                marginBottom: 12,
                fontSize: 16,
                outline: "none",
                transition: "border-color 0.3s",
              }}
            >
              <option value={0}>タイプ選択</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={handleSave}
                disabled={loading}
                style={{
                  backgroundColor: "#0072e6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "10px 18px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 3px 6px rgba(0,114,230,0.5)",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0072e6")}
              >
                {modalMode === "add" ? "追加する" : "更新する"}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                disabled={loading}
                style={{
                  backgroundColor: "#80bfff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "10px 18px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 3px 6px rgba(128,191,255,0.5)",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5a9de6")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#80bfff")}
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 一覧 */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#80bfff" }}>
            <th style={{ padding: 8, color: "#fff" }}>ID</th>
            <th style={{ padding: 8, color: "#fff" }}>名前</th>
            <th style={{ padding: 8, color: "#fff" }}>色</th>
            <th style={{ padding: 8, color: "#fff" }}>カテゴリ</th>
            <th style={{ padding: 8, color: "#fff" }}>タイプ</th>
            <th style={{ padding: 8, color: "#fff" }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {clothes.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #80bfff" }}>
              <td style={{ padding: 8 }}>{item.id}</td>
              <td style={{ padding: 8 }}>{item.name}</td>
              <td style={{ padding: 8 }}>{item.color}</td>
              <td style={{ padding: 8 }}>
                {categories.find((c) => c.id === item.category_id)?.name || ""}
              </td>
              <td style={{ padding: 8 }}>{types.find((t) => t.id === item.type_id)?.name || ""}</td>
              <td style={{ padding: 8 }}>
                <button
                  style={{
                    background: "#0072e6",
                    border: "none",
                    padding: "6px 12px",
                    marginRight: 5,
                    cursor: "pointer",
                    color: "#fff",
                    borderRadius: 4,
                  }}
                  onClick={() => openEditModal(item)}
                  disabled={loading}
                >
                  更新
                </button>
                <button
                  style={{
                    background: "#80bfff",
                    color: "#fff",
                    border: "none",
                    padding: "6px 12px",
                    cursor: "pointer",
                    borderRadius: 4,
                  }}
                  onClick={() => handleDelete(item.id)}
                  disabled={loading}
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
          {clothes.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: 20 }}>
                服が登録されていません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
