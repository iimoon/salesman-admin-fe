import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "./hooks/useAuth";
import Login from "./Pages/Auth/Login";
import CommonPage from "./Pages/CommonPage";
import { Spinner } from "@/components/ui/spinner"; 

function App() {
  const { isAuthenticated, loading } = useAuth(); 

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <Router>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={isAuthenticated ? <CommonPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
