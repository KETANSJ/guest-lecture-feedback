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

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/admin/login");
    }
  };

  const fetchRatings = async () => {
    const { data, error } = await supabase
      .from("feedback")
      .select("*");

    if (error) {
      console.log(error);
      return;
    }

    setAllFeedback(data);

    const total = data.length;
    setTotalCount(total);

    const allRatings = {
      "1 - Poor": 0,
      "2 - Average": 0,
      "3 - Good": 0,
      "4 - Very Good": 0,
      "5 - Excellent": 0,
    };

    data.forEach((item) => {
      if (allRatings[item.rating] !== undefined) {
        allRatings[item.rating]++;
      }
    });

    const chartData = Object.keys(allRatings).map((key) => {
      const count = allRatings[key];
      const percentage =
        total > 0 ? Math.round((count / total) * 100) : 0;

      return {
        name: key,
        count: count,
        percentage: percentage,
      };
    });

    setData(chartData);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const exportCSV = () => {
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
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "feedback.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ textAlign: "center" }}>
        Admin Rating Analytics
      </h2>

      {/* Only Total Feedback */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h3>Total Feedback: {totalCount}</h3>
      </div>

      {/* Buttons */}
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <button
          onClick={exportCSV}
          style={{
            padding: "8px 15px",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Export CSV
        </button>

        <button
          onClick={handleLogout}
          style={{
            padding: "8px 15px",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ display: "flex", gap: "40px" }}>

        {/* Pie Chart */}
        <div style={{ flex: 1 }}>
          <PieChart width={450} height={450}>
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              outerRadius={170}
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
        </div>

        {/* Feedback List */}
        <div style={{ flex: 1 }}>
          <h3>All Student Feedback</h3>

          {allFeedback.map((item, index) => (
            <div
              key={index}
              style={{
                background: "#ffffff",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{item.student}</strong>
                <span>{item.rating}</span>
              </div>

              <div style={{ marginTop: "8px", fontSize: "14px" }}>
                <p><strong>Topic:</strong> {item.lecture}</p>
                <p><strong>Speaker:</strong> {item.speaker}</p>
                <p><strong>Comment:</strong> {item.comment}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
