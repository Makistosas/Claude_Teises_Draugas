/**
 * Utility functions for Teisės draugas
 */

// Generate anonymous session ID (stored in localStorage)
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';

  const STORAGE_KEY = 'td_session_id';
  let sessionId = localStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, sessionId);
  }

  return sessionId;
}

// Generate metadata footer for Slack messages
export function generateMetaFooter(): string {
  const timestamp = new Date().toISOString();
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const sessionId = getSessionId().slice(0, 8); // Short version

  return `— meta: path=${path}, ts=${timestamp}, sid=${sessionId}`;
}

// Copy text to clipboard with fallback
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

// Dev-only logging
export function devLog(event: string, data?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
    console.log(`[TD:${event}]`, data ?? '');
  }
}


// Check if device is mobile
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
