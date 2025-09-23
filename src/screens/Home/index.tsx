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
      </main>
    </div>
  );
}
