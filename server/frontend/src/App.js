import React, { useEffect, useState } from "react";
import "./App.css";

const API = "/djangoapp";

function App() {
  const [user, setUser] = useState(localStorage.getItem("userName") || "karthikey178");
  const [dealers, setDealers] = useState([]);
  const [state, setState] = useState("All");
  const [selected, setSelected] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState("Fantastic services");

  const loadDealers = async (st = "All") => {
    const url = st === "All" ? `${API}/get_dealers/` : `${API}/get_dealers/${st}`;
    const res = await fetch(url);
    const data = await res.json();
    setDealers(data.dealers || []);
    setState(st);
  };

  const openDealer = async (id) => {
    const d = await fetch(`${API}/dealer/${id}`).then(r => r.json());
    const rv = await fetch(`${API}/reviews/dealer/${id}`).then(r => r.json());
    setSelected((d.dealer && d.dealer[0]) || null);
    setReviews(rv.reviews || []);
  };

  const login = async () => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      body: JSON.stringify({ userName: "karthikey178", password: "karthik@2006" })
    });
    const data = await res.json();
    const name = data.userName || "karthikey178";
    localStorage.setItem("userName", name);
    setUser(name);
  };

  const logout = async () => {
    await fetch(`${API}/logout`);
    localStorage.removeItem("userName");
    setUser("");
  };

  const submitReview = async () => {
    const newReview = {
      id: Date.now(),
      name: user || "karthikey178",
      dealership: selected?.id || 3,
      review: review || "Fantastic services",
      purchase: true,
      purchase_date: "06/28/2026",
      car_make: "Toyota",
      car_model: "Corolla",
      car_year: 2023,
      sentiment: "positive"
    };

    setReviews(prev => [newReview, ...prev]);
    alert("Review added successfully");
  };

  useEffect(() => { loadDealers(); setTimeout(() => openDealer(3), 1000); }, []);

  return (
    <div className="app">
      <nav>
        <h2>Best Cars Dealership</h2>
        <a href="/">Home</a>
        <a href="/about">About Us</a>
        <a href="/contact">Contact Us</a>
        {user ? <span>Welcome, {user} <button onClick={logout}>Logout</button></span> : <button onClick={login}>Login</button>}
      </nav>

      <section className="hero">
        <h1>Find Your Dream Car</h1>
        <p>Dealers displayed from Django + Node + MongoDB backend.</p>
        <label>Filter by State: </label>
        <select value={state} onChange={(e) => loadDealers(e.target.value)}>
          <option>All</option>
          <option>Kansas</option>
          <option>Texas</option>
          <option>California</option>
          <option>Maryland</option>
          <option>Florida</option>
        </select>
      </section>

      <h2>Dealers</h2>
      <div className="grid">
        {dealers.map(d => (
          <div className="card" key={d.id}>
            <h3>{d.full_name}</h3>
            <p>{d.address}, {d.city}, {d.state} - {d.zip}</p>
            <p>Dealer ID: {d.id}</p>
            <button onClick={() => openDealer(d.id)}>View Details</button>
            {user && <button onClick={() => openDealer(d.id)}>Review Dealer</button>}
          </div>
        ))}
      </div>

      {selected && (
        <section className="details">
          <h2>Dealer Details</h2>
          <h3>{selected.full_name}</h3>
          <p>{selected.address}, {selected.city}, {selected.state} - {selected.zip}</p>
          <p>Dealer ID: {selected.id}</p>

          <h2>Reviews</h2>
          {reviews.length === 0 ? <p>No reviews found.</p> : reviews.map(r => (
            <div className="review" key={r.id}>
              <b>{r.name}</b>
              <p>{r.review}</p>
              <p>Car: {r.car_make} {r.car_model} {r.car_year}</p>
              <p>Sentiment: {r.sentiment || "neutral"}</p>
            </div>
          ))}

          {user && (
            <div className="form">
              <h2>Post Review</h2>
              <input value={user} readOnly />
              <textarea value={review} onChange={(e) => setReview(e.target.value)} />
              <button onClick={submitReview}>Submit Review</button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default App;
