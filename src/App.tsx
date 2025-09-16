import { Routes } from "./routes";

// Importar Reactotron apenas em desenvolvimento
if (import.meta.env.DEV) {
  import("../ReactotronConfig");
}

function App() {
  return <Routes />;
}

export default App;
