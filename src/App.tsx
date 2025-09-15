function App() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Teste de Cores</h1>
      
      <div className="space-y-4">
        <div className="bg-primary p-4 text-white rounded">
          <p>Teste bg-primary</p>
        </div>
        
        <div className="bg-success p-4 text-white rounded">
          <p>Teste bg-success</p>
        </div>
        
        <div className="bg-error p-4 text-white rounded">
          <p>Teste bg-error</p>
        </div>
        
        <div className="bg-neutral-03 p-4 text-black rounded">
          <p>Teste bg-neutral-03</p>
        </div>
      </div>
    </div>
  );
}

export default App;
