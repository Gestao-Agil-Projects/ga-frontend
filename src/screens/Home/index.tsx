import { Header } from "../../components/Header";

export function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-4xl font-bold text-white mb-4">
            Home
          </h1>
        </div>
        <div className="flex flex-row gap-4">
          <div className="p-4 w-36 h-36 bg-success rounded-lg flex items-center justify-center">
            <h2 className=" text-2xl font-bold text-warning-70">
              Teste bg-success
            </h2> 
          </div>
          <div className="p-4 w-36 h-36 bg-error rounded-lg flex items-center justify-center">
            <h2 className="text-2xl font-bold text-black">
              Teste bg-error
            </h2> 
          </div>
          <div className="p-4 w-36 h-36 bg-warning-70 rounded-lg flex items-center justify-center">
            <h2 className=" text-2xl font-bold text-black">
              Teste bg-warning-70
            </h2> 
          </div>
        </div>
      </main>
    </div>
  );
}
