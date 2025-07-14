import { useState, useEffect } from 'react';
import { X, Download, Smartphone, Monitor } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Define proper interface for navigator with standalone property
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as NavigatorWithStandalone).standalone === true;
      setIsStandalone(standalone || isInWebAppiOS);
    };

    // Check if iOS
    const checkIOS = () => {
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setIsIOS(iOS);
    };

    checkInstalled();
    checkIOS();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show install prompt after 3 seconds if not installed
      setTimeout(() => {
        if (!isStandalone) {
          setShowInstallPrompt(true);
        }
      }, 3000);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isStandalone]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      }
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  // Don't show if already installed, dismissed, or not supported
  if (isStandalone || isInstalled || !showInstallPrompt) {
    return null;
  }

  // Check if dismissed in this session
  if (sessionStorage.getItem('installPromptDismissed')) {
    return null;
  }

  return (
    <>
      {/* Mobile Install Prompt */}
      {!isIOS && deferredPrompt && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-slide-up">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#4CAF50] rounded-lg flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">
                  Install Aplikasi
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Dapatkan akses cepat dan pengalaman yang lebih baik dengan menginstall aplikasi ini
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleInstallClick}
                    className="flex items-center gap-1 bg-[#4CAF50] text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-[#45a049] transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Install
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="text-gray-500 px-3 py-1.5 text-xs hover:text-gray-700 transition-colors"
                  >
                    Nanti
                  </button>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Install Instructions */}
      {isIOS && !isStandalone && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-slide-up">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#4CAF50] rounded-lg flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">
                  Install Aplikasi di iOS
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Tap tombol <span className="font-medium">Share</span> di Safari, lalu pilih <span className="font-medium">&quot;Add to Home Screen&quot;</span>
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleDismiss}
                    className="text-gray-500 px-3 py-1.5 text-xs hover:text-gray-700 transition-colors"
                  >
                    Mengerti
                  </button>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Install Banner */}
      {!isIOS && typeof window !== 'undefined' && window.innerWidth >= 768 && deferredPrompt && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-slide-down">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#4CAF50] rounded-lg flex items-center justify-center flex-shrink-0">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">
                  Install Desktop App
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Install aplikasi untuk akses yang lebih cepat dan mudah
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleInstallClick}
                    className="flex items-center gap-1 bg-[#4CAF50] text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-[#45a049] transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Install
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="text-gray-500 px-3 py-1.5 text-xs hover:text-gray-700 transition-colors"
                  >
                    Nanti
                  </button>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </>
  );
}