// Supabase Functions - Vonage Provider Setup
// Bu dosya, Vonage Verify API entegrasyonunu içerir

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

/**
 * Vonage API Client - REST API üzerinden Vonage Verify API'yi kullanır
 */
class VonageClient {
  constructor(apiKey, apiSecret, brandName) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.brandName = brandName || 'SuperSaha';
    
    // API credentials kontrolü
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('Vonage API bilgileri eksik. Çevre değişkenleri kontrol edin.');
    }
  }
  
  /**
   * Doğrulama başlatma işlemi
   * @param {string} number - Telefon numarası
   * @return {Promise<object>} - API yanıtı
   */
  async verify_start(number) {
    const url = `https://api.nexmo.com/verify/json?api_key=${this.apiKey}&api_secret=${this.apiSecret}&number=${number}&brand=${this.brandName}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      // Verify API başarı durumunu kontrol et
      const isSuccess = data.status === "0";
      
      return { 
        success: isSuccess, 
        data,
        request_id: data.request_id || null,
        error: isSuccess ? null : (data.error_text || 'Doğrulama isteği başarısız')
      };
    } catch (error) {
      console.error('Doğrulama isteği sırasında hata:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Doğrulama kodu kontrolü
   * @param {string} requestId - İstek ID'si
   * @param {string} code - Doğrulama kodu
   * @return {Promise<object>} - API yanıtı
   */
  async verify_check(requestId, code) {
    const url = `https://api.nexmo.com/verify/check/json?api_key=${this.apiKey}&api_secret=${this.apiSecret}&request_id=${requestId}&code=${code}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      // Verify API başarı durumunu kontrol et
      const isSuccess = data.status === "0";
      
      return { 
        success: isSuccess, 
        data,
        error: isSuccess ? null : (data.error_text || 'Doğrulama kodu kontrolü başarısız')
      };
    } catch (error) {
      console.error('Doğrulama kodu kontrolü sırasında hata:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Doğrulama isteğini iptal etme
   * @param {string} requestId - İstek ID'si
   * @return {Promise<object>} - API yanıtı
   */
  async verify_cancel(requestId) {
    const url = `https://api.nexmo.com/verify/control/json?api_key=${this.apiKey}&api_secret=${this.apiSecret}&request_id=${requestId}&cmd=cancel`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      // Verify API başarı durumunu kontrol et
      const isSuccess = data.status === "0";
      
      return { 
        success: isSuccess, 
        data,
        error: isSuccess ? null : (data.error_text || 'Doğrulama isteği iptali başarısız')
      };
    } catch (error) {
      console.error('Doğrulama isteği iptali sırasında hata:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * SMS gönderimi
   * @param {string} to - Alıcı numarası
   * @param {string} text - SMS metni
   * @return {Promise<object>} - API yanıtı
   */
  async send_sms(to, text) {
    const url = 'https://rest.nexmo.com/sms/json';
    const formData = new URLSearchParams();
    formData.append('api_key', this.apiKey);
    formData.append('api_secret', this.apiSecret);
    formData.append('from', this.brandName);
    formData.append('to', to);
    formData.append('text', text);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
      });

      const data = await response.json();
    
    // Vonage başarı durumunu kontrol et
      const messageStatus = data.messages && data.messages[0];
      const isSuccess = messageStatus && messageStatus.status === '0';
    
    return { 
      success: isSuccess, 
      data,
        message_id: messageStatus?.message_id || null,
      error: isSuccess ? null : (messageStatus?.error_text || 'SMS gönderimi başarısız')
      };
  } catch (error) {
      console.error('SMS gönderimi sırasında hata:', error);
      return { success: false, error: error.message };
    }
  }
}

// Çevre değişkenlerini al
const VONAGE_API_KEY = Deno.env.get('VONAGE_API_KEY');
const VONAGE_API_SECRET = Deno.env.get('VONAGE_API_SECRET');
const VONAGE_BRAND_NAME = Deno.env.get('VONAGE_BRAND_NAME') || 'SuperSaha';

// Telefon numarasını uluslararası formata çevir
function formatPhoneNumber(phone) {
  // Önce tüm boşlukları ve gereksiz karakterleri temizle
  let cleanPhone = phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
  
  // Türkiye için +90 formatını zorla
  if (cleanPhone.startsWith('+90')) {
    return cleanPhone.substring(1);  // Vonage için + işaretini kaldır, 90... formatı gerekli
  } else if (cleanPhone.startsWith('90')) {
    return cleanPhone;  // Zaten doğru formatta
  } else if (cleanPhone.startsWith('+')) {
    return cleanPhone.substring(1);  // + işaretini kaldır
  } else if (cleanPhone.startsWith('0')) {
    return `90${cleanPhone.substring(1)}`;  // 0'ı kaldır, 90 ekle
  } else {
    return `90${cleanPhone}`;  // 90 ekle
  }
}

// HTTP isteği işleme
serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Sadece POST istekleri kabul edilir' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Vonage API Client oluştur
    const vonage = new VonageClient(VONAGE_API_KEY, VONAGE_API_SECRET, VONAGE_BRAND_NAME);
    
    // İstek parametrelerini al
    const { action, phone, code, message, requestId } = await req.json();
    
    // Telefon numarası gerektiren işlemler için kontrol
    if ((action === 'start_verification' || action === 'send_sms') && !phone) {
      return new Response(JSON.stringify({ error: 'Telefon numarası gerekli' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let result;
    
    // İşleme göre API çağrısı yap
    switch (action) {
      case 'start_verification':
        const formattedPhone = formatPhoneNumber(phone);
        result = await vonage.verify_start(formattedPhone);
        break;
        
      case 'check_verification':
        if (!requestId) {
          return new Response(JSON.stringify({ error: 'Request ID gerekli' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      if (!code) {
        return new Response(JSON.stringify({ error: 'Doğrulama kodu gerekli' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
          });
      }
        result = await vonage.verify_check(requestId, code);
        break;
        
      case 'cancel_verification':
        if (!requestId) {
          return new Response(JSON.stringify({ error: 'Request ID gerekli' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        result = await vonage.verify_cancel(requestId);
        break;
        
      case 'send_sms':
      if (!message) {
        return new Response(JSON.stringify({ error: 'Mesaj gerekli' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
          });
        }
        const formattedPhoneSMS = formatPhoneNumber(phone);
        result = await vonage.send_sms(formattedPhoneSMS, message);
        break;
        
      default:
      return new Response(JSON.stringify({ error: 'Geçersiz işlem' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
        });
    }

    if (!result.success) {
      return new Response(JSON.stringify({ 
        error: result.error || 'İşlem başarısız',
        details: result.data 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      ...result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}); 