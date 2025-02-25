# Vonage Verification API Servisi

Bu servis, Vonage API'si kullanarak telefon doğrulama işlemlerini gerçekleştiren bir Node.js API sunucusudur.

## Kurulum

1. Gerekli bağımlılıkları yükleyin:

```bash
cd api
npm install
```

2. `.env.example` dosyasını `.env` olarak kopyalayın ve Vonage API bilgilerinizi girin:

```bash
cp .env.example .env
```

3. `.env` dosyasını düzenleyerek API anahtarlarınızı ekleyin:

```
VONAGE_API_KEY=your_api_key
VONAGE_API_SECRET=your_api_secret
VONAGE_BRAND_NAME=SuperSaha
```

## Çalıştırma

Geliştirme modunda çalıştırmak için:

```bash
npm run dev
```

Üretim modunda çalıştırmak için:

```bash
npm start
```

API varsayılan olarak 3000 portunda çalışacaktır. Port değişikliği için `.env` dosyasındaki `PORT` değişkenini değiştirebilirsiniz.

## API Endpoint'leri

### Servis Durumu Kontrolü

```
GET /api/status
```

Yanıt:
```json
{
  "status": "online",
  "message": "Vonage Verification API Service is running"
}
```

### Doğrulama Başlatma

```
POST /api/verify/start
```

İstek Gövdesi:
```json
{
  "phone": "05XXXXXXXXX"
}
```

Başarılı Yanıt:
```json
{
  "success": true,
  "request_id": "abcdef123456"
}
```

### Doğrulama Kodu Kontrolü

```
POST /api/verify/check
```

İstek Gövdesi:
```json
{
  "request_id": "abcdef123456",
  "code": "123456"
}
```

Başarılı Yanıt:
```json
{
  "success": true
}
```

### Doğrulama İsteği İptali

```
POST /api/verify/cancel
```

İstek Gövdesi:
```json
{
  "request_id": "abcdef123456"
}
```

Başarılı Yanıt:
```json
{
  "success": true
}
```

### SMS Gönderme (Opsiyonel)

```
POST /api/sms/send
```

İstek Gövdesi:
```json
{
  "to": "05XXXXXXXXX",
  "text": "Merhaba, bu bir test mesajıdır."
}
```

Başarılı Yanıt:
```json
{
  "success": true,
  "message_id": "0A0000000123ABCD"
}
```

## Hata Durumları

Tüm API endpoint'leri hata durumunda şu formatta bir yanıt döndürür:

```json
{
  "success": false,
  "error": "Hata mesajı"
}
```

## Vonage SDK Entegrasyonu

Bu API servisi Vonage'ın resmi Node.js SDK'sını kullanmaktadır. Bu sayede doğrudan Verify API'sine erişim sağlanır ve Edge Functions'da yaşanabilecek uyumluluk sorunları ortadan kalkar.

## Güvenlik

API'yi üretim ortamında kullanmadan önce uygun güvenlik önlemlerini (API anahtarları, rate limiting, CORS ayarları) yapılandırdığınızdan emin olun. 