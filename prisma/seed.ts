import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@ngambalaj.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: "Admin",
        role: "SUPER_ADMIN",
      },
    });
    console.log(`✅ Admin user created: ${adminEmail}`);
  } else {
    console.log(`ℹ️ Admin user already exists: ${adminEmail}`);
  }

  // Create site settings
  const existingSettings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        id: "default",
        siteName: "NGE Ambalaj",
        siteNameEn: "NGE Packaging",
        phone: "0532 643 5501",
        phone2: "0533 357 5292",
        email: "info@ngeltd.net",
        whatsapp: "+905326435501",
        address: "Adana Organize Sanayi Bölgesi T.Özal Blv. No:6 Z:14 Sarıçam / ADANA",
        addressEn: "Adana Organized Industrial Zone T.Özal Blv. No:6 Z:14 Sarıçam / ADANA",
        workingHours: "Pazartesi - Cumartesi: 08:00 - 18:00",
        workingHoursEn: "Monday - Saturday: 08:00 - 18:00",
        footerText: "NGE Ambalaj - Endüstriyel ambalaj çözümlerinde güvenilir iş ortağınız.",
        footerTextEn: "NGE Packaging - Your reliable partner in industrial packaging solutions.",
        defaultSeoTitle: "NGE Ambalaj | Endüstriyel Ambalaj Çözümleri",
        defaultSeoTitleEn: "NGE Packaging | Industrial Packaging Solutions",
        defaultSeoDescription: "NGE Ambalaj - Çemberleme makineleri, PET/PP çemberler, streç filmler ve endüstriyel ambalaj çözümleri.",
        defaultSeoDescriptionEn: "NGE Packaging - Strapping machines, PET/PP straps, stretch films and industrial packaging solutions.",
      },
    });
    console.log("✅ Site settings created");
  }

  // Create default pages
  const defaultPages = [
    {
      slug: "hakkimizda",
      title: "Hakkımızda",
      titleEn: "About Us",
      content: {
        heroTitle: "Hakkımızda",
        heroSubtitle: "2012'den bu yana endüstriyel ambalaj sektöründe güvenilir çözüm ortağınız.",
        mainContent: `NGE Ambalaj, 2012 yılında kurulmuş olup, Türkiye'nin güneyinde Adana Organize Sanayi Bölgesi'nde faaliyet gösteren bir endüstriyel ambalaj malzemeleri ticaret firmasıdır. Sektörün dinamiklerine uygun, yüksek kalite ve sürdürülebilir iş ortaklığı ilkeleriyle çalışıyoruz.

Kuruluşumuzdan bu yana temel misyonumuz, işletmelerin lojistik ve sevkiyat süreçlerini optimize eden endüstriyel streç filmler (ön gerdirilmiş streç) ve PET çemberler başta olmak üzere ambalaj çözümleri sunmaktır. Ürünlerimiz; dayanıklılık, mukavemet ve güvenilir performans kriterleriyle seçilir, ulusal ve uluslararası standartlara uygun şekilde tedarik edilir.

NGE Ambalaj olarak biz:
- İş ortaklarımızın tedarik zincirini güçlendiren kaliteli ambalaj malzemeleri sağlıyoruz
- Her ölçekten işletmeye uygun ürün portföyüyle hızlı ve etkili ticari çözümler sunuyoruz
- İthalat ve ihracat süreçlerinde güvenilir lojistik desteği sağlıyoruz
- Müşteri memnuniyetini her zaman önceliğimiz olarak kabul ediyoruz

Müşterilerimizle kurduğumuz ilişkilerde şeffaflık, doğruluk ve süreklilik temel değerlerimizdir.`,
      },
      contentEn: {
        heroTitle: "About Us",
        heroSubtitle: "Your reliable partner in industrial packaging since 2012.",
        mainContent: `NGE Packaging was established in 2012 and operates as an industrial packaging materials trading company in Adana Organized Industrial Zone in southern Turkey. We work with principles of high quality and sustainable business partnership suitable for the dynamics of the sector.

Since our establishment, our main mission is to provide packaging solutions, especially industrial stretch films (pre-stretched stretch) and PET straps that optimize the logistics and shipping processes of businesses. Our products are selected with durability, strength and reliable performance criteria and supplied in accordance with national and international standards.

As NGE Packaging, we:
- Provide quality packaging materials that strengthen our business partners' supply chain
- Offer fast and effective commercial solutions with a product portfolio suitable for businesses of all sizes
- Provide reliable logistics support in import and export processes
- Always consider customer satisfaction as our priority

Transparency, accuracy and continuity are our core values in our relationships with our customers.`,
      },
      seoTitle: "Hakkımızda | NGE Ambalaj",
      seoTitleEn: "About Us | NGE Packaging",
      seoDescription: "NGE Ambalaj hakkında - 2012'den bu yana endüstriyel ambalaj sektöründe güvenilir çözüm ortağınız.",
      seoDescriptionEn: "About NGE Packaging - Your reliable partner in industrial packaging since 2012.",
      isActive: true,
    },
    {
      slug: "iletisim",
      title: "İletişim",
      titleEn: "Contact",
      content: {
        heroTitle: "İletişim",
        heroSubtitle: "Sorularınız için bize ulaşın, en kısa sürede size dönüş yapalım.",
        mainContent: "Endüstriyel ambalaj ihtiyaçlarınız için bizimle iletişime geçin.",
      },
      contentEn: {
        heroTitle: "Contact",
        heroSubtitle: "Contact us with your questions, we will get back to you as soon as possible.",
        mainContent: "Contact us for your industrial packaging needs.",
      },
      seoTitle: "İletişim | NGE Ambalaj",
      seoTitleEn: "Contact | NGE Packaging",
      seoDescription: "NGE Ambalaj iletişim bilgileri - Adana Organize Sanayi Bölgesi",
      seoDescriptionEn: "NGE Packaging contact information - Adana Organized Industrial Zone",
      isActive: true,
    },
  ];

  for (const pageData of defaultPages) {
    const existingPage = await prisma.page.findUnique({
      where: { slug: pageData.slug },
    });

    if (!existingPage) {
      await prisma.page.create({
        data: pageData,
      });
      console.log(`✅ Page created: ${pageData.title}`);
    } else {
      console.log(`ℹ️ Page already exists: ${pageData.slug}`);
    }
  }

  // Create default hero slide
  const existingSlides = await prisma.heroSlide.findMany();
  if (existingSlides.length === 0) {
    await prisma.heroSlide.create({
      data: {
        title: "NGE Ambalaj",
        titleEn: "NGE Packaging",
        subtitle: "Çember ve Streç Çözümleri",
        subtitleEn: "Strapping & Stretch Solutions",
        buttonText: "Ürünlerimizi İnceleyin",
        buttonTextEn: "Explore Our Products",
        buttonLink: "/urunler",
        imageDesktop: "/slider-masaustu.png",
        imageMobile: "/slider-mobil.png",
        order: 0,
        isActive: true,
      },
    });
    console.log("✅ Default hero slide created");
  }

  // Create default menu items
  const existingMenuItems = await prisma.menuItem.findMany();
  if (existingMenuItems.length === 0) {
    // Header menu items
    const headerMenuItems = [
      {
        title: "Ana Sayfa",
        titleEn: "Home",
        href: "/",
        order: 0,
        menuType: "header",
        isProductsMenu: false,
      },
      {
        title: "Ürünler",
        titleEn: "Products",
        href: "/urunler",
        order: 1,
        menuType: "header",
        isProductsMenu: true, // This will auto-populate with product categories
      },
      {
        title: "Hakkımızda",
        titleEn: "About Us",
        href: "/hakkimizda",
        order: 2,
        menuType: "header",
        isProductsMenu: false,
      },
      {
        title: "İletişim",
        titleEn: "Contact",
        href: "/iletisim",
        order: 3,
        menuType: "header",
        isProductsMenu: false,
      },
    ];

    for (const menuItem of headerMenuItems) {
      await prisma.menuItem.create({
        data: menuItem,
      });
    }
    console.log("✅ Default header menu items created");

    // Footer menu items
    const footerMenuItems = [
      {
        title: "Ana Sayfa",
        titleEn: "Home",
        href: "/",
        order: 0,
        menuType: "footer",
        isProductsMenu: false,
      },
      {
        title: "Ürünler",
        titleEn: "Products",
        href: "/urunler",
        order: 1,
        menuType: "footer",
        isProductsMenu: false,
      },
      {
        title: "Hakkımızda",
        titleEn: "About Us",
        href: "/hakkimizda",
        order: 2,
        menuType: "footer",
        isProductsMenu: false,
      },
      {
        title: "İletişim",
        titleEn: "Contact",
        href: "/iletisim",
        order: 3,
        menuType: "footer",
        isProductsMenu: false,
      },
    ];

    for (const menuItem of footerMenuItems) {
      await prisma.menuItem.create({
        data: menuItem,
      });
    }
    console.log("✅ Default footer menu items created");
  } else {
    console.log("ℹ️ Menu items already exist");
  }

  // Environment awareness
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    console.log("⚠️ Running seed in PRODUCTION environment");
  }

  // ═══════════════════════════════════════════════════════════════
  // SHARED LONG DESCRIPTIONS (used by multi-product subcategories)
  // ═══════════════════════════════════════════════════════════════

  const celikCemberMakinesiDesc = `Çelik çember çemberleme makineleri, ağır ve yüksek dayanım gerektiren yükleri çelik çember ile sıkıca bağlamak ve sabitlemek için kullanılan profesyonel paketleme ekipmanlarıdır. Çelik çemberleme, plastik (PP/PET) çemberlemeye göre çok daha dayanıklıdır ve bu nedenle ağır sanayi ve yüksek güvenlik gerektiren uygulamalarda tercih edilir.

Çelik Çember Çemberleme Makinesi Türleri:

1. Manuel Çelik Çemberleme Makinesi
- Tamamen insan gücüyle çalışır
- İki parçalı sistem: Germe aleti (tensioner) + Sıkıştırma aleti (sealer/pense)
- Küçük ve orta ölçekli işletmelerde tercih edilir
- Maliyet düşüktür, taşınabilir

2. Pnömatik (Havalı) Çelik Çemberleme Makinesi
- Hava kompresörü ile çalışır
- Çelik çemberi gerer, mühürler, keser
- Tek makine ile tam proses yapılır
- Ağır sanayi için idealdir
- Daha yüksek ve kontrollü germe kuvveti, seri üretime uygun, operatör eforunu azaltır

3. Otomatik / Yarı Otomatik Çelik Çemberleme Sistemleri
- Palet hatlarında veya üretim bantlarında kullanılır
- Ürünü algılayıp otomatik çemberleme yapabilir
- Hızlı ve yüksek güvenlikli bağlama sağlar
- Büyük fabrikalar için uygundur

Kullanılan Çember Türleri:
• Siyah çelik çember
• Mavilendirilmiş çelik çember
• Galvanizli çelik çember
• Serrated (diş açılmış) çelik çember — kaymayı önler
Kalınlık: 0,5 - 1 mm, Genişlik: 13 - 32 mm

Kullanıldığı Sektörler:
• Demir - Çelik Sanayi (profil, boru, çelik rulolar, inşaat demiri)
• Ahşap ve Orman Ürünleri (tomruk, kereste, paletli ahşap)
• Mermer - Taş - Seramik Sanayi (blok mermer, seramik kasa/palet)
• Kimya ve Petrokimya (IBC tanklar, çelik variller, tehlikeli madde)
• Metal İşleme ve Makine Sektörü (ağır makine parçaları, döküm, çelik levha)
• Lojistik ve Nakliye (liman yük sabitleme, uzun sevkiyat)`;

  const celikCemberMakinesiDescEn = `Steel strapping machines are professional packaging equipment used to tightly bind and secure heavy loads requiring high strength with steel straps. Steel strapping is much more durable than plastic (PP/PET) strapping and is therefore preferred in heavy industry and applications requiring high security.

Steel Strapping Machine Types:

1. Manual Steel Strapping Machine
- Operates entirely by human power
- Two-part system: Tensioner + Sealer
- Preferred by small and medium-sized enterprises
- Low cost, portable

2. Pneumatic Steel Strapping Machine
- Operates with air compressor
- Tensions, seals, and cuts steel straps
- Complete process with single machine
- Ideal for heavy industry

3. Automatic / Semi-Automatic Steel Strapping Systems
- Used on pallet lines or production belts
- Can detect products and strap automatically
- Fast and high-security binding

Industries: Steel, Wood & Forestry, Marble & Ceramics, Chemical & Petrochemical, Metal Processing & Machinery, Logistics & Transport`;

  const elTipiDesc = `El tipi manuel çemberleme makinesi, PP, PET veya çelik çemberin yük etrafına sarılarak gerilmesini, sıkıştırılmasını ve sabitlenmesini sağlayan, tamamen insan gücüyle çalışan bağlama ekipmanıdır.

Genellikle iki parçadan oluşur:
1. Germe Aleti (Tensioner) - Çemberi sıkı şekilde gerer
2. Sıkıştırma / Mühürleme Penseleri (Sealer) - Metal tokayı kapatarak çemberi sabitler

Bazı manuel modellerde germe, kesme ve sıkıştırma aynı cihaz üzerinde de olabilir (3-in-1 modeller).

Özellikleri:
• Elektrik veya hava gerektirmez → her ortamda kullanılabilir
• Taşınabilir, hafif ve düşük maliyetlidir
• Bakımı kolaydır
• Küçük/orta hacimli üretim için idealdir
• PP, PET veya çelik çember ile kullanılabilir (makine tipine göre)

Kullanıldığı Çember Türleri:
• PP Çember: Kutu, koli, hafif ve orta ağırlık
• PET Çember: Orta ve ağır yükler (manuel germe ile)
• Çelik Çember: Ağır sanayi ürünleri (ayrı sealer + tensioner ile)

Kullanıldığı Sektörler:
• Lojistik - Kargo - Depolama
• Ahşap ve Orman Ürünleri
• Gıda ve İçecek Sektörü
• Tekstil ve Ambalaj Sanayi
• İnşaat ve Endüstriyel Malzeme
• Kimya ve Boya Ürünleri
• Küçük/Orta Ölçekli Üretim Atölyeleri

Avantajları:
• Ekonomik fiyatlı
• Eğitim gerektirmez, kullanımı kolay
• Elektrik/hava ihtiyacı yok → Mobil kullanım
• Kolay taşınır
• Az bakım gerektirir`;

  const elTipiDescEn = `Manual hand strapping tool is binding equipment that operates entirely by human power, wrapping, tensioning, crimping and securing PP, PET or steel straps around loads.

It generally consists of two parts:
1. Tensioner - Tightly tensions the strap
2. Sealer/Crimper - Secures the strap by closing the metal buckle

Some manual models have tensioning, cutting and crimping on the same device (3-in-1 models).

Features:
• No electricity or air required → can be used in any environment
• Portable, lightweight and low cost
• Easy maintenance
• Ideal for small/medium volume production
• Can be used with PP, PET or steel straps (depending on machine type)

Compatible Strap Types:
• PP Strap: Boxes, cartons, light and medium weight
• PET Strap: Medium and heavy loads
• Steel Strap: Heavy industry products

Industries: Logistics, Wood & Forestry, Food & Beverage, Textile & Packaging, Construction, Chemical, Small/Medium Production Workshops`;

  const havaliDesc = `Havalı çemberleme makineleri, kompresörden aldığı hava basıncıyla çalışan, çemberi geren (tension), mühürleyen/sıkan (sealing), kesen (cutting) tam otomatik bir sistemle çalışan profesyonel çemberleme ekipmanlarıdır. Manuel makinelerden çok daha güçlüdür ve seri üretim için idealdir.

Havalı Çemberleme Makinesi Türleri:

1. PP/PET Çember İçin Havalı Makineler
- Genellikle sürtünme kaynaklı (friction weld) sistem kullanır
- Çemberi ısı ve sürtünmeyle birleştirir → toka gerektirmez
- 12-19 mm PET/PP çemberlerde yüksek performans sağlar

2. Çelik Çember İçin Havalı Makineler
- Çelik çemberi gerer, mühürler ve keser
- Mühürleme tokalı veya tokasız (seal-less) olabilir

Özellikleri:
• Çok yüksek germe kuvveti (4000-8000 N ve üstü)
• Seri üretime uygun yüksek hız
• Operatör eforunu büyük oranda azaltır
• Güvenli ve homojen kaynakama (PP/PET için)
• Dayanıklı gövde (alüminyum, çelik alaşım)
• Uzun ömürlü mekanizma
• Endüstriyel ortamlara uygun

Kullanıldığı Sektörler:
• Demir - Çelik Sanayi
• Mermer - Taş - Seramik
• Ahşap ve Orman Ürünleri
• Kimya - Petrokimya - Varil Paketleme
• Lojistik - Depolama - Sevkiyat
• Makine - Otomotiv - Döküm Sanayi

Avantajları:
• Çok yüksek germe gücü sağlar
• Manuel makinelere göre 10 kat daha hızlıdır
• Operatör için minimum efor
• Seri üretim hatlarına uygundur
• Homojen ve güvenli bağlantı
• Toka masrafını ortadan kaldırır (PET/PP için)
• Endüstriyel ağır koşullara dayanır`;

  const havaliDescEn = `Pneumatic strapping machines are professional strapping equipment that operate with air pressure from a compressor, working with a fully automatic system that tensions, seals and cuts straps. They are much more powerful than manual machines and ideal for mass production.

Pneumatic Strapping Machine Types:

1. Pneumatic Machines for PP/PET Straps
- Generally uses friction weld system
- Joins straps with heat and friction → no buckle needed
- High performance with 12-19 mm PET/PP straps

2. Pneumatic Machines for Steel Straps
- Tensions, seals and cuts steel straps
- Sealing can be with or without seals (seal-less)

Features:
• Very high tensioning force (4000-8000 N and above)
• High speed suitable for mass production
• Greatly reduces operator effort
• Safe and homogeneous welding (for PP/PET)
• Durable body (aluminum, steel alloy)

Industries: Steel, Marble & Ceramics, Wood & Forestry, Chemical & Petrochemical, Logistics, Automotive & Machinery`;

  const masaTipiDesc = `Masa tipi çemberleme makinesi, kutu, koli ve hafif-orta paletli ürünleri PP çember ile hızlı ve pratik şekilde bağlamaya yarayan, elektrikle çalışan yarı otomatik bir çemberleme makinesidir.

Ürün makinenin üzerine konur → Çember makinenin kanalından geçirilir → Makine otomatik olarak: çemberi gerer, ısı ile kaynatır (welding), keser ve işlem birkaç saniyede tamamlanır.

Bu tip makinelerde genellikle tokasız sistem vardır (PP çemberi kendisi kaynatır).

Özellikleri:
• PP çember ile çalışır (genellikle 6-15 mm)
• Yarı otomatik çalışma prensibi
• Hızlı bağlama (2-3 saniyede çemberleme)
• Düşük enerji tüketimi
• Ayarlanabilir germe kuvveti
• Kullanımı kolay, operatör dostu
• Hafif-orta yükler için uygundur
• Ayar gerektirmez, bakım masrafı düşüktür

Hangi Çember Türü Kullanılır?
- Sadece PP (Polypropylene) çember
- PET ve ÇELİK çember KULLANILMAZ

Kullanıldığı Sektörler:
• Kargo - Lojistik - Depolama
• Gıda ve İçecek Sektörü
• Tekstil - Ayakkabı - Konfeksiyon
• Elektronik - E-ticaret
• Ambalaj ve Plastik Ürün Üretimi
• Matbaa - Kağıt - Kırtasiye
• Küçük / Orta Ölçekli Üretim Atölyeleri

Avantajları:
• Çok hızlı çemberleme
• Uygun fiyatlı
• Operatör eğitimi gerektirmez
• Dayanıklı ve uzun ömürlü
• Az bakım gerektirir
• Koli standartlaştırmasını artırır
• Tokaya ihtiyaç yok → maliyeti düşürür`;

  const masaTipiDescEn = `Tabletop strapping machine is a semi-automatic, electrically operated strapping machine that quickly and practically binds boxes, cartons and light-medium palletized products with PP straps.

The product is placed on the machine → The strap is passed through the machine channel → The machine automatically: tensions the strap, heat welds, cuts and the process is completed in a few seconds.

These machines generally have a sealless system (the machine welds the PP strap itself).

Features:
• Works with PP strap (generally 6-15 mm)
• Semi-automatic operation
• Fast binding (strapping in 2-3 seconds)
• Low energy consumption
• Adjustable tensioning force
• Easy to use, operator friendly
• Suitable for light-medium loads

Strap Type: Only PP (Polypropylene) strap - PET and STEEL straps are NOT used

Industries: Cargo & Logistics, Food & Beverage, Textile, Electronics & E-commerce, Packaging, Printing, Small/Medium Production Workshops`;

  const preStretchDesc = `Pre-Streç film, üretim aşamasında önceden gerilmiş (pre-stretched) olan, standart streç filme göre daha ince, hafif ve daha ekonomik bir ambalaj filmidir.

Önceden gerilmiş olduğu için kullanıcı tarafından ekstra güç uygulanmasına gerek yoktur. Bu da daha az malzeme tüketimi, daha kolay sarım ve daha düşük işçilik maliyeti sağlar. Genelde elle sarım için kullanılır ve ergonomik kullanım açısından en verimli streç çeşitlerinden biridir.

Pre-Streç Filmin Özellikleri:
• Önceden %200-300 oranında gerilmiş yapı
• Daha az film tüketimi, düşük maliyet
• Hafif ve ergonomik kullanım
• Yüksek yapışkanlık ve sarım performansı
• Yük üzerinde homojen gerilim dağılımı
• Kopma direnci yüksek
• Yükü sabitleme etkisi güçlü
• Atık miktarı az
• Sessiz açılan film (gürültüsüz kullanım)
• Ekonomik ve çevre dostu

Pre-Streç Film Nerelerde Kullanılır?
• Lojistik ve Depolama (palet sarımı, dağıtım merkezleri)
• Gıda ve İçecek Sektörü (koli paletleme, soğuk hava deposu)
• Tekstil ve Kumaş Sektörü (rulo kumaş sarımı, hazır giyim kolileri)
• Plastik, Kimya ve Ambalaj Sanayi (kimyasal bidonlar, hafif sanayi ürünleri)
• E-ticaret ve Kargo (sevkiyat öncesi koli güvenliği)
• Beyaz Eşya ve Elektronik (küçük ev aletleri paketleri)
• Tarım ve Endüstriyel Ürünler (tarım kasaları, tohum/gübre çuvalları)

Avantajları:
• Standart streç filme göre %40-60 tasarruf sağlar
• Kullanıcıyı yormaz (ekstra çekme kuvveti gerektirmez)
• Sarım kalitesi standarttır, kullanıcı kaynaklı hataları azaltır
• Malzeme daha ince olduğu halde dayanımı yüksektir
• Hafif yapıda olduğu için taşıması ve kullanması kolaydır
• Çevre dostudur (daha az atık üretir)`;

  const preStretchDescEn = `Pre-Stretch film is a packaging film that is pre-stretched during production, thinner, lighter and more economical than standard stretch film.

Since it is pre-stretched, no extra force needs to be applied by the user. This provides less material consumption, easier wrapping and lower labor costs. It is generally used for hand wrapping and is one of the most efficient stretch types in terms of ergonomic use.

Features:
• Pre-stretched structure at 200-300% ratio
• Less film consumption, low cost
• Lightweight and ergonomic use
• High adhesion and wrapping performance
• Homogeneous tension distribution on load
• High tear resistance
• Strong load securing effect
• Low waste amount
• Silent opening film (noiseless use)
• Economical and environmentally friendly

Usage Areas: Logistics & Storage, Food & Beverage, Textile & Fabric, Plastic/Chemical & Packaging, E-commerce & Cargo, White Goods & Electronics, Agriculture & Industrial Products

Advantages:
• Provides 40-60% savings compared to standard stretch film
• Does not tire the user (no extra pulling force required)
• Standard wrapping quality, reduces user-caused errors
• High durability despite thinner material
• Easy to carry and use due to lightweight structure
• Environmentally friendly (produces less waste)`;

  const endustriyelYagDesc = `Endüstriyel yağlar; makine, ekipman ve üretim hatlarının sürtünmeyi azaltması, aşınmayı önlemesi, soğutması, korozyondan koruması ve verimliliği artırması için kullanılan özel formüle edilmiş yağlardır.

Genellikle mineral, yarı sentetik veya tam sentetik baz yağlara performans artırıcı katkı maddeleri eklenerek üretilirler.

Endüstriyel Yağ Türleri:
• Hidrolik Yağlar - Forkliftler, pres makineleri, iş makineleri
• Dişli (Gear) Yağları - Redüktörler, vinçler, ağır sanayi makineleri
• Motor Yağları - Sanayi jeneratörleri, kompresör motorları
• Kompresör Yağları - Hava ve gaz kompresörleri
• Kesme Sıvıları - Torna, freze, CNC, taşlama
• Koruyucu Yağlar - Metalleri korozyona karşı korur
• Isı Transfer Yağları - Kalıp ısıtma, endüstriyel fırınlar
• Zincir Yağları - Fırın içi zincirler, yüksek sıcaklık sistemleri

Kullanıldığı Sektörler:
• Metal işleme sanayi
• Otomotiv üretim tesisleri
• Plastik enjeksiyon tesisleri
• Tekstil fabrikaları
• Gıda üretim tesisleri (gıda sınıfı - NSF H1 yağlar)
• Ambalaj makineleri
• Ağır iş makineleri ve inşaat sektörü
• Madencilik ve taş ocakları
• Enerji ve jeneratör sektörleri
• Kimya ve petrokimya endüstrisi

Faydaları:
• Makine ömrünü uzatır
• Verimi artırır
• Enerji tüketimini azaltır
• Aşınmayı ve ısıyı düşürür
• Arıza ve duruş sürelerini azaltır
• Korozyon ve paslanmayı engeller`;

  const endustriyelYagDescEn = `Industrial oils are specially formulated oils used for machines, equipment and production lines to reduce friction, prevent wear, cool, protect from corrosion and increase efficiency.

They are generally produced by adding performance-enhancing additives to mineral, semi-synthetic or fully synthetic base oils.

Industrial Oil Types:
• Hydraulic Oils - Forklifts, press machines, construction equipment
• Gear Oils - Reducers, cranes, heavy industry machines
• Motor Oils - Industrial generators, compressor motors
• Compressor Oils - Air and gas compressors
• Cutting Fluids - Lathe, milling, CNC, grinding
• Protective Oils - Protects metals against corrosion
• Heat Transfer Oils - Mold heating, industrial furnaces
• Chain Oils - Furnace chains, high temperature systems

Industries: Metal processing, Automotive, Plastic injection, Textile, Food production (NSF H1), Packaging machines, Heavy equipment, Mining, Energy, Chemical & Petrochemical

Benefits:
• Extends machine life
• Increases efficiency
• Reduces energy consumption
• Reduces wear and heat
• Reduces downtime and failures
• Prevents corrosion and rust`;

  // ═══════════════════════════════════════════════════════════════
  // CATEGORIES DATA - REVIZE (32 Products Total)
  // ═══════════════════════════════════════════════════════════════
  const categoriesData = [
    // ═══════════════════════════════════════════════════
    // 1. ÇEMBERLEME MAKİNELERİ (21 products)
    // ═══════════════════════════════════════════════════
    {
      name: "Çemberleme Makineleri",
      nameEn: "Strapping Machines",
      slug: "cemberleme-makineleri",
      description: "Ağır ve hafif yüklerinizi güvenle paketlemek için profesyonel çemberleme makineleri",
      descriptionEn: "Professional strapping machines for securely packaging your heavy and light loads",
      image: "/products/cemberleme-makineleri-cat.webp",
      order: 1,
      subCategories: [
        // ─── 1.1 Çelik Çember Çemberleme Makinesi (3 products) ───
        {
          name: "Çelik Çember Çemberleme Makinesi",
          nameEn: "Steel Strapping Machines",
          slug: "celik-cember-makinesi",
          description: "Ağır ve yüksek dayanım gerektiren yükleri çelik çember ile sıkıca bağlamak için profesyonel ekipmanlar",
          descriptionEn: "Professional equipment for tightly binding heavy loads requiring high strength with steel straps",
          image: "/products/cemberleme-makineleri/celik-cember-makinesi/celik-cember-makinesi-1.webp",
          order: 1,
          products: [
            {
              name: "Kenetlemeli Çelik Çember Makinası",
              nameEn: "Clamp-Type Steel Strapping Machine",
              slug: "kenetlemeli-celik-cember-makinasi",
              description: "Manuel kenetleme sistemi ile çelik çemberi güvenle sabitleyen profesyonel çemberleme makinası",
              descriptionEn: "Professional strapping machine that securely fastens steel straps with manual clamping system",
              longDescription: celikCemberMakinesiDesc,
              longDescriptionEn: celikCemberMakinesiDescEn,
              image: "/products/cemberleme-makineleri/celik-cember-makinesi/celik-cember-makinesi-1.webp",
              order: 1,
              isFeatured: true,
            },
            {
              name: "A337 MicroLock Çelik Çemberleme Makinesi",
              nameEn: "A337 MicroLock Steel Strapping Machine",
              slug: "a337-microlock",
              description: "MicroLock teknolojisi ile hassas ve güçlü çelik çemberleme sağlayan kompakt makine",
              descriptionEn: "Compact machine providing precise and strong steel strapping with MicroLock technology",
              longDescription: celikCemberMakinesiDesc,
              longDescriptionEn: celikCemberMakinesiDescEn,
              image: "/products/cemberleme-makineleri/celik-cember-makinesi/celik-cember-makinesi-2.jpg",
              order: 2,
              isFeatured: false,
            },
            {
              name: "SCL-2451 Çelik Çemberleme Makinesi",
              nameEn: "SCL-2451 Steel Strapping Machine",
              slug: "scl-2451",
              description: "Endüstriyel kullanıma uygun yüksek performanslı SCL serisi çelik çemberleme makinesi",
              descriptionEn: "High-performance SCL series steel strapping machine suitable for industrial use",
              longDescription: celikCemberMakinesiDesc,
              longDescriptionEn: celikCemberMakinesiDescEn,
              image: "/products/cemberleme-makineleri/celik-cember-makinesi/celik-cember-makinesi-3.jpg",
              order: 3,
              isFeatured: false,
            },
          ],
        },
        // ─── 1.2 El Tipi Çemberleme Makinesi (5 products) ───
        {
          name: "El Tipi Çemberleme Makinesi",
          nameEn: "Manual Strapping Tools",
          slug: "el-tipi-cemberleme",
          description: "PP, PET veya çelik çemberin yük etrafına sarılarak gerilmesini sağlayan, tamamen insan gücüyle çalışan bağlama ekipmanları",
          descriptionEn: "Binding equipment that operates entirely by human power, wrapping and tensioning PP, PET or steel straps around loads",
          image: "/products/cemberleme-makineleri/el-tipi/el-tipi-1.webp",
          order: 2,
          products: [
            {
              name: "Lifli Çember Gerdirici Makine",
              nameEn: "Fiber Strap Tensioning Machine",
              slug: "lifli-cember-gerdirici",
              description: "Lifli ve kompozit çemberleri güçlü şekilde geren portatif el tipi gerdirici makine",
              descriptionEn: "Portable hand-type tensioning machine that powerfully tensions fiber and composite straps",
              longDescription: elTipiDesc,
              longDescriptionEn: elTipiDescEn,
              image: "/products/cemberleme-makineleri/el-tipi/el-tipi-1.webp",
              order: 1,
              isFeatured: true,
            },
            {
              name: "El Tipi PP/PET Çemberleme Aleti",
              nameEn: "Hand-Type PP/PET Strapping Tool",
              slug: "el-tipi-pp-pet-cemberleme",
              description: "PP ve PET çemberleri elle germe ve sabitleme yapan kompakt çemberleme aleti",
              descriptionEn: "Compact strapping tool for manually tensioning and securing PP and PET straps",
              longDescription: elTipiDesc,
              longDescriptionEn: elTipiDescEn,
              image: "/products/cemberleme-makineleri/el-tipi/el-tipi-2.webp",
              order: 2,
              isFeatured: false,
            },
            {
              name: "Manuel Çember Makinası",
              nameEn: "Manual Strapping Machine",
              slug: "manuel-cember-makinasi",
              description: "Küçük ve orta ölçekli işletmeler için ekonomik manuel çemberleme makinası",
              descriptionEn: "Economical manual strapping machine for small and medium-sized enterprises",
              longDescription: elTipiDesc,
              longDescriptionEn: elTipiDescEn,
              image: "/products/cemberleme-makineleri/el-tipi/el-tipi-3.jpg",
              order: 3,
              isFeatured: false,
            },
            {
              name: "Manuel Kompozit Germe Makinası",
              nameEn: "Manual Composite Tensioning Machine",
              slug: "manuel-kompozit-germe",
              description: "Kompozit ve polyester çemberleri elle germe ve sıkıştırma yapan profesyonel alet",
              descriptionEn: "Professional tool for manually tensioning and crimping composite and polyester straps",
              longDescription: elTipiDesc,
              longDescriptionEn: elTipiDescEn,
              image: "/products/cemberleme-makineleri/el-tipi/el-tipi-4.webp",
              order: 4,
              isFeatured: false,
            },
            {
              name: "Manuel Çemberleme Penseleri",
              nameEn: "Manual Strapping Crimper Set",
              slug: "manuel-cemberleme-penseleri",
              description: "Çember tokalarını sıkıştırarak kilitleyen el tipi mühürleme penseleri seti",
              descriptionEn: "Hand-type sealing crimper set that locks strap buckles by crimping",
              longDescription: elTipiDesc,
              longDescriptionEn: elTipiDescEn,
              image: "/products/cemberleme-makineleri/el-tipi/el-tipi-5.jpg",
              order: 5,
              isFeatured: false,
            },
          ],
        },
        // ─── 1.3 Havalı Çemberleme Makinesi (4 products) ───
        {
          name: "Havalı Çemberleme Makinesi",
          nameEn: "Pneumatic Strapping Machines",
          slug: "havali-cemberleme",
          description: "Kompresörden aldığı hava basıncıyla çalışan, çemberi geren, mühürleyen ve kesen profesyonel çemberleme ekipmanları",
          descriptionEn: "Professional strapping equipment that operates with air pressure from compressor, tensioning, sealing and cutting straps",
          image: "/products/cemberleme-makineleri/havali/havali-1.webp",
          order: 3,
          products: [
            {
              name: "Havalı Çember Makinası",
              nameEn: "Pneumatic Strapping Machine",
              slug: "havali-cember-makinasi",
              description: "Kompresör ile çalışan, çemberi geren, mühürleyen ve kesen pnömatik çemberleme makinası",
              descriptionEn: "Pneumatic strapping machine that operates with compressor, tensioning, sealing and cutting straps",
              longDescription: havaliDesc,
              longDescriptionEn: havaliDescEn,
              image: "/products/cemberleme-makineleri/havali/havali-1.webp",
              order: 1,
              isFeatured: true,
            },
            {
              name: "Kompakt Havalı Çemberleme Makinesi",
              nameEn: "Compact Pneumatic Strapping Machine",
              slug: "kompakt-havali-cemberleme",
              description: "Dar alanlarda kullanıma uygun kompakt tasarımlı havalı çemberleme makinesi",
              descriptionEn: "Compact-designed pneumatic strapping machine suitable for use in tight spaces",
              longDescription: havaliDesc,
              longDescriptionEn: havaliDescEn,
              image: "/products/cemberleme-makineleri/havali/havali-2.webp",
              order: 2,
              isFeatured: false,
            },
            {
              name: "XQD-19 Havalı Plastik Çember Makinası",
              nameEn: "XQD-19 Pneumatic Plastic Strapping Machine",
              slug: "xqd-19-havali",
              description: "XQD-19 modeli ile 12-19mm PP/PET çemberlerde yüksek performans sağlayan havalı makine",
              descriptionEn: "Pneumatic machine providing high performance with 12-19mm PP/PET straps with XQD-19 model",
              longDescription: havaliDesc,
              longDescriptionEn: havaliDescEn,
              image: "/products/cemberleme-makineleri/havali/havali-3.jpg",
              order: 3,
              isFeatured: false,
            },
            {
              name: "Pnömatik PET Çemberleme Makinesi",
              nameEn: "Pneumatic PET Strapping Machine",
              slug: "pnomatik-pet-cemberleme",
              description: "PET çemberler için optimize edilmiş sürtünme kaynaklı pnömatik çemberleme makinesi",
              descriptionEn: "Pneumatic strapping machine optimized for PET straps with friction welding",
              longDescription: havaliDesc,
              longDescriptionEn: havaliDescEn,
              image: "/products/cemberleme-makineleri/havali/havali-4.webp",
              order: 4,
              isFeatured: false,
            },
          ],
        },
        // ─── 1.4 Masa Tipi Çemberleme Makinesi (4 products) ───
        {
          name: "Masa Tipi Çemberleme Makinesi",
          nameEn: "Tabletop Strapping Machines",
          slug: "masa-tipi-cemberleme",
          description: "Kutu, koli ve hafif-orta paletli ürünleri PP çember ile hızlı ve pratik şekilde bağlayan yarı otomatik makineler",
          descriptionEn: "Semi-automatic machines that quickly and practically bind boxes, cartons and light-medium palletized products with PP straps",
          image: "/products/cemberleme-makineleri/masa-tipi/masa-tipi-1.jpg",
          order: 4,
          products: [
            {
              name: "Masa Tipi PP Çember Makinesi",
              nameEn: "Tabletop PP Strapping Machine",
              slug: "masa-tipi-pp-cember",
              description: "PP çember ile kutu ve kolileri hızla bağlayan standart masa tipi çemberleme makinesi",
              descriptionEn: "Standard tabletop strapping machine that quickly binds boxes and cartons with PP strap",
              longDescription: masaTipiDesc,
              longDescriptionEn: masaTipiDescEn,
              image: "/products/cemberleme-makineleri/masa-tipi/masa-tipi-1.jpg",
              order: 1,
              isFeatured: true,
            },
            {
              name: "Yarı Otomatik Masa Tipi Çember Makinesi",
              nameEn: "Semi-Automatic Tabletop Strapping Machine",
              slug: "yari-otomatik-masa-tipi",
              description: "Yarı otomatik çalışma prensibi ile verimli ve hızlı çemberleme yapan masa tipi makine",
              descriptionEn: "Tabletop machine with semi-automatic operation for efficient and fast strapping",
              longDescription: masaTipiDesc,
              longDescriptionEn: masaTipiDescEn,
              image: "/products/cemberleme-makineleri/masa-tipi/masa-tipi-2.jpg",
              order: 2,
              isFeatured: false,
            },
            {
              name: "Otomatik Masa Tipi Çember Makinesi",
              nameEn: "Automatic Tabletop Strapping Machine",
              slug: "otomatik-masa-tipi",
              description: "Tam otomatik çemberleme yapan, yüksek kapasiteli masa tipi çember makinesi",
              descriptionEn: "Fully automatic high-capacity tabletop strapping machine",
              longDescription: masaTipiDesc,
              longDescriptionEn: masaTipiDescEn,
              image: "/products/cemberleme-makineleri/masa-tipi/masa-tipi-3.webp",
              order: 3,
              isFeatured: false,
            },
            {
              name: "Endüstriyel Masa Tipi Çember Makinesi",
              nameEn: "Industrial Tabletop Strapping Machine",
              slug: "endustriyel-masa-tipi",
              description: "Endüstriyel yoğun kullanım için tasarlanmış dayanıklı masa tipi çember makinesi",
              descriptionEn: "Durable tabletop strapping machine designed for heavy industrial use",
              longDescription: masaTipiDesc,
              longDescriptionEn: masaTipiDescEn,
              image: "/products/cemberleme-makineleri/masa-tipi/masa-tipi-4.webp",
              order: 4,
              isFeatured: false,
            },
          ],
        },
        // ─── 1.5 Şarjlı Çemberleme Makinesi (5 products) ───
        {
          name: "Şarjlı Çemberleme Makinesi",
          nameEn: "Battery Powered Strapping Machines",
          slug: "sarjli-cemberleme",
          description: "Akü ile çalışan, tamamen portatif, PP ve PET çemberleri geren, kaynatan ve kesen profesyonel çemberleme makineleri",
          descriptionEn: "Battery-powered, fully portable professional strapping machines that tension, weld and cut PP and PET straps",
          image: "/products/cemberleme-makineleri/sarjli/fromm-p328/fromm-p328-1.png",
          order: 5,
          products: [
            {
              name: "Fromm P328",
              nameEn: "Fromm P328",
              slug: "fromm-p328",
              description: "Tek elle kullanılan, pille çalışan ve conta içermeyen 2'si 1 arada akülü çemberleme aleti",
              descriptionEn: "One-hand operated, battery-powered and sealless 2-in-1 strapping tool",
              longDescription: `Tek elle kullanılan, pille çalışan ve conta içermeyen bu 2'si 1 arada alet, zahmetsiz kurulum ve kullanım için az bakım gerektiren fırçasız bir motora ve ince bir tutma yerine sahiptir. Benzersiz şekilde tasarlanmış alt ünitesi, gergi külbütörü ve kayış kılavuzları ile birlikte kayış sonrası sökme işlemini kolaylaştırır. Hem tam otomatik hem de yarı otomatik versiyonları mevcuttur.

Avantajlar:
• 2600N / 585 lbs'ye kadar sağlam bir germe kuvveti sunar
• Germe kuvveti ve sızdırmazlık süresi basit düğmeler kullanılarak kolayca ayarlanabilir
• Kolaylaştırılmış işlevsellik için hem yarı otomatik hem de otomatik versiyonları mevcuttur
• Dayanıklılığı artıran ve bakımı azaltan fırçasız bir motorla donatılmıştır
• Aleti kayışlardan ayırırken minimum çaba için yükseltilmiş plakalar ve kılavuzlar içerir
• Aşırı ısınmayı önlemek için motor sıcaklığı izleme özelliğine sahiptir
• Bir döngü sayacı ile birlikte gelir
• Akü güvenli bir şekilde korunur
• Kullanıcı rahatlığı için entegre akü şarj göstergesi
• Tek elle zahmetsiz kullanım için tasarlanmıştır
• Parmak güvenliğini sağlamak için tamamen kapalı
• Aşırı ısınma riskini daha da azaltmak için isteğe bağlı motor soğutma fanı mevcuttur`,
              longDescriptionEn: `This one-hand operated, battery-powered and sealless 2-in-1 tool features a brushless motor requiring low maintenance for effortless setup and use, along with a slim grip. Its uniquely designed bottom unit facilitates post-strap removal with tension cam and strap guides. Both fully automatic and semi-automatic versions are available.

Advantages:
• Offers solid tensioning force up to 2600N / 585 lbs
• Tensioning force and sealing time can be easily adjusted using simple buttons
• Both semi-automatic and automatic versions available for enhanced functionality
• Equipped with a brushless motor that increases durability and reduces maintenance
• Includes raised plates and guides for minimum effort when separating tool from straps
• Features motor temperature monitoring to prevent overheating
• Comes with a cycle counter
• Battery is safely protected
• Integrated battery charge indicator for user comfort
• Designed for effortless one-hand operation
• Fully enclosed to ensure finger safety
• Optional motor cooling fan available to further reduce overheating risk`,
              image: "/products/cemberleme-makineleri/sarjli/fromm-p328/fromm-p328-1.png",
              order: 1,
              isFeatured: true,
              images: {
                create: [
                  { url: "/products/cemberleme-makineleri/sarjli/fromm-p328/fromm-p328-2.jpg", alt: "Fromm P328 2", order: 1 },
                ],
              },
            },
            {
              name: "Signode BXT-4",
              nameEn: "Signode BXT-4",
              slug: "signode-bxt4",
              description: "EasyTrigger Teknolojisi ile ergonomi ön planda tutularak tasarlanmış bataryalı çemberleme el aleti",
              descriptionEn: "Battery-powered strapping hand tool designed with ergonomics in mind featuring EasyTrigger Technology",
              longDescription: `BXT4 bataryalı el aleti, çemberleme işlemini kolaylaştıran yeni EasyTrigger Teknolojisi ile ergonomi ön planda tutularak tasarlanmıştır. Bu özellik, kullanıcıların aleti minimum manuel kuvvetle çalıştırmasına olanak tanıyarak iş yerindeki yorgunluğu azaltır ve verimliliği artırır.

BXT4 bataryalı el aletlerinin yenilikçi entegre dokunmatik ekranı, kullanıcıların alet ayarlarını kendi özel gereksinimlerine uyacak şekilde kolayca değiştirmelerine olanak sağlarken, ekran ayrıca uygulanan gerginlik kuvvetinin yanı sıra çember döngüsünün tamamlandığını da gösterir.

Motor destekli çember yerleştirme ve gerdirme özelliği, en zorlu ortamlarda bile yüksek hızlı, verimli çemberleme imkânı sunar.

Ürün Avantajları:
• Patentli otomatik kaynak sistemi, manuel, yarı otomatik ve tam otomatik operasyonlar arasından birini seçme şansını sunmaktadır
• Kömürsüz motor teknolojisi (wear-free) motorun ömrünü uzatır
• Her bir dolu batarya ile maksimum 800 çembere kadar çemberleme yapabilme özelliğine sahiptir
• Parça aşınmasını azaltan yüksek verimlilik sağlayan Signode'un kanıtlanmış sürtünerek yapıştırma yöntemi hızlı ve kusursuz kaynak sağlar`,
              longDescriptionEn: `The BXT4 battery-powered hand tool is designed with ergonomics at the forefront, featuring the new EasyTrigger Technology that simplifies the strapping process. This feature allows users to operate the tool with minimum manual force, reducing workplace fatigue and increasing efficiency.

The innovative integrated touchscreen of BXT4 battery tools allows users to easily change tool settings to suit their specific requirements, while the screen also shows the applied tension force as well as the completion of the strap cycle.

Motor-assisted strap placement and tensioning enables high-speed, efficient strapping even in the most demanding environments.

Product Advantages:
• Patented automatic welding system offers the choice between manual, semi-automatic and fully automatic operations
• Brushless motor technology (wear-free) extends motor life
• Capable of up to 800 strapping cycles per full battery charge
• Signode's proven friction welding method provides fast and flawless welding with high efficiency that reduces part wear`,
              image: "/products/cemberleme-makineleri/sarjli/signode-bxt4/signode-bxt4-1.webp",
              order: 2,
              isFeatured: true,
              images: {
                create: [
                  { url: "/products/cemberleme-makineleri/sarjli/signode-bxt4/signode-bxt4-2.png", alt: "Signode BXT-4 2", order: 1 },
                  { url: "/products/cemberleme-makineleri/sarjli/signode-bxt4/signode-bxt4-3.webp", alt: "Signode BXT-4 3", order: 2 },
                ],
              },
            },
            {
              name: "Itatools ITA-20",
              nameEn: "Itatools ITA-20",
              slug: "itatools-ita20",
              description: "PET ve PP çemberler için geliştirilmiş, kompakt ve güçlü akülü çemberleme makinesi",
              descriptionEn: "Compact and powerful battery-powered strapping machine developed for PET and PP straps",
              longDescription: `Itatools ITA 20 Akülü Çember Makinesi, PET (polyester) ve PP (polipropilen) çemberler için geliştirilmiş, kompakt ve güçlü bir akülü çemberleme çözümüdür.

12-16 mm çember genişliğiyle uyumlu olan ITA 20, endüstriyel ambalajlama uygulamalarında güvenli ve dengeli bağlama performansı sunar. 2200 N maksimum germe gücü sayesinde yükleri sağlam şekilde sabitlerken, titreşimli yapıştırma (friction weld) teknolojisi ile güçlü ve homojen kaynakama sağlar.

Ergonomik tasarımı ve 3,6 kg hafif gövdesi sayesinde uzun süreli kullanımlarda operatör konforunu artırır.

Avantajları & Öne Çıkan Özellikler:
• PET & PP Çember Uyumu: 12-16 mm polyester ve polipropilen çemberlerle çalışma
• 2200 N Germe Kuvveti: Orta ve ağır yüklerde güçlü sabitleme
• Titreşimli Kaynaklama: Yüksek mukavemetli ve güvenilir çember birleştirme
• Kompakt Boyutlar: 290 x 140 x 165 mm ölçülerle dar alanlarda rahat kullanım
• Hafif Tasarım: 3,6 kg ağırlık ile ergonomik ve dengeli çalışma
• Li-Po Akü Teknolojisi: 14.8 V 2 Ah batarya ile mobil ve kablosuz kullanım
• Yüksek Germe Hızı: 12 m/dk gerdirme hızıyla hızlı çemberleme

Kullanım Alanları:
Lojistik, gıda, inşaat, metal, beyaz eşya ve ambalaj sektörlerinde, koli, palet ve paketli ürünlerin güvenli şekilde bağlanması için yaygın olarak tercih edilir.`,
              longDescriptionEn: `Itatools ITA 20 Battery Strapping Machine is a compact and powerful battery-powered strapping solution developed for PET (polyester) and PP (polypropylene) straps.

Compatible with 12-16 mm strap width, the ITA 20 provides safe and balanced binding performance in industrial packaging applications. With 2200 N maximum tensioning force, it firmly secures loads while providing strong and homogeneous welding with friction weld technology.

Its ergonomic design and lightweight 3.6 kg body increase operator comfort during long-term use.

Key Features:
• PET & PP Compatibility: Works with 12-16 mm polyester and polypropylene straps
• 2200 N Tensioning Force: Strong securing for medium and heavy loads
• Friction Welding: High strength and reliable strap joining
• Compact Dimensions: 290 x 140 x 165 mm for comfortable use in tight spaces
• Lightweight Design: 3.6 kg for ergonomic and balanced operation
• Li-Po Battery: 14.8 V 2 Ah battery for mobile and wireless use
• High Tensioning Speed: Fast strapping with 12 m/min tensioning speed`,
              image: "/products/cemberleme-makineleri/sarjli/itatools-ita20/itatools-ita20-1.jpeg",
              order: 3,
              isFeatured: false,
            },
            {
              name: "ORGAPACK ORT-270",
              nameEn: "ORGAPACK ORT-270",
              slug: "orgapack-ort-270",
              description: "Polipropilen ve polyester çemberler için şarjlı akülü çemberleme makinesi",
              descriptionEn: "Battery-powered strapping machine for polypropylene and polyester straps",
              longDescription: `ORGAPACK ORT-270 Şarjlı Akülü Çember Makinesi

Teknik Özellikleri:
• Çember Tipi: Polipropilen (PP), Polyester (PET)
• Çember Genişliği: 12-19 mm
• Çember Kalınlığı: 0.5-1.0 mm
• Ağırlık: 4 kg
• Germe Gücü: 900 - 2500 N / 400 - 1360 N (Yumuşak Germe)
• Çemberleme Adeti (Dolu Akü ile): 400 - 800 adet (Gerdirme seviyesine bağlı olarak)
• Bağlantı Şekli: Sürtünme ile Kaynatma Bağlantısı

Özellikler:
• Uygulanan germe kuvvetinin gerçek zamanlı göstergesi
• Değişken germe hızı
• Favori çemberleme fonksiyonu
• El aleti durum bilgisi için ekran rengi göstergesi
• Çember hizalama göstergesi`,
              longDescriptionEn: `ORGAPACK ORT-270 Battery-Powered Strapping Machine

Technical Specifications:
• Strap Type: Polypropylene (PP), Polyester (PET)
• Strap Width: 12-19 mm
• Strap Thickness: 0.5-1.0 mm
• Weight: 4 kg
• Tensioning Force: 900 - 2500 N / 400 - 1360 N (Soft Tension)
• Strapping Count (Full Battery): 400 - 800 pieces (depending on tensioning level)
• Connection Type: Friction Weld Connection

Features:
• Real-time indicator of applied tensioning force
• Variable tensioning speed
• Favorite strapping function
• Screen color indicator for tool status information
• Strap alignment indicator`,
              image: "/products/cemberleme-makineleri/sarjli/orgapack-ort/orgapack-ort-1.jpeg",
              order: 4,
              isFeatured: false,
            },
            {
              name: "Q-31 Akülü Çemberleme Makinesi",
              nameEn: "Q-31 Battery Strapping Machine",
              slug: "q31",
              description: "Palet, kutu, tuğla ve farklı ebatlardaki yükleri hızlı ve güvenli şekilde sabitleyen profesyonel kablosuz çemberleme makinesi",
              descriptionEn: "Professional wireless strapping machine for quickly and securely securing pallets, boxes, bricks and loads of various sizes",
              longDescription: `Akülü Çemberleme Makinası Q31, Palet, Kutu, Tuğla Parke Taşı, MDF Lambiri, Çelik Sac ve farklı ebatlardaki yükleri hızlı ve güvenli şekilde sabitlemek için tasarlanmış profesyonel bir kablosuz el paketleme makinesidir.

Endüstriyel yoğun tempoya uygun dayanıklı gövdesi, güçlü pili ve ayarlanabilir sıkma gücü ile Q31; depolama, sevkiyat ve paketleme süreçlerinizi hızlandırır, iş gücü maliyetlerinizi düşürür.

Teknik Özellikler:
• Makine Tipi: Şarjlı çember makinesi
• Model: Q-31
• Çalışma Sistemi: Şarjlı, kablosuz kullanım
• Çemberleme Tipi: Çelik ve plastik çember
• Uygulama Alanı: Lojistik, paketleme, depolama
• Pil Ömrü: Uzun pil ömrü, düşük enerji tüketimi
• Ergonomik Tasarım: Hafif ve kullanıcı dostu
• Kapasite: Yüksek verimli kullanım
• Kullanım Kolaylığı: Kolay taşınabilir, pratik kullanım
• İşlevsellik: Çelik ve plastik çemberlerle hızlı ve güvenli çemberleme
• Verimlilik: Hızlı işlem süresi ve enerji tasarrufu`,
              longDescriptionEn: `Q31 Battery Strapping Machine is a professional wireless hand packaging machine designed for quickly and securely securing Pallets, Boxes, Bricks, Paving Stones, MDF Panels, Steel Sheets and loads of various sizes.

With its durable body suitable for industrial intensive tempo, powerful battery and adjustable clamping force, Q31 accelerates your storage, shipping and packaging processes, reducing labor costs.

Technical Specifications:
• Machine Type: Battery-powered strapping machine
• Model: Q-31
• Operating System: Rechargeable, wireless use
• Strapping Type: Steel and plastic straps
• Application Area: Logistics, packaging, storage
• Battery Life: Long battery life, low energy consumption
• Ergonomic Design: Lightweight and user-friendly
• Capacity: High efficiency use
• Functionality: Fast and secure strapping with steel and plastic straps
• Efficiency: Fast processing time and energy saving`,
              image: "/products/cemberleme-makineleri/sarjli/q31/q31-1.webp",
              order: 5,
              isFeatured: false,
            },
          ],
        },
      ],
    },
    // ═══════════════════════════════════════════════════
    // 2. ÇEMBERLER (4 products)
    // ═══════════════════════════════════════════════════
    {
      name: "Çemberler",
      nameEn: "Straps",
      slug: "cemberler",
      description: "Çelik, PET, PP ve kompozit çember çeşitleri ile her türlü yük için güvenli bağlama çözümleri",
      descriptionEn: "Safe binding solutions for all types of loads with steel, PET, PP and composite strap varieties",
      image: "/products/cemberler-cat.webp",
      order: 2,
      subCategories: [
        // ─── 2.1 Çelik Çember ───
        {
          name: "Çelik Çember",
          nameEn: "Steel Straps",
          slug: "celik-cember",
          description: "Soğuk haddelenmiş veya ısıl işlem görmüş çelikten üretilen, yüksek çekme dayanımına sahip çemberler",
          descriptionEn: "Straps with high tensile strength, made from cold-rolled or heat-treated steel",
          image: "/products/cemberler/celik-cember/celik-cember-1.webp",
          order: 1,
          products: [
            {
              name: "Çelik Çember",
              nameEn: "Steel Strap",
              slug: "celik-cember",
              description: "Soğuk haddelenmiş veya ısıl işlem görmüş çelikten üretilen, yüksek çekme dayanımına sahip endüstriyel çember",
              descriptionEn: "Industrial strap with high tensile strength, made from cold-rolled or heat-treated steel",
              longDescription: `Çelik Çember Nedir?

Soğuk haddelenmiş veya ısıl işlem görmüş çelikten üretilir. Rulo halinde satılır. Tokalı, mühürlü ya da kaynaklı sistemlerle bağlanır. Yüksek çekme dayanımına sahiptir.

Kullanım Alanları:

Sanayi ve İnşaat
• Demir-çelik profiller
• Borular, kirişler, sac rulolar
• İnşaat malzemeleri

Lojistik ve Nakliye
• Paletli ağır yükler
• Uzun mesafeli sevkiyatlar
• Konteyner içi sabitleme

Orman ve Ağaç Ürünleri
• Kereste ve ahşap bloklar
• MDF, sunta paketleme

Üretim ve Metal Sanayi
• Makine parçaları
• Döküm ürünler
• Metal çubuk ve rulolar

Çelik Çemberin Avantajları:

Yüksek Mukavemet
• Çok ağır yükleri güvenle sabitler
• Kopma riski düşüktür

Dayanıklılık
• Darbeye, kesilmeye ve yüksek gerilime karşı dirençlidir
• Uzun süreli depolamaya uygundur

Isı ve Dış Ortam Dayanımı
• Yüksek sıcaklıklarda plastik çemberlere göre daha stabildir
• Zorlu dış koşullarda performansını korur

Güvenli Taşıma
• Yük dağılmasını önler
• Nakliye sırasında stabilite sağlar

Geri Dönüştürülebilir
• %100 geri dönüştürülebilir
• Çevre dostudur`,
              longDescriptionEn: `What is Steel Strap?

Made from cold-rolled or heat-treated steel. Sold in rolls. Bound with buckle, seal or welded systems. Has high tensile strength.

Usage Areas:

Industry and Construction
• Steel profiles, pipes, beams, sheet rolls
• Construction materials

Logistics and Transport
• Palletized heavy loads
• Long-distance shipments
• Container securing

Forestry and Wood Products
• Lumber and wood blocks
• MDF, chipboard packaging

Manufacturing and Metal Industry
• Machine parts, castings, metal bars and rolls

Advantages:
• High strength - safely secures very heavy loads
• Durable - resistant to impact, cutting and high tension
• Heat and outdoor resistance - more stable than plastic straps at high temperatures
• Safe transport - prevents load spreading
• 100% recyclable and environmentally friendly`,
              image: "/products/cemberler/celik-cember/celik-cember-1.webp",
              order: 1,
              isFeatured: true,
              images: {
                create: [
                  { url: "/products/cemberler/celik-cember/celik-cember-2.webp", alt: "Çelik Çember 2", order: 1 },
                  { url: "/products/cemberler/celik-cember/celik-cember-3.jpeg", alt: "Çelik Çember 3", order: 2 },
                  { url: "/products/cemberler/celik-cember/celik-cember-4.jpg", alt: "Çelik Çember 4", order: 3 },
                  { url: "/products/cemberler/celik-1.jpeg", alt: "Çelik Çember 5", order: 4 },
                  { url: "/products/cemberler/celik-2.webp", alt: "Çelik Çember 6", order: 5 },
                ],
              },
            },
          ],
        },
        // ─── 2.2 PET Çember ───
        {
          name: "PET Çember",
          nameEn: "PET Straps",
          slug: "pet-cember",
          description: "Polietilen tereftalat (polyester) malzemeden üretilen, yüksek mukavemetli çemberleme ürünü",
          descriptionEn: "High-strength strapping product made from polyethylene terephthalate (polyester) material",
          image: "/products/cemberler/pet-cember/pet-cember-2.webp",
          order: 2,
          products: [
            {
              name: "PET Çember",
              nameEn: "PET Strap",
              slug: "pet-cember",
              description: "Çelik çemberin yerini alabilecek güçte, yüksek mukavemetli polyester çember",
              descriptionEn: "High-strength polyester strap powerful enough to replace steel strap",
              longDescription: `PET (Polyester) Çember Nedir?

PET çember, polietilen tereftalat (polyester) malzemeden üretilen, yüksek mukavemetli bir çemberleme ürünüdür. PP çembere göre çok daha dayanıklı, sert ve yüksek gerilme (tensile) direncine sahip olduğu için ağır yüklerin sabitlenmesi ve güvenli taşınması için tercih edilir.

Çelik çemberin yerini alabilecek güçlükte olduğu için günümüzde birçok endüstriyel uygulamada çelik çembere alternatif olarak kullanılmaktadır.

PET Çemberin Teknik Özellikleri:
• Yüksek çekme dayanımı (yüksek mukavemet)
• Düşük esneme oranı
• Darbelere karşı yüksek direnç
• Çevresel koşullara dayanıklı (UV, nem, sıcaklık değişimleri)
• Paslanma yapmaz (çelik çemberin aksine)
• Geri dönüşebilir / çevre dostu
• Otomatik veya yarı otomatik makinelerde yüksek performans
• Gerilimi uzun süre koruyabilir

Kullanım Alanları:
• İnşaat ve Yapı Malzemeleri (tuğla, seramik, çimento, demir-çelik ürünleri)
• Metal ve Çelik Endüstrisi (çelik bobinler, metal levhalar, borular)
• Ahşap ve Orman Ürünleri (kereste, sunta, MDF paletleri)
• Lojistik ve Depolama (ağır palet yükleri, uzun süreli depolama)
• Taş ve Mermer Sektörü (mermer blok ve plakaları, granit)
• Kimya ve Ambalaj Sektörü (kimyasal variller, ağır ambalajlı ürünler)
• Beyaz Eşya ve Elektronik (buzdolabı, çamaşır makinesi sevkiyatı)
• Gıda ve İçecek Sektörü (gazlı içecek kasaları, cam şişe kasaları)

PET Çemberin Avantajları:
• Çelik çember kadar güçlü, daha güvenli ve daha hafif
• İşçilikte kesici kenarlar olmadığı için daha güvenlidir
• Makine ile kullanıldığında yüksek hız ve iş verimliliği sağlar
• Darbe dayanımı yüksektir, kırılmaz
• Dış ortamda özelliğini kaybetmeden kullanılabilir`,
              longDescriptionEn: `What is PET (Polyester) Strap?

PET strap is a high-strength strapping product made from polyethylene terephthalate (polyester) material. It is preferred for securing and safely transporting heavy loads due to its much higher durability, rigidity and tensile resistance compared to PP straps.

Being strong enough to replace steel straps, it is used as an alternative to steel straps in many industrial applications today.

Technical Features:
• High tensile strength
• Low elongation rate
• High impact resistance
• Resistant to environmental conditions (UV, moisture, temperature changes)
• Does not rust (unlike steel straps)
• Recyclable / environmentally friendly
• High performance in automatic or semi-automatic machines
• Can maintain tension for long periods

Usage Areas: Construction, Metal & Steel Industry, Wood & Forestry, Logistics, Marble & Stone, Chemical & Packaging, White Goods & Electronics, Food & Beverage

Advantages:
• As strong as steel strap, safer and lighter
• Safer in workmanship as there are no cutting edges
• Provides high speed and work efficiency when used with machine
• High impact resistance, unbreakable
• Can be used outdoors without losing its properties`,
              image: "/products/cemberler/pet-cember/pet-cember-2.webp",
              order: 1,
              isFeatured: true,
              images: {
                create: [
                  { url: "/products/cemberler/pet-cember/pet-cember-1.jpg", alt: "PET Çember 2", order: 1 },
                  { url: "/products/cemberler/pet-cember/pet-cember-3.jpg", alt: "PET Çember 3", order: 2 },
                  { url: "/products/cemberler/pet-cember/pet-cember-4.png", alt: "PET Çember 4", order: 3 },
                  { url: "/products/cemberler/pet-1.jpg", alt: "PET Çember 5", order: 4 },
                  { url: "/products/cemberler/pet-2.png", alt: "PET Çember 6", order: 5 },
                  { url: "/products/cemberler/pet-3.webp", alt: "PET Çember 7", order: 6 },
                ],
              },
            },
          ],
        },
        // ─── 2.3 PP Çember ───
        {
          name: "PP Çember",
          nameEn: "PP Straps",
          slug: "pp-cember",
          description: "Polipropilen hammaddeden üretilen, hafif ve orta ağırlıktaki paketler için ekonomik çember çözümü",
          descriptionEn: "Economical strap solution for light and medium weight packages, made from polypropylene raw material",
          image: "/products/cemberler/pp-cember/pp-cember-1.webp",
          order: 3,
          products: [
            {
              name: "PP Çember",
              nameEn: "PP Strap",
              slug: "pp-cember",
              description: "Kutu, koli ve kasa gibi hafif-orta ağırlıktaki paketler için ekonomik, esnek ve kolay kaynaklanabilen polipropilen çember",
              descriptionEn: "Economical, flexible and easily weldable polypropylene strap for light-medium weight packages like boxes and crates",
              longDescription: `PP çember, kutu/koli/kasa gibi hafif ve orta ağırlıktaki paketleri bağlamak için en çok kullanılan, ekonomik, esnek ve kolay kaynaklanabilen çember çeşididir. Hammaddesi polipropilendir; bu sayede çember hafiftir, elle taşıması kolaydır, el tipi - yarı otomatik - tam otomatik çember makineleriyle sorunsuz çalışır ve tokalı veya kaynatmalı olarak kullanılabilir.

PP çemberin en büyük avantajı fiyat/performans oranıdır: PET veya çeliğe göre daha ucuzdur, çoğu koli işini fazlasıyla görür, makinede sorun çıkarmaz ve geniş ölçü aralığında üretilir (5-6 mm'den 15-16 mm'ye kadar).

Başlıca Özellikler:
• Malzeme: Polipropilen (PP)
• Kullanım: Hafif-orta yük bağlama
• Makine uyumu: El tipi, masa tipi yarı otomatik, tam otomatik çember makineleri
• Kaynak: Tokalı (metal/plastik) veya ısı/sürtme kaynaklı
• Ölçüler: 5-6 mm (matbaa) / 8-9 mm (koli) / 12 mm (koli + hafif palet) / 15-16 mm (daha ağır iş)
• Renk: Genelde beyaz, mavi, siyah; istekle renklendirilebilir
• Core (iç çap): 200 mm ve 406 mm piyasada en yaygını

Kullanım Alanları:
• Koli ve paket bağlama
• E-ticaret gönderileri
• Gıda, deterjan, kozmetik kolileri
• Plastik ve karton kasalar
• Meyve-sebze kasaları
• Matbaa / ofset / baskı (dergi, broşür, kitap demetleri)
• A4 kağıt paketleme
• Hafif palet sabitleme
• Tekstil / konfeksiyon
• Kargo / lojistik / dağıtım
• Tarım ve gıda üretimi

PP - PET - Çelik Kıyas:
PP çember: En ekonomik, en hafif → koli, kasa, hafif palet
PET çember: Daha sağlam → orta-ağır palet, kereste, tuğla
Çelik çember: En sağlam → çok ağır, çok keskin, çok sıcak ürünler`,
              longDescriptionEn: `PP strap is the most commonly used, economical, flexible and easily weldable strap type for binding light and medium weight packages such as boxes and crates. Its raw material is polypropylene; this makes the strap lightweight, easy to carry by hand, works smoothly with manual - semi-automatic - fully automatic strapping machines and can be used with buckles or welding.

The biggest advantage of PP strap is its price/performance ratio: cheaper than PET or steel, handles most box work easily, causes no problems in machines and is produced in a wide range of sizes (from 5-6 mm to 15-16 mm).

Key Features:
• Material: Polypropylene (PP)
• Use: Light-medium load binding
• Machine compatibility: Manual, tabletop semi-automatic, fully automatic
• Welding: Buckle (metal/plastic) or heat/friction welding
• Sizes: 5-6 mm (printing) / 8-9 mm (boxes) / 12 mm (boxes + light pallets) / 15-16 mm (heavier work)

Usage Areas: Box & package binding, E-commerce shipments, Food/detergent/cosmetic boxes, Plastic & cardboard crates, Printing industry, Light pallet securing, Textile, Cargo & logistics, Agriculture

PP vs PET vs Steel Comparison:
PP: Most economical, lightest → boxes, crates, light pallets
PET: Stronger → medium-heavy pallets, lumber, bricks
Steel: Strongest → very heavy, very sharp, very hot products`,
              image: "/products/cemberler/pp-cember/pp-cember-1.webp",
              order: 1,
              isFeatured: true,
              images: {
                create: [
                  { url: "/products/cemberler/pp-cember/pp-cember-2.jpg", alt: "PP Çember 2", order: 1 },
                  { url: "/products/cemberler/pp-cember/pp-cember-3.jpg", alt: "PP Çember 3", order: 2 },
                  { url: "/products/cemberler/pp-cember/pp-cember-4.webp", alt: "PP Çember 4", order: 3 },
                  { url: "/products/cemberler/pp-1.webp", alt: "PP Çember 5", order: 4 },
                ],
              },
            },
          ],
        },
        // ─── 2.4 Kompozit Çember ───
        {
          name: "Kompozit Çember",
          nameEn: "Composite Straps",
          slug: "kompozit-cember",
          description: "Yüksek mukavemetli polyester elyafların polimer kaplamayla birleştirilmesiyle üretilen, çelik kadar güçlü ve güvenli çember",
          descriptionEn: "Strap as strong and safe as steel, produced by combining high-strength polyester fibers with polymer coating",
          image: "/products/cemberler/kompozit-cember/kompozit-cember-1.webp",
          order: 4,
          products: [
            {
              name: "Kompozit Çember",
              nameEn: "Composite Strap",
              slug: "kompozit-cember",
              description: "Çelik kadar güçlü, daha güvenli ve hafif - polyester elyaf ve polimer kaplama teknolojisi ile üretilen yüksek performanslı çember",
              descriptionEn: "As strong as steel, safer and lighter - high-performance strap produced with polyester fiber and polymer coating technology",
              longDescription: `Kompozit Çember Nedir?

Kompozit çember, yüksek mukavemetli polyester elyafların polimer kaplamayla bir araya getirilmesiyle üretilen, son derece dayanıklı bir bağlama malzemesidir. Yapısı gereği çelik çember kadar güçlü, aynı zamanda esnek ve güvenli bir alternatiftir.

Darbeye karşı yüksek dayanım, hava koşullarına direnç ve hafiflik gibi özellikleri nedeniyle ağır ve hacimli yüklerde sıkça tercih edilir. Bu nedenle bazı sektörlerde "çelik çemberin yerine geçen en güvenli çözüm" olarak bilinir.

Teknik Özellikleri:
• Çok yüksek çekme dayanımı (PET'e göre daha yüksek, bazı uygulamalarda çeliği bile geçer)
• Darbeye ve ani yük değişimlerine karşı esnek dayanım
• Nem, UV ve sıcaklık değişimlerine karşı son derece dayanıklı
• Hasar vermez (ürün yüzeyine çizik veya ezik oluşturmaz)
• Kesici kenar yoktur, kullanımı güvenlidir
• Korozyon yapmaz, paslanmaz
• Geri dönüşebilir ve çevre dostudur
• Tokalı kullanım sayesinde yeniden germe yapılabilir
• Hafif ve kolay taşınabilir
• Kargo, deniz taşımacılığı ve uzun mesafe sevkiyatlar için ideal

Kullanım Alanları:
• Ağır Sanayi ve Metal Endüstrisi (çelik borular, metal profiller, çelik sac paketleri)
• İnşaat ve Yapı Malzemeleri (mermer/granit bloklar, tuğla/briket paletleri, çimento)
• Ahşap ve Orman Ürünleri (kereste, sunta/MDF paletleri)
• Lojistik, Nakliye ve Denizcilik (deniz konteynerlerinde yük sabitleme, uzun mesafe nakliye)
• Kimya Sanayi (büyük kimyasal variller, IBC tanklar)
• Tarım ve Endüstriyel Ürün Paketleme (büyük balyalar, tarımsal makineler)
• Otomotiv ve Makine Sanayi (motor blokları, makine yedek parçaları)

Avantajları:
• Çelik kadar güçlü, çok daha güvenli
• Kesici kenar yok → iş güvenliği sağlar
• Ürüne zarar vermez
• Yüksek gerilimi uzun süre korur
• Tokalı kullanım sayesinde yük gevşediğinde tekrar sıkılabilir
• Dış ortamda uzun süre dayanır
• Depolama ve taşıma sırasında esneme ve kopma yapmaz`,
              longDescriptionEn: `What is Composite Strap?

Composite strap is an extremely durable binding material produced by combining high-strength polyester fibers with polymer coating. By its nature, it is as strong as steel strap while being a flexible and safe alternative.

It is frequently preferred for heavy and bulky loads due to its high impact resistance, weather resistance and lightweight properties. Therefore, in some sectors it is known as "the safest solution to replace steel straps."

Technical Features:
• Very high tensile strength (higher than PET, even exceeds steel in some applications)
• Flexible resistance to impacts and sudden load changes
• Extremely resistant to moisture, UV and temperature changes
• Does not damage products (no scratches or dents on product surface)
• No cutting edges, safe to use
• Does not corrode, does not rust
• Recyclable and environmentally friendly
• Can be re-tensioned with buckle use
• Lightweight and easy to transport
• Ideal for cargo, maritime transport and long-distance shipments

Usage Areas: Heavy Industry & Metal, Construction & Building Materials, Wood & Forestry, Logistics & Maritime, Chemical Industry, Agriculture, Automotive & Machinery

Advantages:
• As strong as steel, much safer
• No cutting edges → ensures workplace safety
• Does not damage products
• Maintains high tension for long periods
• Can be re-tightened when load loosens with buckle use
• Withstands outdoor conditions for long periods`,
              image: "/products/cemberler/kompozit-cember/kompozit-cember-1.webp",
              order: 1,
              isFeatured: true,
              images: {
                create: [
                  { url: "/products/cemberler/kompozit-cember/kompozit-cember-2.jpg", alt: "Kompozit Çember 2", order: 1 },
                  { url: "/products/cemberler/kompozit-cember/kompozit-cember-3.jpg", alt: "Kompozit Çember 3", order: 2 },
                  { url: "/products/cemberler/kompozit-cember/kompozit-cember-4.jpg", alt: "Kompozit Çember 4", order: 3 },
                  { url: "/products/cemberler/kompozit-1.jpg", alt: "Kompozit Çember 5", order: 4 },
                  { url: "/products/cemberler/kompozit-2.webp", alt: "Kompozit Çember 6", order: 5 },
                ],
              },
            },
          ],
        },
      ],
    },
    // ═══════════════════════════════════════════════════
    // 3. ENDÜSTRİYEL YAĞLAR (4 products)
    // ═══════════════════════════════════════════════════
    {
      name: "Endüstriyel Yağlar",
      nameEn: "Industrial Oils",
      slug: "endustriyel-yaglar",
      description: "Makine, ekipman ve üretim hatlarının sürtünmeyi azaltması, aşınmayı önlemesi ve verimliliği artırması için özel formüle edilmiş yağlar",
      descriptionEn: "Specially formulated oils for machines, equipment and production lines to reduce friction, prevent wear and increase efficiency",
      image: "/products/endustriyel-yaglar-cat.webp",
      order: 3,
      subCategories: [
        {
          name: "Endüstriyel Yağlar",
          nameEn: "Industrial Lubricants",
          slug: "genel-yaglar",
          description: "Makine bakımı ve performansı için profesyonel endüstriyel yağlama ürünleri",
          descriptionEn: "Professional industrial lubrication products for machine maintenance and performance",
          image: "/products/endustriyel-yaglar/krytox-240-aa.jpg",
          order: 1,
          products: [
            {
              name: "Krytox 240 AA Gres Yağı",
              nameEn: "Krytox 240 AA Grease",
              slug: "krytox-240-aa",
              description: "Aşırı sıcaklık ve basınç koşullarında mükemmel performans gösteren premium sentetik gres yağı",
              descriptionEn: "Premium synthetic grease that performs excellently in extreme temperature and pressure conditions",
              longDescription: endustriyelYagDesc,
              longDescriptionEn: endustriyelYagDescEn,
              image: "/products/endustriyel-yaglar/krytox-240-aa.jpg",
              order: 1,
              isFeatured: true,
            },
            {
              name: "Krytox GPL 226 Gres Yağı",
              nameEn: "Krytox GPL 226 Grease",
              slug: "krytox-gpl-226",
              description: "Geniş uygulama alanına sahip çok amaçlı sentetik gres yağı",
              descriptionEn: "Multi-purpose synthetic grease with a wide range of applications",
              longDescription: endustriyelYagDesc,
              longDescriptionEn: endustriyelYagDescEn,
              image: "/products/endustriyel-yaglar/krytox-gpl-226.jpg",
              order: 2,
              isFeatured: false,
            },
            {
              name: "Molykote Çok Amaçlı Endüstriyel Gres",
              nameEn: "Molykote Multi-Purpose Industrial Grease",
              slug: "molykote-cok-amacli",
              description: "Ağır yük koşullarında üstün performans sağlayan çok amaçlı endüstriyel gres yağı",
              descriptionEn: "Multi-purpose industrial grease providing superior performance under heavy load conditions",
              longDescription: endustriyelYagDesc,
              longDescriptionEn: endustriyelYagDescEn,
              image: "/products/endustriyel-yaglar/molykote-genel.jpg",
              order: 3,
              isFeatured: false,
            },
            {
              name: "Endüstriyel Makine Yağı",
              nameEn: "Industrial Machine Oil",
              slug: "endustriyel-makine-yagi",
              description: "Genel amaçlı endüstriyel makineler için sürtünmeyi azaltan ve makine ömrünü uzatan yağlama ürünü",
              descriptionEn: "Lubrication product that reduces friction and extends machine life for general-purpose industrial machines",
              longDescription: endustriyelYagDesc,
              longDescriptionEn: endustriyelYagDescEn,
              image: "/products/endustriyel-yaglar/endustriyel-yag-1.webp",
              order: 4,
              isFeatured: false,
            },
          ],
        },
      ],
    },
    // ═══════════════════════════════════════════════════
    // 4. ÖN GERDİRİLMİŞ STRETCHLER (PRE-STRETCH) (2 products)
    // ═══════════════════════════════════════════════════
    {
      name: "Ön Gerdirilmiş Stretchler (Pre-Stretch)",
      nameEn: "Pre-Stretch Films",
      slug: "pre-stretch",
      description: "Üretim aşamasında önceden gerilmiş, standart streç filme göre daha ince, hafif ve ekonomik ambalaj filmleri",
      descriptionEn: "Packaging films pre-stretched during production, thinner, lighter and more economical than standard stretch film",
      image: "/products/pre-stretch-cat.webp",
      order: 4,
      subCategories: [
        {
          name: "Pre-Stretch Filmler",
          nameEn: "Pre-Stretch Films",
          slug: "pre-stretch-filmler",
          description: "Önceden gerilmiş, ekonomik ve ergonomik streç film çözümleri",
          descriptionEn: "Pre-stretched, economical and ergonomic stretch film solutions",
          image: "/products/pre-stretch/pre-stretch-8mikron.jpg",
          order: 1,
          products: [
            {
              name: "8 Mikron El Tipi Pre-Stretch Film",
              nameEn: "8 Micron Hand-Type Pre-Stretch Film",
              slug: "8-mikron-el-tipi",
              description: "8 mikron kalınlığında, el tipi kullanım için önceden gerilmiş ultra ince streç film",
              descriptionEn: "8 micron thick, pre-stretched ultra-thin stretch film for hand-type use",
              longDescription: preStretchDesc,
              longDescriptionEn: preStretchDescEn,
              image: "/products/pre-stretch/pre-stretch-8mikron.jpg",
              order: 1,
              isFeatured: true,
            },
            {
              name: "9 Mikron Pre-Stretch Film",
              nameEn: "9 Micron Pre-Stretch Film",
              slug: "9-mikron",
              description: "9 mikron kalınlığında, yüksek dayanım ve ekonomi sağlayan pre-stretch ambalaj filmi",
              descriptionEn: "9 micron thick pre-stretch packaging film providing high durability and economy",
              longDescription: preStretchDesc,
              longDescriptionEn: preStretchDescEn,
              image: "/products/pre-stretch/pre-stretch-9mikron.png",
              order: 2,
              isFeatured: false,
            },
          ],
        },
      ],
    },
    // ═══════════════════════════════════════════════════
    // 5. TOKALAR (1 product)
    // ═══════════════════════════════════════════════════
    {
      name: "Tokalar",
      nameEn: "Buckles & Seals",
      slug: "tokalar",
      description: "PP çemberlerin uçlarını birleştirip sabitlemek için galvanizli veya fosfat kaplı çelik tokalar",
      descriptionEn: "Galvanized or phosphate-coated steel buckles for joining and securing the ends of PP straps",
      image: "/products/tokalar-cat.jpg",
      order: 5,
      subCategories: [
        {
          name: "Çember Tokaları",
          nameEn: "Strap Buckles",
          slug: "cember-tokalari",
          description: "PP çemberlerin uçlarını birleştirip sabitlemek için en yaygın ve uygun maliyetli yöntem",
          descriptionEn: "The most common and cost-effective method for joining and securing PP strap ends",
          image: "/products/tokalar/tel-toka.jpg",
          order: 1,
          products: [
            {
              name: "Tel Çember Tokası",
              nameEn: "Wire Strap Buckle",
              slug: "tel-cember-tokasi",
              description: "Galvanizli veya fosfat kaplı çelikten üretilen, PP çemberlerin uçlarını kilitleyen çemberleme tokası",
              descriptionEn: "Strapping buckle made from galvanized or phosphate-coated steel that locks the ends of PP straps",
              longDescription: `Tel Çember Tokası (Çemberleme Tokası / Kovan / Klips)

En yaygın kullanım alanı çemberleme işlemleridir. Karton kutu, palet gibi yüklerin etrafına geçirilen plastik (PP/PET) çemberlerin uçlarını birbirine kilitlemek için kullanılır.

Özellikleri:
• Galvanizli veya fosfat kaplı çelikten üretilir
• Tel kalınlığı farklı çember ölçülerine göre değişir (örn. 13 mm, 16 mm, 19 mm)
• El tipi veya otomatik çember makinesiyle sıkılarak çemberi sabitler
• Kaymayı önlemek için iç yüzeyleri dişli veya pürüzlü olabilir

Ölçü Uyumu:
• 12 mm PP çember → 13 mm tel toka
• 15-16 mm PP çember → 16 mm tel toka
• 18-19 mm PP çember → 19 mm tel toka

Kullanım Alanları:
• Kargo paketleme
• Palet yük sabitleme
• Sanayi ve lojistik sektörleri

Avantajları:
• Ekonomiktir
• Kolay uygulanır
• Küçük ve orta ağırlıktaki yüklerde yeterli dayanım sağlar
• Nem ve paslanmaya karşı dayanıklıdır
• Toka içindeki tırtıklı yüzey çemberin kaymasını engeller`,
              longDescriptionEn: `Wire Strap Buckle (Strapping Buckle / Sleeve / Clip)

The most common usage area is strapping operations. Used to lock the ends of plastic (PP/PET) straps wrapped around loads such as cardboard boxes and pallets.

Features:
• Made from galvanized or phosphate-coated steel
• Wire thickness varies according to different strap sizes (e.g., 13 mm, 16 mm, 19 mm)
• Secures the strap by crimping with manual or automatic strapping machine
• Inner surfaces may be serrated or rough to prevent slipping

Size Compatibility:
• 12 mm PP strap → 13 mm wire buckle
• 15-16 mm PP strap → 16 mm wire buckle
• 18-19 mm PP strap → 19 mm wire buckle

Usage Areas:
• Cargo packaging
• Pallet load securing
• Industry and logistics sectors

Advantages:
• Economical
• Easy to apply
• Provides sufficient strength for small and medium weight loads
• Resistant to moisture and rust
• Serrated surface inside the buckle prevents strap slipping`,
              image: "/products/tokalar/tel-toka.jpg",
              order: 1,
              isFeatured: true,
            },
          ],
        },
      ],
    },
  ];

  // Create categories, subcategories, and products (IDEMPOTENT - upsert)
  for (const catData of categoriesData) {
    const { subCategories, ...categoryData } = catData;

    const category = await prisma.mainCategory.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData,
    });
    console.log(`✅ Category: ${category.name}`);

    for (const subCatData of subCategories) {
      const { products, ...subCategoryData } = subCatData;

      const subCategory = await prisma.subCategory.upsert({
        where: {
          mainCategoryId_slug: {
            mainCategoryId: category.id,
            slug: subCategoryData.slug,
          },
        },
        update: {},
        create: {
          ...subCategoryData,
          mainCategoryId: category.id,
        },
      });
      console.log(`  ↳ SubCategory: ${subCategory.name}`);

      if (products && products.length > 0) {
        for (const productData of products) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { images, ...productFields } = productData as any;

          const product = await prisma.product.upsert({
            where: {
              subCategoryId_slug: {
                subCategoryId: subCategory.id,
                slug: productFields.slug,
              },
            },
            update: {},
            create: {
              ...productFields,
              subCategoryId: subCategory.id,
            },
          });

          // Upsert gallery images separately (idempotent)
          if (images?.create) {
            for (const imgData of images.create) {
              await prisma.productImage.upsert({
                where: { url: imgData.url },
                update: {},
                create: {
                  url: imgData.url,
                  alt: imgData.alt || null,
                  order: imgData.order || 0,
                  productId: product.id,
                },
              });
            }
          }
        }
        console.log(`    ↳ ${products.length} products upserted`);
      }
    }
  }

  console.log("🌱 Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
