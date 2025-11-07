import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "../screens/Home";
import { About } from "../screens/About";
import { Contact } from "../screens/Contact";
import { Professionals } from "../screens/Professionals";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { User } from "../screens/User";
import { Dashboard } from "../screens/Dashboard";
import { userStore } from "../store/userStore";

function RootRoute() {
  const { userAccountData } = userStore();

  // Se for primeiro acesso, não navegar para dashboard/user
  if (userAccountData?.is_first_access === true) {
    return <Home />;
  }

  if (userAccountData?.is_admin || (userAccountData as any)?.role === "admin" || (userAccountData as any)?.is_superuser) {
    return <Dashboard />;
  }

  if (userAccountData) {
    return <User />;
  }

  return <Home />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route
        path="/professionals"
        element={
          <>
            <Header />
            <Professionals />
            <Footer />
          </>
        }
      />
      <Route path="/user" element={<User />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
