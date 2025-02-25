# Süper Saha - Supabase Kurulumu

Bu klasördeki SQL betikleri, Supabase veritabanınızda gerekli tabloları oluşturmak için kullanılabilir.

## Cihaz Eşleştirme Tablosu Kurulumu

`20240225_create_device_pairings.sql` betiği, device_pairings tablosunu oluşturmak için gereklidir. Bu tablo, oyuncuların seçtikleri saat, pozisyon ve takıma göre otomatik olarak atanan cihaz numaralarını kaydeder.

### Tablo Amacı ve Özellikleri

- **Aynı saat kontrolü**: Aynı saat için belirli bir cihaz ID'si yalnızca bir oyuncuya atanabilir.
- **Son kullanma süresi**: Her eşleştirmenin, seçilen saatten 2 saat sonra sona erecek şekilde bir son kullanma süresi vardır.
- **Misafir kullanıcı desteği**: Misafir (giriş yapmamış) kullanıcılar için özel tanımlayıcılarla eşleştirme yapabilme.
- **RLS Güvenliği**: Kullanıcılar yalnızca kendi eşleştirmelerini görüntüleyebilir ve düzenleyebilir.

### Kurulum İçin Adımlar

1. Supabase Studio'ya giriş yapın
2. SQL Editör'ü açın
3. `20240225_create_device_pairings.sql` dosyasındaki SQL sorgusunu yapıştırın
4. Sorguyu çalıştırın

Alternatif olarak, Supabase CLI kullanıyorsanız:

```bash
supabase db reset
```

komutu ile tüm migration'lar uygulanabilir.

## Tablonun Test Edilmesi

Tablonun doğru çalıştığını test etmek için, şu SQL sorgularını kullanabilirsiniz:

```sql
-- Test verisi eklemek için
INSERT INTO device_pairings (
  player_id, 
  selected_time, 
  selected_position, 
  selected_team, 
  device_id,
  is_guest,
  guest_identifier
) VALUES (
  'test-user-id', 
  '14:00', 
  'forvet', 
  'ev_sahibi', 
  1,
  false,
  NULL
);

-- Aynı saat ve cihaz id için yeni kayıt (hata vermeli)
INSERT INTO device_pairings (
  player_id, 
  selected_time, 
  selected_position, 
  selected_team, 
  device_id
) VALUES (
  'test-user-id-2', 
  '14:00', 
  'orta_saha', 
  'ev_sahibi', 
  1
);

-- Aktif cihaz eşleştirmelerini görüntüleme
SELECT * FROM active_device_pairings;
```

## RLS Politikaları

Bu tablo için aşağıdaki RLS politikaları otomatik olarak oluşturulur:

1. `Kullanıcılar kendi cihaz eşleştirmelerini görebilir`
2. `Kullanıcılar kendi cihaz eşleştirmelerini ekleyebilir`
3. `Kullanıcılar kendi cihaz eşleştirmelerini güncelleyebilir`

## Satır Seviyesi Güvenlik (RLS) Test Etme

RLS'nin doğru çalıştığını test etmek için Supabase UI'dan veya API ile farklı kullanıcılarla giriş yapıp eşleştirmeleri sorgulamayı deneyebilirsiniz. 