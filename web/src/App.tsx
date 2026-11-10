import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./auth/RequireAuth";
import { AppLayout } from "./components/AppLayout";
import { AccountPage } from "./pages/AccountPage";
import { EditTripPage } from "./pages/EditTripPage";
import { NewTripPage } from "./pages/NewTripPage";
import { SignInPage } from "./pages/SignInPage";
import { TripsPage } from "./pages/TripsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trips/new" element={<NewTripPage />} />
        <Route path="/trips/:tripId/edit" element={<EditTripPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/trips" replace />} />
    </Routes>
  );
}
