/**
 * Tarih formatlamak için yardımcı fonksiyon
 * @param dateString ISO tarih formatında string
 * @param options Formatlama seçenekleri
 * @returns Formatlanmış tarih string'i
 */
export function formatDate(
  dateString: string | Date,
  options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
): string {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  return new Intl.DateTimeFormat('tr-TR', options).format(date);
}

/**
 * Para birimi formatlamak için yardımcı fonksiyon
 * @param amount Miktar
 * @param currencyCode Para birimi kodu
 * @returns Formatlanmış para birimi string'i
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = 'TRY'
): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

/**
 * Sayıları formatlamak için yardımcı fonksiyon
 * @param number Formatlanacak sayı
 * @param options Formatlama seçenekleri
 * @returns Formatlanmış sayı string'i
 */
export function formatNumber(
  number: number,
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat('tr-TR', options).format(number);
}

/**
 * Bir metni kısaltmak için yardımcı fonksiyon
 * @param text Kısaltılacak metin
 * @param maxLength Maksimum uzunluk
 * @returns Kısaltılmış metin
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
}

/**
 * Zaman farkını insanların okuyabileceği formatta göstermek için yardımcı fonksiyon
 * @param date Tarih
 * @returns Göreceli zaman string'i
 */
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const dateObj = date instanceof Date ? date : new Date(date);
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return `${interval} yıl önce`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return `${interval} ay önce`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `${interval} gün önce`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `${interval} saat önce`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `${interval} dakika önce`;
  }
  
  return 'az önce';
}

/**
 * E-posta adresini doğrulamak için yardımcı fonksiyon
 * @param email E-posta adresi
 * @returns Geçerli mi?
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Şifre gücünü kontrol etmek için yardımcı fonksiyon
 * @param password Şifre
 * @returns Şifre gücü değerlendirmesi
 */
export function getPasswordStrength(password: string): {
  score: number;
  feedback: string;
} {
  let score = 0;
  
  // En az 8 karakter
  if (password.length >= 8) score += 1;
  
  // En az 12 karakter
  if (password.length >= 12) score += 1;
  
  // Büyük harf içeriyor
  if (/[A-Z]/.test(password)) score += 1;
  
  // Küçük harf içeriyor
  if (/[a-z]/.test(password)) score += 1;
  
  // Sayı içeriyor
  if (/[0-9]/.test(password)) score += 1;
  
  // Özel karakter içeriyor
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  let feedback = '';
  
  if (score < 2) {
    feedback = 'Çok Zayıf';
  } else if (score < 3) {
    feedback = 'Zayıf';
  } else if (score < 4) {
    feedback = 'Orta';
  } else if (score < 5) {
    feedback = 'Güçlü';
  } else {
    feedback = 'Çok Güçlü';
  }
  
  return { score, feedback };
} 