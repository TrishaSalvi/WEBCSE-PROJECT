import React, { useState } from "react";
import { useRouter } from "next/router";
import api from "../utilities/api";
import GlassCard from "../components/GlassCard";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault(); // 🚨 REQUIRED
    setErr("");

    try {
      await api.post("/auth/signup", {
        name,
        email,
        phone,
        password,
      });

      // go to login after signup
      router.push("/login");
    } catch (error) {
      setErr(error?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="page-bg">
      <GlassCard>
        <h2 className="title">NovaSync — Signup</h2>

        <form onSubmit={submit} className="form">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" required />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />

          <button type="submit">Create Account</button>
          {err && <p className="error">{err}</p>}
        </form>
      </GlassCard>
    </div>
  );
}
