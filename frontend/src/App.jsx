// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DarkVeil from "./components/background/DarkVeil";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import About from "./pages/About";
import Footer from "./components/Footer";
import BlogDetails from "./pages/BlogDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen relative">
          {/* Background */}
          <div className="fixed inset-0 z-0">
            <DarkVeil />
          </div>

          {/* Foreground */}
          <div className="relative z-10">
            <Navbar />
            <main className="pt-16">
              <Routes>
                {/* Public Routes (No protection) */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={

                    <Home />

                  }
                />
                <Route
                  path="/posts"
                  element={

                    <Posts />

                  }
                />
                <Route
                  path="/posts/:id"
                  element={
                    <BlogDetails />
                  }
                />
                <Route
                  path="/create"
                  element={
                    <ProtectedRoute>
                      <CreatePost />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditPost />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <ProtectedRoute>
                      <About />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;