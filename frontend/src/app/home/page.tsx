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

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<number>(0);

  const [randomClothes, setRandomClothes] = useState<Clothes | null>(null);

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
      .catch(() => {
        router.push("/login");
      });

    fetchCategories();
    fetchTypes();
  }, [router]);

  async function fetchCategories() {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("カテゴリ一覧の取得に失敗しました");
      const data = await res.json();
      setCategories(data.data ?? data);
    } catch {
      // 失敗しても特に何もしない
    }
  }

  async function fetchTypes() {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/types", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("タイプ一覧の取得に失敗しました");
      const data = await res.json();
      setTypes(data.data ?? data);
    } catch {
      // 失敗しても特に何もしない
    }
  }

  async function handleCoordinate() {
    setLoading(true);
    setError(null);
    setRandomClothes(null);

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("ログイン情報がありません");
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams();
      if (selectedSeason) params.append("season", selectedSeason);
      if (selectedColor.trim()) params.append("color", selectedColor.trim());
      if (selectedCategory !== 0) params.append("category_id", String(selectedCategory));
      if (selectedType !== 0) params.append("type_id", String(selectedType));

      const res = await fetch(`http://localhost:8000/api/clothes?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("服の取得に失敗しました");

      const data = await res.json();
      const clothesList: Clothes[] = data.data ?? data;

      if (!Array.isArray(clothesList) || clothesList.length === 0) {
        setError("条件に合う服が見つかりませんでした");
      } else {
        const random = clothesList[Math.floor(Math.random() * clothesList.length)];
        setRandomClothes(random);
      }
    } catch (e) {
      if (e instanceof Error) setError(e.message);
      else setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  const seasons = ["春", "夏", "秋", "冬"];

  return (
    <div style={styles.container}>
      <h1>{`${username}さんのクローゼット`}</h1>

      <div style={{ marginTop: 30 }}>
        <button
          onClick={() => router.push("/clothes")}
          style={styles.button}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0072e6")}
        >
          服一覧ページへ
        </button>
      </div>

      <div style={styles.flexRow}>
        <button
          onClick={() => router.push("/category")}
          style={styles.button}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0072e6")}
        >
          カテゴリ一覧ページへ
        </button>

        <button
          onClick={() => router.push("/type")}
          style={styles.button}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0072e6")}
        >
          タイプ一覧ページへ
        </button>
      </div>

      <div style={styles.coordinateBox}>
        <h2 style={{ marginTop: 0, marginBottom: 20 }}>コーディネートを選ぶ</h2>

        <label style={styles.label}>
          季節:
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            style={styles.select}
          >
            <option value="">選択しない</option>
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.label}>
          色:
          <input
            type="text"
            placeholder="例: 黒、白、青"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            style={{ ...styles.input, marginBottom: 10 }}
          />
        </label>

        <label style={styles.label}>
          カテゴリ:
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
            style={styles.select}
          >
            <option value={0}>選択しない</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.label}>
          タイプ:
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(Number(e.target.value))}
            style={styles.select}
          >
            <option value={0}>選択しない</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button
            onClick={handleCoordinate}
            disabled={loading}
            style={{ ...styles.button, width: "100%", fontWeight: "bold", opacity: loading ? 0.6 : 1 }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0072e6")}
          >
            コーディネートを選ぶ
          </button>
          {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
        </div>
      </div>

      {randomClothes && (
        <div style={styles.resultBox}>
          <h3>選ばれたコーディネート</h3>
          <p>
            <strong>名前:</strong> {randomClothes.name}
          </p>
          <p>
            <strong>色:</strong> {randomClothes.color}
          </p>
          <p>
            <strong>季節:</strong> {randomClothes.season.join(", ")}
          </p>
          <p>
            <strong>カテゴリ:</strong>{" "}
            {categories.find((c) => c.id === randomClothes.category_id)?.name || ""}
          </p>
          <p>
            <strong>タイプ:</strong> {types.find((t) => t.id === randomClothes.type_id)?.name || ""}
          </p>
        </div>
      )}

      <button
        onClick={handleLogout}
        disabled={loading}
        style={{ ...styles.button, marginTop: 40, opacity: loading ? 0.6 : 1 }}
      >
        {loading ? "ログアウト中..." : "ログアウト"}
      </button>
    </div>
  );

  async function handleLogout() {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("ログアウトに失敗しました");
      }

      localStorage.removeItem("access_token");
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  }
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "100px auto",
    padding: 20,
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: "#0072e6",
    textAlign: "center" as const,
  },
  button: {
    padding: "10px 20px",
    fontSize: 16,
    backgroundColor: "#0072e6",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    boxShadow: "0 3px 6px rgba(0,114,230,0.4)",
    transition: "background-color 0.3s ease",
  },
  flexRow: {
    marginTop: 30,
    display: "flex",
    justifyContent: "center",
    gap: 20,
  },
  coordinateBox: {
    marginTop: 40,
    padding: 20,
    border: `1px solid #80bfff`,
    borderRadius: 10,
    backgroundColor: "#f0f8ff",
    color: "#0072e6",
    maxWidth: 500,
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "left" as const,
  },
  label: {
    display: "block",
    marginBottom: 12,
    fontWeight: "bold",
  },
  select: {
    width: "100%",
    padding: 10,
    margin: "6px 0 14px",
    borderRadius: 6,
    border: "1.5px solid #80bfff",
    fontSize: 16,
    outline: "none",
    color: "#0072e6",
    backgroundColor: "#f0f8ff",
    transition: "border-color 0.3s",
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    border: "1.5px solid #80bfff",
    fontSize: 16,
    outline: "none",
    color: "#0072e6",
    backgroundColor: "#f0f8ff",
    transition: "border-color 0.3s",
  },
  resultBox: {
    marginTop: 30,
    padding: 20,
    borderRadius: 10,
    border: `2px solid #0072e6`,
    backgroundColor: "#e6f0ff",
    color: "#0072e6",
    maxWidth: 400,
    marginLeft: "auto",
    marginRight: "auto",
  },
};
