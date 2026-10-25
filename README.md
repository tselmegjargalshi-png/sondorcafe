# Сондор Кафе: цахим меню

Гар утсанд зориулсан, хурдан ачаалдаг статик цахим меню. Build алхамгүй, цэвэр HTML, CSS, JavaScript.

## Бүтэц

```
index.html              Хуудасны бүтэц
assets/css/styles.css   Дизайн (крем, бор, зөөлөн ногоон өнгө)
assets/css/fonts.css    Өөр дээрээ байршуулсан фонт (Manrope, Cormorant Garamond, Монгол үсэгтэй)
assets/js/menu-data.js  Менюгийн ангилал, бүтээгдэхүүн, үнэ
assets/js/app.js        Ангилал солих, дэлгэрэнгүй цонх, QR код, нээлттэй цагийн төлөв
assets/js/qrcode.min.js QR үүсгэгч (qrcode-generator, MIT)
```

## Меню засах

`assets/js/menu-data.js` файлд бүтээгдэхүүн нэмэх, үнэ солиход хангалттай. `img` талбарт Unsplash зургийн `photo-...` дугаарыг бичнэ.

## Локал дээр ажиллуулах

```
python3 -m http.server 8000
```

Дараа нь http://localhost:8000 хаягаар нээнэ.

## Deploy

Vercel дээр энэ репог импортлоход Framework Preset: Other, Build Command хоосон, Output Directory `.` байхад шууд ажиллана.

QR код нь хуудасны одоогийн хаягаас автоматаар үүсдэг тул домэйн солигдсон ч зөв холбоос руу заана.

## Эх сурвалж

Бүтээгдэхүүний зураг: [Unsplash](https://unsplash.com/license) (үнэгүй ашиглах лицензтэй).
