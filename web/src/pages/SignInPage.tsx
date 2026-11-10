import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { errorStatus, trackEvent } from "../analytics/pendo";
import { useAuth } from "../auth/AuthContext";

/** Signs a user in with their email and password against the Tripwise API. */
export function SignInPage() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from ?? "/trips";
  if (user) {
    return <Navigate to={from} replace />;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSigningIn(true);
    setError(null);
    try {
      const session = await signIn(email.trim(), password);
      // The user signed in and the session was saved.
      trackEvent("user_signed_in", {
        role: session.user.role,
        accountPlan: session.account.plan,
        redirectPath: from,
      });
      navigate(from, { replace: true });
    } catch (e) {
      setError("That email and password don't match an account.");
      // Sign-in failed. Never send the email or password.
      trackEvent("sign_in_failed", { errorStatus: errorStatus(e), redirectPath: from });
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <main className="sign-in">
      <form className="card" aria-labelledby="sign-in-heading" onSubmit={submit}>
        <h1 id="sign-in-heading">Sign in to Tripwise</h1>
        <label>
          Email
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={email.trim() === "" || password === "" || signingIn}>
          {signingIn ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
