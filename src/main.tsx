import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { HashRouter } from "react-router-dom"; // <-- импорт HashRouter
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./firebase";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </HashRouter>
  </StrictMode>
);
