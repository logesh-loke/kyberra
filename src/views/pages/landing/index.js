// src/pages/Landing.jsx
import Hero from "./components/Hero";
import Features from "./components/Features";
import Encryption from "./components/Encryption";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Compliance from "./components/Compliance";

const Landing = () => {
  return (
    <div className="overflow-hidden">
        <Header />
      <Hero />
      <Features />
      <Encryption />
      <Pricing />
      <Compliance />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Landing;
