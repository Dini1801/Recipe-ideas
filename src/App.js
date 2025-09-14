
import React, { useState } from "react";

export default function App() {
  const [ingredient, setIngredient] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";

  async function searchRecipes() {
    if (!ingredient.trim()) {
      setError("⚠️ Please enter an ingredient.");
      setRecipes([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_BASE + encodeURIComponent(ingredient.trim()));
      if (!res.ok) throw new Error("Network response not ok");
      const data = await res.json();
      if (data.meals) {
        setRecipes(data.meals);
      } else {
        setRecipes([]);
        setError("No recipes found for this ingredient.");
      }
    } catch (e) {
      setError("❌ Failed to fetch recipes: " + e.message);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '12px 16px', background: '#0f172a', color: 'white' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>🍳 Recipe Ideas Finder</h1>
        <p style={{ margin: 0, fontSize: 14, opacity: 0.8 }}>Enter an ingredient and discover dishes to cook!</p>
      </header>

      <main style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ maxWidth: 600, width: '100%', background: 'white', padding: 16, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={ingredient}
              placeholder="e.g. chicken, tomato, rice"
              onChange={(e) => setIngredient(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') searchRecipes(); }}
              style={{ flex: 1, padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
            />
            <button onClick={searchRecipes} style={{ padding: '10px 16px', background: '#0ea5e9', border: 'none', color: 'white', borderRadius: 6, cursor: 'pointer' }}>Search</button>
          </div>

          {loading && <p style={{ marginTop: 16 }}>⏳ Loading recipes…</p>}
          {error && <p style={{ marginTop: 16, color: 'red' }}>{error}</p>}

          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {recipes.map((meal) => (
              <div key={meal.idMeal} style={{ background: '#f1f5f9', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                <img src={meal.strMealThumb} alt={meal.strMeal} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                <div style={{ padding: 8 }}>
                  <h3 style={{ fontSize: 14, margin: '0 0 4px' }}>{meal.strMeal}</h3>
                  <a href={`https://www.themealdb.com/meal/${meal.idMeal}`} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#0ea5e9' }}>View Recipe</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer style={{ padding: 12, fontSize: 12, textAlign: 'center', background: '#e2e8f0' }}>
        Powered by TheMealDB API. Enter an ingredient to explore delicious meals.
      </footer>
    </div>
  );
}

