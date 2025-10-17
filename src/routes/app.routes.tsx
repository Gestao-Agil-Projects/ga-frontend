import { Routes, Route } from "react-router-dom";
import { Home } from "../screens/Home";
import { About } from "../screens/About";
import { Contact } from "../screens/Contact";
import { Professionals } from "../screens/Professionals";
import { Playground } from "../screens/Playground/Playground";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/professionals" element={<Professionals />} />

      {/* Ambiente de testes de componentes */}
      <Route path="/playground" element={<Playground />} />
      
    </Routes>
  );
}
