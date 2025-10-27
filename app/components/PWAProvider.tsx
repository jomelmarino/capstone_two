'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function PWAProvider() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Check if PWA is installed and user is not logged in, redirect to login
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isStandalone && !isLoggedIn && pathname !== '/login' && pathname !== '/signup' && pathname !== '/forgot-password') {
      router.push('/login');
    }

    // Listen for PWA install event
    const handleAppInstalled = () => {
      if (!localStorage.getItem('isLoggedIn')) {
        router.push('/login');
      }
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [router, pathname]);

  return null;
}