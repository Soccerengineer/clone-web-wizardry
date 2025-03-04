import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/ui/protected-route';
import { useAuth } from '@/controllers/auth.controller';

// Yükleme ekranı
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

// Hata Sayfaları
const ConnectionError = lazy(() => import('@/pages/Error/ConnectionError'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Ana Sayfalar
const Index = lazy(() => import('@/pages/Index'));
const Auth = lazy(() => import('@/pages/Auth'));
const Register = lazy(() => import('@/pages/Register'));
const Overview = lazy(() => import('@/pages/Overview'));
const Statistics = lazy(() => import('@/pages/Statistics'));
const Rankings = lazy(() => import('@/pages/Rankings'));
const Matches = lazy(() => import('@/pages/Matches'));
const Challenges = lazy(() => import('@/pages/Challenges'));
const Tournaments = lazy(() => import('@/pages/Tournaments'));
const AISquadBuilder = lazy(() => import('@/pages/AISquadBuilder'));
const DevicePairing = lazy(() => import('@/pages/DevicePairing'));
const About = lazy(() => import('@/pages/About'));
const Promotions = lazy(() => import('@/pages/Promotions'));

// Ayarlar Sayfaları
const Settings = lazy(() => import('@/pages/Settings/Settings'));
const Profile = lazy(() => import('@/pages/Settings/Profile'));
const Language = lazy(() => import('@/pages/Settings/Language'));
const Security = lazy(() => import('@/pages/Settings/Security'));
const Privacy = lazy(() => import('@/pages/Settings/Privacy'));

/**
 * Uygulama rotalarını tanımlayan bileşen
 * Kod bölme (code splitting) için lazy loading kullanarak performansı artırır
 */
const AppRoutes = () => {
  const { connectionOk, loading } = useAuth();
  const location = useLocation();

  // Eğer hala kontrol ediliyorsa yükleniyor göster
  if (loading && connectionOk === null) {
    return <LoadingFallback />;
  }

  // Eğer bağlantı hatası varsa ve ConnectionError sayfasında değilsek, hata sayfasına yönlendir
  if (connectionOk === false && location.pathname !== '/connection-error') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <ConnectionError />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Genel erişilebilir sayfalar */}
        <Route path="/" element={<Index />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/connection-error" element={<ConnectionError />} />

        {/* Korumalı rotalar - Giriş yapanlar için */}
        <Route 
          path="/overview" 
          element={
            <ProtectedRoute requireAuth={true} redirectTo="/auth/login">
              <Overview />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/statistics" 
          element={
            <ProtectedRoute requireAuth={true} redirectTo="/auth/login">
              <Statistics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/rankings" 
          element={
            <ProtectedRoute requireAuth={true} redirectTo="/auth/login">
              <Rankings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/matches" 
          element={
            <ProtectedRoute requireAuth={true} redirectTo="/auth/login">
              <Matches />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/challenges" 
          element={
            <ProtectedRoute requireAuth={true} redirectTo="/auth/login">
              <Challenges />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tournaments" 
          element={
            <ProtectedRoute requireAuth={true} redirectTo="/auth/login">
              <Tournaments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/squad-builder" 
          element={
            <ProtectedRoute requireAuth={true} redirectTo="/auth/login">
              <AISquadBuilder />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/device-pairing" 
          element={<DevicePairing />}
        />

        {/* Ayarlar Rotaları */}
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute requireAuth={true} redirectTo="/auth/login">
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings/profile" 
          element={
            <ProtectedRoute requireAuth={true} redirectTo="/auth/login">
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings/language" 
          element={
            <ProtectedRoute requireAuth={true} redirectTo="/auth/login">
              <Language />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings/security" 
          element={
            <ProtectedRoute requireAuth={true} redirectTo="/auth/login">
              <Security />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings/privacy" 
          element={
            <ProtectedRoute requireAuth={true} redirectTo="/auth/login">
              <Privacy />
            </ProtectedRoute>
          } 
        />

        {/* 404 Sayfası */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 