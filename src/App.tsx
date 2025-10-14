function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🚀 Web3 DApp
          </h1>
          <p className="text-gray-300 text-lg">
            Простое приложение для взаимодействия с Ethereum
          </p>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
            <p className="text-white text-xl mb-4">
              🔨 В разработке
            </p>
            <p className="text-gray-300">
              Компоненты будут добавлены в соответствии с планом реализации
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-400">
          <p className="text-sm">
            Создано с использованием Vite + React + TypeScript + ethers.js
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
