import { LanguageProvider } from "./contexts";

import "./styles/main.scss";

function App() {
  return (
    <LanguageProvider>
      <div className="app">
        {/* Components will be added in subsequent tasks */}
      </div>
    </LanguageProvider>
  );
}

export default App;
