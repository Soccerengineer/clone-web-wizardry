# Vonage Doğrulama API Entegrasyonu

Bu belge, Vonage API'sini kullanarak telefon doğrulama işlemlerini uygulamanıza entegre etme sürecini açıklar.

## İki Farklı Entegrasyon Yaklaşımı

Vonage API'sini uygulamanıza entegre etmek için iki yöntem sunuyoruz:

1. **Supabase Edge Function (Deno)** - REST API'yi doğrudan çağıran hafif bir Edge Function
2. **Node.js API Servisi** - Vonage SDK'sını kullanan ayrı bir mikro servis

Her iki yaklaşım da aynı işlevselliği sağlar, ancak farklı avantajları ve kullanım durumları vardır.

## 1. Supabase Edge Function Yaklaşımı

### Avantajlar
- Supabase'e tam entegrasyon
- Herhangi bir harici sunucu gerektirmez
- Daha az kaynak kullanımı
- Daha basit dağıtım (deployment)

### Kurulum
1. Edge Function'ı dağıtın:
```bash
cd supabase/functions/vonage-provider
supabase functions deploy vonage-provider
```

2. Gerekli ortam değişkenlerini Supabase'de ayarlayın:
```bash
supabase secrets set VONAGE_API_KEY=your_api_key
supabase secrets set VONAGE_API_SECRET=your_api_secret
supabase secrets set VONAGE_BRAND_NAME=SuperSaha
```

### Kullanım
Front-end'den Edge Function'a istek göndermek için:

```javascript
const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vonage-provider`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
  },
  body: JSON.stringify({
    action: 'start_verification',
    phone: formattedPhone
  })
});

const result = await response.json();
```

## 2. Node.js API Servisi Yaklaşımı

### Avantajlar
- Vonage'ın resmi SDK'sını kullanır
- Daha fazla özellik ve esneklik
- Node.js ekosistemiyle tam uyumluluk
- Ayrı bir servis olarak ölçeklendirilebilir

### Kurulum
1. API servisini kurun:
```bash
cd api
npm install
cp .env.example .env
# .env dosyasını düzenleyerek API anahtarlarınızı ekleyin
```

2. Servisi başlatın:
```bash
npm run dev  # geliştirme modu
# veya
npm start    # üretim modu
```

### Kullanım
Front-end'den API'ye istek göndermek için:

```javascript
const response = await fetch('http://localhost:3000/api/verify/start', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    phone: formattedPhone
  })
});

const result = await response.json();
```

## API İşlevleri

Her iki entegrasyon yaklaşımı da aşağıdaki işlevleri destekler:

1. **Doğrulama Başlatma** - Telefon numarasına doğrulama kodu gönderir
2. **Doğrulama Kontrolü** - Kullanıcının girdiği kodu doğrular
3. **Doğrulama İptali** - Doğrulama isteğini iptal eder
4. **SMS Gönderme** - Doğrudan SMS gönderir (opsiyonel)

## İstek ve Yanıt Formatları

Her iki yaklaşım da tutarlı istek/yanıt formatları kullanır:

### Başarılı Yanıt
```json
{
  "success": true,
  "request_id": "abcdef123456"  // sadece doğrulama başlatma için
}
```

### Hata Yanıtı
```json
{
  "success": false,
  "error": "Hata mesajı"
}
```

## Telefon Numarası Formatı

Entegrasyon, hem yerel (örn. 05XXXXXXXXX) hem de uluslararası (örn. +905XXXXXXXX) telefon numarası formatlarını destekler. Tüm girişler otomatik olarak Vonage'ın beklediği uluslararası formata dönüştürülür.

## Vonage API Kurulumu

1. [Vonage Developer Portal](https://developer.vonage.com/)'da bir hesap oluşturun
2. Yeni bir uygulama oluşturun ve API anahtarlarınızı alın
3. SMS ve Verify API'lerine erişimi etkinleştirin
4. API anahtarlarınızı ilgili `.env` dosyasına ekleyin

## Güvenlik Notları

- API anahtarlarınızı güvenli bir şekilde saklayın
- Tüm API isteklerini HTTPS üzerinden gönderin
- Üretim ortamında API'ye erişimi uygun şekilde kısıtlayın
- Rate limiting ve gerekli güvenlik önlemlerini uygulayın

## Sorun Giderme

- Edge Function yanıt vermiyorsa, dağıtım durumunu ve ortam değişkenlerini kontrol edin
- Node.js API servisi yanıt vermiyorsa, servisin çalıştığını ve doğru portu dinlediğini kontrol edin
- Doğrulama kodu gelmiyorsa, telefon numarası formatını ve API anahtarlarını kontrol edin
- API hata mesajları genellikle sorunun kaynağını belirtir, hata mesajlarını inceleyin 