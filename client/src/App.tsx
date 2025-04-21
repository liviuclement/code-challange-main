import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import BigDataPage from './pages/BigDataPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NavBar from './components/NavBar';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/search" replace />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/big-data" element={<BigDataPage />} />
          <Route path="*" element={<div className="p-6 text-red-500">404 - Not Found</div>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
