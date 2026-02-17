"use client";
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    student: "",
    lecture: "",
    speaker: "",
    rating: "",
    comment: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Feedback submitted successfully ✅");
      setForm({
        student: "",
        lecture: "",
        speaker: "",
        rating: "",
        comment: "",
      });
    } else {
      alert("Error ❌ : " + data.error);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Guest Lecture Feedback</h2>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            name="student"
            placeholder="Student Name"
            value={form.student}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            name="lecture"
            placeholder="Lecture Topic"
            value={form.lecture}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            name="speaker"
            placeholder="Guest Speaker"
            value={form.speaker}
            onChange={handleChange}
            required
          />

          <select
            style={styles.input}
            name="rating"
            value={form.rating}
            onChange={handleChange}
            required
          >
            <option value="">Select Rating</option>
            <option value="5 - Excellent">5 - Excellent</option>
            <option value="4 - Very Good">4 - Very Good</option>
            <option value="3 - Good">3 - Good</option>
            <option value="2 - Average">2 - Average</option>
            <option value="1 - Poor">1 - Poor</option>
          </select>

          <textarea
            style={styles.textarea}
            name="comment"
            placeholder="Comment"
            value={form.comment}
            onChange={handleChange}
            required
          />

          <button type="submit" style={styles.button}>
            Submit Feedback
          </button>
        </form>

        {/* 🔐 Admin Login Link */}
        <div style={{ marginTop: "15px", textAlign: "center" }}>
          <a
            href="/admin/login"
            style={{
              color: "#2563eb",
              textDecoration: "underline",
              fontWeight: "500",
            }}
          >
            Admin Login
          </a>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f2f4f8",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "380px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#2563eb",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    minHeight: "80px",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
};
