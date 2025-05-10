import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ReactNode, useEffect } from "react";
import useAuthStore from "./contexts/AuthStore";
import { Toaster } from 'react-hot-toast';
import MainLayout from "./components/layout/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import CreateUserPage from "./pages/CreateUserPage";
import PostsPage from "./pages/PostsPage";
import MediaPage from "./pages/MediaPage";
import CalendarPage from "./pages/CalendarPage";
import { LoginPage } from "./pages/Auth/LoginPage";
import { RegisterForm } from "./pages/Auth/RegisterForm";
import NotFoundPage from "./pages/NotFoundPage";
import UserTable from './pages/UserTable'
import InvoiceManagement from "./pages/InvoiceManagement";
import PaymentProcess from "./pages/PaymentProcess";
import ReportAnalytics from "./pages/ReportAnalytics";
import PaymentGateway from "./pages/PaymentGateway";
import ReportingAnalytics from "./pages/ReportingAnalytics";


interface AuthRouteProps {
  children: ReactNode;
}
const ProtectedRoute = ({ children }: AuthRouteProps) => {
  const { userData } = useAuthStore();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => { userData() }, []);

  if (isLoading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AuthRoute = ({ children }: AuthRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

const protectedRoutes = [
  { path: "/", element: <DashboardPage /> },
  { path: "/invoice-management", element: <InvoiceManagement /> },
  { path: "/payment-process", element: <PaymentProcess /> },
  { path: "/payment-gateway", element: <PaymentGateway /> },
  { path: "/settings", element: <SettingsPage /> },
  { path: "/users", element: < UserTable /> },
  { path: "/create", element: <CreateUserPage /> },
  { path: "/posts", element: <PostsPage /> },
  { path: "/media", element: <MediaPage /> },
  { path: "/calendar", element: <CalendarPage /> },
];

const authRoutes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterForm /> },
];

const App = () => {
  return (
    <AuthProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {authRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<AuthRoute>{route.element}</AuthRoute>}
            />
          ))}

          <Route element={<MainLayout />}>
            {protectedRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<ProtectedRoute>{route.element}</ProtectedRoute>}
              />
            ))}
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;