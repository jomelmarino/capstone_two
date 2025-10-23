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
    <div className="min-h-screen" style={{ backgroundColor: '#107DAC' }}>
      <header className="bg-white shadow-lg"> {/* Mas malaking shadow */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 " style={{ backgroundColor: '#0B3C5D' }}>
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-4xl font-extrabold text-white">Dashboard 🧭</h1> {/* Mas malaking heading */}
              {userEmail && <p className="text-md text-white font-semibold mt-1">Hello, {userEmail}</p>} {/* Binago ang text color/style */}
            </div>
            <button
              onClick={handleLogout}
              // Binago ang style ng Logout button
              className="bg-white border border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold py-2 px-4 rounded-full transition duration-150 ease-in-out shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white">View The student List</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"> {/* Mas malaking gap */}
            
            {/* Design para sa HUMSS */}
            <div className="bg-white overflow-hidden rounded-xl border border-indigo-200 shadow-xl transform hover:scale-[1.03] transition duration-300 ease-in-out">
              <button
                onClick={() => router.push('/dashboard/humss')}
                // Button class: WALA TAYONG BINAGO SA WIDTH/HEIGHT (p-5 = padding lang)
                className="w-full p-5 text-center text-xl font-extrabold text-indigo-700 hover:bg-indigo-50"
              >
                HUMSS
              </button>
            </div>
            
            {/* Design para sa ABM */}
            <div className="bg-white overflow-hidden rounded-xl border border-indigo-200 shadow-xl transform hover:scale-[1.03] transition duration-300 ease-in-out">
              <button
                onClick={() => router.push('/dashboard/abm')}
                // Button class: WALA TAYONG BINAGO SA WIDTH/HEIGHT
                className="w-full p-5 text-center text-xl font-extrabold text-teal-700 hover:bg-teal-50"
              >
                ABM
              </button>
            </div>
            
            {/* Design para sa TVL-ICT */}
            <div className="bg-white overflow-hidden rounded-xl border border-indigo-200 shadow-xl transform hover:scale-[1.03] transition duration-300 ease-in-out">
              <button
                onClick={() => router.push('/dashboard/tvl-ict')}
                // Button class: WALA TAYONG BINAGO SA WIDTH/HEIGHT
                className="w-full p-5 text-center text-xl font-extrabold text-orange-700 hover:bg-orange-50"
              >
                TVL-ICT
              </button>
            </div>
            
            {/* Design para sa STEM */}
            <div className="bg-white overflow-hidden rounded-xl border border-indigo-200 shadow-xl transform hover:scale-[1.03] transition duration-300 ease-in-out">
              <button
                onClick={() => router.push('/dashboard/stem')}
                // Button class: WALA TAYONG BINAGO SA WIDTH/HEIGHT
                className="w-full p-5 text-center text-xl font-extrabold text-purple-700 hover:bg-purple-50"
              >
                STEM
              </button>
            </div>
            
            {/* Design para sa ALS */}
            <div className="bg-white overflow-hidden rounded-xl border border-indigo-200 shadow-xl transform hover:scale-[1.03] transition duration-300 ease-in-out">
              <button
                onClick={() => router.push('/dashboard/als')}
                // Button class: WALA TAYONG BINAGO SA WIDTH/HEIGHT
                className="w-full p-5 text-center text-xl font-extrabold text-green-700 hover:bg-green-50"
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