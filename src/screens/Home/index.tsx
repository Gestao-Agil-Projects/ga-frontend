import { Header } from "../../components/Header";
import { InitialSection } from "../../components/Sections/InitialSection";
import { Footer } from "../../components/Footer";
import { Professionals } from "../Professionals";

export function Home() {
  return (
    <>
        <Header />
        <InitialSection />
        <Professionals />
        <Footer />
    </>
  );
}
