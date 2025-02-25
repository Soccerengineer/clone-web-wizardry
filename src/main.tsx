import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// React Query istemcisi
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Pencere odaklandığında otomatik yeniden getirmeyi devre dışı bırak
      staleTime: 5 * 60 * 1000, // 5 dakika geçerliliğini korur
      retry: 1, // Hata durumunda sadece 1 kez daha dene
      refetchOnMount: true, // Bileşen monte edildiğinde verileri getir
    },
  },
})

// App bileşenini QueryClientProvider ile sarmalayarak render et
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* React Query DevTools geliştirme sırasında yüklenemiyorsa hata verebilir */}
      {/* {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />} */}
    </QueryClientProvider>
  </React.StrictMode>
)
