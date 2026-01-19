'use client';

import { useEffect, useState, useCallback } from 'react';
import { devLog, isMobile } from '@/lib/utils';
import { MessageCircle, AlertCircle, Copy, Check } from 'lucide-react';

// Chatlio widget configuration
interface ChatlioConfig {
  embedCode: string | null;
  widgetId: string | null;
}

function getChatlioConfig(): ChatlioConfig {
  return {
    embedCode: process.env.NEXT_PUBLIC_CHATLIO_EMBED_CODE || null,
    widgetId: process.env.NEXT_PUBLIC_CHATLIO_WIDGET_ID || null,
  };
}

// Placeholder component when Chatlio is not configured
function ChatlioPlaceholder() {
  const [copied, setCopied] = useState(false);

  const instructions = `<!-- Chatlio embed code -->
<!-- Paste your Chatlio script here -->
<!-- Get it from: chatlio.com → Your widget → Install -->`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(instructions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel p-6 max-w-md mx-auto">
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-white mb-1">Chatlio nėra sukonfigūruotas</h3>
          <p className="text-sm text-navy-300">
            Kad pokalbių funkcija veiktų, reikia pridėti Chatlio kodą.
          </p>
        </div>
      </div>

      <div className="bg-navy-900/50 rounded-lg p-4 mb-4">
        <p className="text-xs text-navy-400 mb-2">1. Sukurkite .env.local failą projekto šaknyje</p>
        <p className="text-xs text-navy-400 mb-2">2. Pridėkite:</p>
        <code className="block text-xs text-accent-teal bg-navy-950 p-2 rounded overflow-x-auto">
          NEXT_PUBLIC_CHATLIO_WIDGET_ID=&quot;jūsų-widget-id&quot;
        </code>
        <p className="text-xs text-navy-400 mt-2">arba pilną embed kodą</p>
      </div>

      <button
        onClick={handleCopy}
        className="btn-secondary w-full text-sm"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            Nukopijuota!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Kopijuoti instrukcijas
          </>
        )}
      </button>
    </div>
  );
}

// Mobile CTA button (shown instead of auto-open on mobile)
function MobileChatButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="btn-primary w-full text-lg py-4 relative overflow-hidden group"
    >
      <span className="pulse-ring group-hover:hidden" />
      <MessageCircle className="w-5 h-5" />
      Pradėti pokalbį
    </button>
  );
}

export default function ChatlioEmbed() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showMobileButton, setShowMobileButton] = useState(false);

  const config = getChatlioConfig();

  // Check if Chatlio is configured
  useEffect(() => {
    const configured = !!(config.embedCode || config.widgetId);
    setIsConfigured(configured);

    if (!configured) {
      devLog('chatlio-not-configured');
    }
  }, [config.embedCode, config.widgetId]);

  // Inject Chatlio script
  useEffect(() => {
    if (!isConfigured) return;

    // Check if already loaded
    if (document.getElementById('chatlio-widget-embed')) {
      setIsLoaded(true);
      devLog('chatlio-already-loaded');
      return;
    }

    // Option A: Full embed code
    if (config.embedCode) {
      // Create a temporary container and extract script
      const temp = document.createElement('div');
      temp.innerHTML = config.embedCode;
      const scripts = temp.querySelectorAll('script');

      scripts.forEach((script) => {
        const newScript = document.createElement('script');

        // Copy attributes
        Array.from(script.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });

        // Copy inline content
        if (script.innerHTML) {
          newScript.innerHTML = script.innerHTML;
        }

        document.body.appendChild(newScript);
      });

      devLog('chatlio-embed-injected');
      setIsLoaded(true);
      return;
    }

    // Option B: Widget ID only - construct the standard Chatlio script
    if (config.widgetId) {
      const script = document.createElement('script');
      script.id = 'chatlio-widget-embed';
      script.src = 'https://w.chatlio.com/w.chatlio-widget.js';
      script.async = true;
      script.setAttribute('data-embed-version', '2.3');
      script.setAttribute('data-widget-id', config.widgetId);

      // Initialize Chatlio array
      const initScript = document.createElement('script');
      initScript.innerHTML = `
        window._chatlio = window._chatlio || [];
        !function(){
          var t = document.getElementById("chatlio-widget-embed");
          if(t && window.ChatlioReact && _chatlio.init) return void _chatlio.init(t, ChatlioReact);
          for(var e = function(t){ return function(){ _chatlio.push([t].concat(arguments)) }},
            i = ["configure","identify","track","show","hide","isShown","isOnline","page","open","showOrHide"],
            a = 0; a < i.length; a++) _chatlio[i[a]] || (_chatlio[i[a]] = e(i[a]));
        }();
      `;

      document.body.appendChild(initScript);
      document.body.appendChild(script);

      script.onload = () => {
        devLog('chatlio-loaded');
        setIsLoaded(true);
      };

      script.onerror = () => {
        devLog('chatlio-load-error');
      };
    }
  }, [isConfigured, config.embedCode, config.widgetId]);

  // Auto-open on desktop after delay
  useEffect(() => {
    if (!isLoaded || hasInteracted) return;

    // Check if mobile
    if (isMobile()) {
      setShowMobileButton(true);
      devLog('chatlio-mobile-mode');
      return;
    }

    // Desktop: auto-open after 1200ms
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        openChat();
        devLog('chatlio-auto-opened');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [isLoaded, hasInteracted]);

  // Track user interaction
  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
    };

    // Track clicks and key presses as interaction
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  const openChat = useCallback(() => {
    if (typeof window !== 'undefined' && '_chatlio' in window) {
      const chatlio = (window as unknown as { _chatlio: { push: (args: string[]) => void } })._chatlio;
      chatlio.push(['open']);
      devLog('chatlio-opened-by-user');
    }
  }, []);

  // Show placeholder if not configured
  if (!isConfigured) {
    return <ChatlioPlaceholder />;
  }

  // Show mobile button if on mobile
  if (showMobileButton) {
    return <MobileChatButton onClick={openChat} />;
  }

  // Widget is injected globally, we just need to provide a way to trigger it
  return (
    <div className="hidden lg:block">
      {/* Desktop: Chatlio widget auto-opens or is controlled globally */}
      {!isLoaded && (
        <div className="glass-panel p-8 animate-pulse">
          <div className="flex items-center justify-center gap-3 text-navy-400">
            <MessageCircle className="w-5 h-5 animate-spin" />
            <span>Kraunamas pokalbis...</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Export a hook to open chat from other components
export function useChatlioOpen() {
  return useCallback(() => {
    if (typeof window !== 'undefined' && '_chatlio' in window) {
      const chatlio = (window as unknown as { _chatlio: { push: (args: string[]) => void } })._chatlio;
      chatlio.push(['open']);
      devLog('chatlio-opened-programmatically');
    }
  }, []);
}
