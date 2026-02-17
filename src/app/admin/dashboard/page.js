"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#ef4444", "#f97316", "#eab308", "#3b82f6", "#22c55e"];

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [allFeedback, setAllFeedback] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    checkUser();
    fetchRatings();
  }, []);

  // 🔐 Check Login Session
  const checkUser = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      await supabase.auth.signOut();
      router.push("/admin/login");
    }
  };

  // 📊 Fetch Feedback Data
  const fetchRatings = async () => {
    const { data, error } = await supabase
      .from("feedback")
      .select("*");

    if (error) return;

    setAllFeedback(data);

    const total = data.length;
    setTotalCount(total);

    const ratings = {
      "1 - Poor": 0,
      "2 - Average": 0,
      "3 - Good": 0,
      "4 - Very Good": 0,
      "5 - Excellent": 0,
    };

    data.forEach((item) => {
      if (ratings[item.rating] !== undefined) {
        ratings[item.rating]++;
      }
    });

    const chartData = Object.keys(ratings).map((key) => {
      const count = ratings[key];
      return {
        name: key,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      };
    });

    setData(chartData);
  };

  // 🚪 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // 📥 Export CSV (WORKING)
  const exportCSV = () => {
    if (allFeedback.length === 0) {
      alert("No feedback data available.");
      return;
    }

    const headers = ["Student", "Topic", "Speaker", "Rating", "Comment"];

    const rows = allFeedback.map((item) => [
      item.student,
      item.lecture,
      item.speaker,
      item.rating,
      item.comment,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "feedback.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin Rating Analytics</h2>

      <h3 style={styles.total}>
        Total Feedback: {totalCount}
      </h3>

      {/* Buttons */}
      <div style={styles.buttonWrapper}>
        <button style={styles.exportBtn} onClick={exportCSV}>
          Export CSV
        </button>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Responsive Layout */}
      <div style={styles.layout}>

        {/* Pie Chart */}
        <div style={styles.chartBox}>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="name"
                outerRadius={120}
                label={({ name, count }) =>
                  count > 0 ? `${name} (${count})` : ""
                }
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name, props) =>
                  `${props.payload.count} Students (${props.payload.percentage}%)`
                }
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Feedback List */}
        <div style={styles.feedbackBox}>
          <h3>All Student Feedback</h3>

          {allFeedback.map((item, index) => (
            <div key={index} style={styles.card}>
              <strong>{item.student}</strong>
              <p><strong>Topic:</strong> {item.lecture}</p>
              <p><strong>Speaker:</strong> {item.speaker}</p>
              <p><strong>Rating:</strong> {item.rating}</p>
              <p><strong>Comment:</strong> {item.comment}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "auto",
  },
  title: {
    textAlign: "center",
  },
  total: {
    textAlign: "center",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  exportBtn: {
    padding: "8px 15px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  logoutBtn: {
    padding: "8px 15px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  layout: {
    display: "flex",
    flexDirection: "column",
    gap: "40px",
  },
  chartBox: {
    width: "100%",
  },
  feedbackBox: {
    width: "100%",
  },
  card: {
    background: "#ffffff",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
};
