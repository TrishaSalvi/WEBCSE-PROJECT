import React, { useState } from "react";
import { useRouter } from "next/router";
import api from "../utilities/api";
import GlassCard from "../components/GlassCard";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
  if (e) e.preventDefault(); // Stop the default form reload immediately
  setErr("");

  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    if (res.data && res.data.token) {
      localStorage.setItem("token", res.data.token);
      
      // Force a small delay or await to ensure localStorage is set 
      // and Next.js handles the route change
      await router.push("/dashboard");
    } else {
      setErr("Token missing from server response");
    }
  } catch (error) {
    console.error("Login error details:", error.response || error);
    setErr(error?.response?.data?.message || "Login failed. Please try again.");
  }
};

  return (
    <div className="page-bg">
      <GlassCard>
        <h2 className="title">NovaSync — Login</h2>

        {/* 🚨 MUST BE onSubmit */}
        <form onSubmit={submit} className="form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

          {err && <p className="error">{err}</p>}
        </form>

        {/* 🚨 DO NOT USE <a href> */}
        <p style={{ marginTop: 12 }}>
          New user?{" "}
          <span
            style={{ color: "#00eaff", cursor: "pointer" }}
            onClick={() => router.push("/signup")}
          >
            Signup
          </span>
        </p>
      </GlassCard>
    </div>
  );
}
