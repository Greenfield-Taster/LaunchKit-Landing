import { LanguageProvider } from "./contexts";
import GlowBackground from "./components/GlowBackground/GlowBackground";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Features from "./components/Features/Features";
import Partners from "./components/Partners/Partners";
import Portfolio from "./components/Portfolio/Portfolio";

import "./styles/main.scss";

function App() {
  return (
    <LanguageProvider>
      <div className="app">
        <GlowBackground />
        <Header />
        <main>
          <Hero />
          <About />
          <Features />
          <Partners />
          <Portfolio />
        </main>
      </div>
    </LanguageProvider>
  );
}

export default App;
