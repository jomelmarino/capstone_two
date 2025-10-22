'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUserEmail(session.user.email || '');
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              {userEmail && <p className="text-sm text-gray-600">Logged in as: {userEmail}</p>}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <button
                onClick={() => router.push('/dashboard/humss')}
                className="w-full p-5 text-center font-medium text-gray-900 hover:bg-gray-50"
              >
                HUMSS
              </button>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <button
                onClick={() => router.push('/dashboard/abm')}
                className="w-full p-5 text-center font-medium text-gray-900 hover:bg-gray-50"
              >
                ABM
              </button>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <button
                onClick={() => router.push('/dashboard/tvl-ict')}
                className="w-full p-5 text-center font-medium text-gray-900 hover:bg-gray-50"
              >
                TVL-ICT
              </button>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <button
                onClick={() => router.push('/dashboard/stem')}
                className="w-full p-5 text-center font-medium text-gray-900 hover:bg-gray-50"
              >
                STEM
              </button>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <button
                onClick={() => router.push('/dashboard/als')}
                className="w-full p-5 text-center font-medium text-gray-900 hover:bg-gray-50"
              >
                ALS
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}