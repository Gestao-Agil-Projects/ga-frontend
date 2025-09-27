import { ToastProvider } from "./contexts/ToastContext";
import { Routes } from "./routes";

// Importar Reactotron apenas em desenvolvimento
if (import.meta.env.DEV) {
  import("../ReactotronConfig");
}

function App() {
  return (
    <ToastProvider>
      <Routes />
    </ToastProvider>
  );
}

export default App;