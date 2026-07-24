/**
 * BILY DOWNLOADER - SECURE AUTH VALIDATOR
 * Dedicated security module to verify admin privileges.
 */

const _HASH_TARGET = '39393131'; // Hex encoded PIN representation

export function verifyAdminPin(pinInput: string): boolean {
  if (!pinInput || typeof pinInput !== 'string') return false;
  
  const cleanPin = pinInput.trim();
  
  // Convert entered PIN to hex representation for comparison
  let hexCheck = '';
  for (let i = 0; i < cleanPin.length; i++) {
    hexCheck += cleanPin.charCodeAt(i).toString(16);
  }
  
  return hexCheck === _HASH_TARGET;
}

export function generateAdminSessionToken(): string {
  return 'bily_adm_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}
