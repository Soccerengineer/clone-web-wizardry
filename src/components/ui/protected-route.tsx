import React, { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/controllers/auth.controller';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * ProtectedRoute bileşeni, yetkilendirme gerektiren sayfalara erişimi kontrol eder.
 * Kullanıcı oturum açmamışsa, belirtilen yönlendirme URL'sine yönlendirilir.
 * 
 * @param {ReactNode} children - Koruma altındaki alt bileşenler
 * @param {string} redirectTo - Yetkilendirme başarısız olduğunda yönlendirilecek URL
 * @param {boolean} requireAuth - Yetkilendirme gerekip gerekmediğini belirten bayrak (varsayılan: true)
 */
export function ProtectedRoute({
  children,
  redirectTo = '/auth/login',
  requireAuth = true,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Eğer yükleniyor durumundaysa, bir yükleniyor göstergesi göster
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Kullanıcı girişi gerektiren rotalar için: Kullanıcı giriş yapmamışsa login'e yönlendir
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Kullanıcı girişi gerektirmeyen rotalar için: Kullanıcı zaten giriş yapmışsa overview'a yönlendir
  if (!requireAuth && user) {
    return <Navigate to="/overview" replace />;
  }

  // Diğer durumlarda çocuk bileşenlerini render et
  return <>{children}</>;
} 