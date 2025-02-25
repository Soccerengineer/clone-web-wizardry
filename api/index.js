const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Vonage } = require('@vonage/server-sdk');
const { Auth } = require('@vonage/auth');

// Çevre değişkenlerini yükle
dotenv.config();

// API anahtarlarını al
const VONAGE_API_KEY = process.env.VONAGE_API_KEY;
const VONAGE_API_SECRET = process.env.VONAGE_API_SECRET;
const VONAGE_BRAND_NAME = process.env.VONAGE_BRAND_NAME || 'SuperSaha';

// Vonage istemcisini başlat
const vonage = new Vonage(
  new Auth({
    apiKey: VONAGE_API_KEY,
    apiSecret: VONAGE_API_SECRET
  })
);

// Express uygulamasını başlat
const app = express();
app.use(cors());
app.use(express.json());

// API durumunu kontrol etmek için endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', message: 'Vonage Verification API Service is running' });
});

/**
 * Telefon numarasını uluslararası formata çevir
 * @param {string} phone - Telefon numarası
 * @returns {string} - Formatlanmış telefon numarası
 */
function formatPhoneNumber(phone) {
  // Önce tüm boşlukları ve gereksiz karakterleri temizle
  let cleanPhone = phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
  
  // Türkiye için +90 formatını zorla
  if (cleanPhone.startsWith('+90')) {
    return cleanPhone;  // Zaten doğru formatta
  } else if (cleanPhone.startsWith('90') && !cleanPhone.startsWith('+')) {
    return `+${cleanPhone}`;  // + ekle
  } else if (cleanPhone.startsWith('0')) {
    return `+90${cleanPhone.substring(1)}`;  // 0'ı kaldır, +90 ekle
  } else if (!cleanPhone.startsWith('+')) {
    return `+90${cleanPhone}`;  // +90 ekle
  }
  return cleanPhone;
}

/**
 * Doğrulama başlatma endpoint'i
 */
app.post('/api/verify/start', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        error: 'Telefon numarası gerekli'
      });
    }
    
    const formattedPhone = formatPhoneNumber(phone);
    
    // Vonage Verify API'yi çağır - Sadece SMS için workflow_id:1 ekle
    const response = await vonage.verify.start({
      number: formattedPhone,
      brand: VONAGE_BRAND_NAME,
      workflow_id: 1  // 1: Sadece SMS, 2: Sadece sesli arama, 3: SMS sonra sesli arama (varsayılan)
    });
    
    console.log("Doğrulama başlatıldı:", response);
    
    if (response.status === '0') {
      return res.json({
        success: true,
        request_id: response.request_id
      });
    } else {
      return res.status(400).json({
        success: false,
        error: response.error_text || 'Doğrulama başlatılamadı'
      });
    }
  } catch (error) {
    console.error('Doğrulama başlatma hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Sunucu hatası'
    });
  }
});

/**
 * Doğrulama kodu kontrolü endpoint'i
 */
app.post('/api/verify/check', async (req, res) => {
  try {
    const { request_id, code } = req.body;
    
    if (!request_id || !code) {
      return res.status(400).json({ 
        success: false, 
        error: 'Request ID ve doğrulama kodu gerekli'
      });
    }
    
    // Vonage Verify API'yi çağır
    const response = await vonage.verify.check({
      request_id,
      code
    });
    
    console.log("Kod kontrolü sonucu:", response);
    
    if (response.status === '0') {
      return res.json({
        success: true
      });
    } else {
      return res.status(400).json({
        success: false,
        error: response.error_text || 'Doğrulama kodu yanlış'
      });
    }
  } catch (error) {
    console.error('Doğrulama kodu kontrolü hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Sunucu hatası'
    });
  }
});

/**
 * Doğrulama isteğini iptal etme endpoint'i
 */
app.post('/api/verify/cancel', async (req, res) => {
  try {
    const { request_id } = req.body;
    
    if (!request_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Request ID gerekli'
      });
    }
    
    // Vonage Verify API'yi çağır
    const response = await vonage.verify.control({
      request_id,
      cmd: 'cancel'
    });
    
    console.log("İptal sonucu:", response);
    
    if (response.status === '0') {
      return res.json({
        success: true
      });
    } else {
      return res.status(400).json({
        success: false,
        error: response.error_text || 'Doğrulama isteği iptal edilemedi'
      });
    }
  } catch (error) {
    console.error('Doğrulama iptali hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Sunucu hatası'
    });
  }
});

/**
 * SMS gönderme endpoint'i (opsiyonel)
 */
app.post('/api/sms/send', async (req, res) => {
  try {
    const { to, text } = req.body;
    
    if (!to || !text) {
      return res.status(400).json({ 
        success: false, 
        error: 'Alıcı numara ve mesaj metni gerekli'
      });
    }
    
    const formattedPhone = formatPhoneNumber(to);
    
    // SMS gönder
    const response = await vonage.sms.send({
      to: formattedPhone,
      from: VONAGE_BRAND_NAME,
      text
    });
    
    console.log("SMS gönderim sonucu:", response);
    
    const messageStatus = response.messages && response.messages[0];
    const isSuccess = messageStatus && messageStatus.status === '0';
    
    if (isSuccess) {
      return res.json({
        success: true,
        message_id: messageStatus.message_id
      });
    } else {
      return res.status(400).json({
        success: false,
        error: messageStatus?.error_text || 'SMS gönderilemedi'
      });
    }
  } catch (error) {
    console.error('SMS gönderim hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Sunucu hatası'
    });
  }
});

// Port belirleme
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vonage Verification API servisi ${PORT} portunda çalışıyor`);
}); 