"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Brand from "@/components/shell/brand";
import { TextField } from "@/components/ui/fields";
import { api, ApiError, errorMessage } from "@/lib/api";
import { ADMIN_KEY, writeStored } from "@/lib/client-store";
import type { Admin } from "@/lib/types";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const admin = await api.post<Admin>("/auth/login", { email, password });
      writeStored(ADMIN_KEY, JSON.stringify(admin));
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError && err.status === 404 ? "Sign-in isn't available yet. The HRMS API has no login endpoint." : errorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <Brand href="/login" />
      <h2>Admin Sign In</h2>
      <p>Enter your credentials to access the dashboard.</p>
      <form onSubmit={submit}>
        <TextField
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          spellCheck={false}
          placeholder="admin@bluetech.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Signing In…" : "Sign In"}
        </button>
      </form>
      <p className="login-footer">© {new Date().getFullYear()} BlueTech. All rights reserved.</p>
    </div>
  );
}
