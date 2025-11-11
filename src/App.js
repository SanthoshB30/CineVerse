import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import ChatBot from './components/ChatBot';
import DataInitializer from './components/DataInitializer';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import DirectorPage from './pages/DirectorPage';
import GenrePage from './pages/GenrePage';
import SearchResultsPage from './pages/SearchResultsPage';
import AllDirectorsPage from './pages/AllDirectorsPage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataInitializer>
          <div className="App">
            <Routes>
              {/* Public route - Login */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected routes */}
              <Route path="*" element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <main className="main-content">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/movie/:slug" element={<MovieDetailPage />} />
                        <Route path="/director/:slug" element={<DirectorPage />} />
                        <Route path="/directors" element={<AllDirectorsPage />} />
                        <Route path="/genre/:slug" element={<GenrePage />} />
                        <Route path="/search" element={<SearchResultsPage />} />
                        <Route path="*" element={
                          <div className="error-page">
                            <h1>404 - Page Not Found</h1>
                            <p>The page you're looking for doesn't exist.</p>
                            <a href="/" className="btn btn-primary">Go Home</a>
                          </div>
                        } />
                      </Routes>
                    </main>
                    <ChatBot />
                    <footer className="footer">
                      <p>&copy; 2025 CineVerse. Your Universe of Cinema.</p>
                    </footer>
                  </>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </DataInitializer>
      </AuthProvider>
    </Router>
  );
}

export default App;

