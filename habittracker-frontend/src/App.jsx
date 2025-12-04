import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {

  useEffect(() => {
    function handleTimeout() {
      alert("Server starting up, please wait a moment and try again.");
    }
    window.addEventListener("server-timeout", handleTimeout);

    async function pingServer() {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

      try {
        const response = await fetch(import.meta.env.VITE_API_URL + "/ping", {
          method: "GET",
          signal: controller.signal,
        });
        if (response.ok) {
          console.log("Is the server awake: " + response.statusText);
        }
      } catch (err) {
        // Abort = timeout
        if (err.name === "AbortError") {
          window.dispatchEvent(new CustomEvent("server-timeout"));
        }
      }

      clearTimeout(timeout);
    }

    pingServer();

    return () => window.removeEventListener("server-timeout", handleTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;