'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Removed BeforeInstallPromptEvent interface as it's no longer needed

export default function Detail() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#107DAC' }}>
      <div className="w-full max-w-md space-y-8 p-10 bg-white rounded-xl shadow-2xl">
        <div>
          <Image className="mx-auto h-30 w-30" src="/Logo.png" alt="Logo" width={120} height={120} loading="eager" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            How to Install App
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Follow these simple steps to install our Progressive Web App on your device.
          </p>
          <ol className="mt-4 text-left text-sm text-gray-600 list-decimal list-inside space-y-2">
            <li>Open this website in your browser.</li>
            <li>Look for the &quot;Install App&quot; or &quot;Add to Home Screen&quot; prompt.</li>
            <li>Click the install button.</li>
            <li>The app will be added to your home screen.</li>
            <li>Open it from your home screen and start using it!</li>
          </ol>
          <Image className="mx-auto mt-6" src="/Logo.png" alt="Example of the app interface" width={250} height={150} />
        </div>

        <div className="text-center space-y-4">
          <button
            onClick={() => router.push('/login')}
            className="group relative flex w-full justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-md hover:shadow-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}