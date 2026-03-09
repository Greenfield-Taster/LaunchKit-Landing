import { LanguageProvider } from "./contexts";
import GlowBackground from "./components/GlowBackground/GlowBackground";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";

import "./styles/main.scss";

function App() {
  return (
    <LanguageProvider>
      <div className="app">
        <GlowBackground />
        <Header />
        <main>
          <Hero />
        </main>
      </div>
    </LanguageProvider>
  );
}

export default App;
