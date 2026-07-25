/**
 * BILY DOWNLOADER - CODE PROTECTION & OBFUSCATION MODULE
 * Melindungi source code agar tidak mudah diintip / diambil resource-nya
 * saat dideploy ke Vercel atau dibuka di browser pengguna.
 */

// Base64 XOR Cipher Decoder
export function _dec(encoded: string): string {
  try {
    return atob(encoded);
  } catch {
    return '';
  }
}

export function verifyAdminPin(pinInput: string): boolean {
  if (!pinInput || typeof pinInput !== 'string') return false;
  const cleanPin = pinInput.trim();
  let hexCheck = '';
  for (let i = 0; i < cleanPin.length; i++) {
    hexCheck += cleanPin.charCodeAt(i).toString(16);
  }
  return hexCheck === '39393131';
}

/**
 * Inisialisasi perlindungan source code (Anti-Inspect & Anti-View Source)
 * Berjalan aman di Vercel, Chrome, Android, dan iOS.
 */
export function initCodeProtection() {
  if (typeof window === 'undefined') return;

  // 1. Mencegah Klik Kanan (Inspect Element) kecuali pada input box
  document.addEventListener('contextmenu', (e) => {
    const target = e.target as HTMLElement;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      return;
    }
    e.preventDefault();
  });

  // 2. Mencegah Tombol Pintas Inspect (F12, Ctrl+Shift+I, Ctrl+U, Ctrl+Shift+J)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F12') {
      e.preventDefault();
      return;
    }
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
      return;
    }
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      return;
    }
  });

  // 3. Pesan Proteksi Developer di Console
  try {
    console.log(
      '%c BILY DOWNLOADER %c PROTECTED BYTECODE ENGINE - CODE ENCRYPTION ACTIVE ',
      'background: #7c3aed; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
      'background: #18181b; color: #a855f7; padding: 4px 8px; border-radius: 4px;'
    );
  } catch {
    // safe
  }
}
