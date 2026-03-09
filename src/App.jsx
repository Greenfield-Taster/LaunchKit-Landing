import { LanguageProvider } from "./contexts";
import GlowBackground from "./components/GlowBackground/GlowBackground";

import "./styles/main.scss";

function App() {
  return (
    <LanguageProvider>
      <div className="app">
        <GlowBackground />
        {/* Sections will be added in subsequent tasks */}
      </div>
    </LanguageProvider>
  );
}

export default App;
