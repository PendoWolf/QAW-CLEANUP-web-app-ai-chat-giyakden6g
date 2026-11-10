import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { AssistantPanel } from "./AssistantPanel";

/** The signed-in app: navigation, the signed-in user and company, the page, and the assistant panel. */
export function AppLayout() {
  const { user, account, signOut } = useAuth();
  const navigate = useNavigate();
  const [assistantOpen, setAssistantOpen] = useState(false);

  const handleSignOut = async () => {
    setAssistantOpen(false);
    await signOut();
    navigate("/sign-in", { replace: true });
  };

  return (
    <div className={assistantOpen ? "layout with-assistant" : "layout"}>
      <main>
        <header className="top">
          <div>
            <h1>Tripwise</h1>
            <nav aria-label="Main">
              <NavLink to="/trips" end>
                Trips
              </NavLink>
              <NavLink to="/trips/new">Plan a trip</NavLink>
              <NavLink to="/account">Account</NavLink>
            </nav>
          </div>
          <div className="session">
            <span>
              {user?.name} · {account?.name}
            </span>
            {!assistantOpen && (
              <button type="button" onClick={() => setAssistantOpen(true)}>
                Ask the assistant
              </button>
            )}
            <button type="button" className="secondary" onClick={() => void handleSignOut()}>
              Sign out
            </button>
          </div>
        </header>

        <Outlet />
      </main>

      {assistantOpen && <AssistantPanel onClose={() => setAssistantOpen(false)} />}
    </div>
  );
}
