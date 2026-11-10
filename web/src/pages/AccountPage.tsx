import { useState, type FormEvent } from "react";
import { usersApi } from "../api/users";
import { useAuth } from "../auth/AuthContext";

/** The signed-in user's profile, which they can edit, and the company account they belong to. */
export function AccountPage() {
  const { user, account, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!user || !account) {
    return null;
  }

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      updateUser(await usersApi.update(user.id, { name: name.trim(), email: email.trim() }));
      setMessage("Profile saved.");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <form className="card" aria-labelledby="profile-heading" onSubmit={saveProfile}>
        <h2 id="profile-heading">Your profile</h2>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <p>Role: {user.role}</p>
        <button type="submit" disabled={name.trim() === "" || email.trim() === "" || saving}>
          {saving ? "Saving…" : "Save profile"}
        </button>
        {message && <p>{message}</p>}
      </form>

      <section className="card" aria-labelledby="company-heading">
        <h2 id="company-heading">Company</h2>
        <dl>
          <dt>Name</dt>
          <dd>{account.name}</dd>
          <dt>Plan</dt>
          <dd>{account.plan}</dd>
          <dt>Account ID</dt>
          <dd>{account.id}</dd>
        </dl>
      </section>
    </>
  );
}
