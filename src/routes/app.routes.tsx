import { Routes, Route } from "react-router-dom";
import { Home } from "../screens/Home";
import { About } from "../screens/About";
import { Contact } from "../screens/Contact";
import { Professionals } from "../screens/Professionals";
import { User } from "../screens/User";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/professionals" element={<Professionals />} />
      <Route path="/user" element={<User />} />
    </Routes>
  );
}
