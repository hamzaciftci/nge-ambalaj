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
        siteName: "NG Ambalaj",
        siteNameEn: "NG Packaging",
        phone: "+90 212 123 45 68",
        email: "info@ngambalaj.com",
        address: "Organize Sanayi Bölgesi\n34000 İstanbul, Türkiye",
        addressEn: "Organized Industrial Zone\n34000 Istanbul, Turkey",
        workingHours: "Pazartesi - Cuma: 09:00 - 18:00\nCumartesi: 09:00 - 14:00",
      },
    });
    console.log("✅ Site settings created");
  }

  // Delete existing data to reseed
  await prisma.product.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.mainCategory.deleteMany();
  console.log("🗑️ Cleared existing categories and products");

  // Create categories with correct image paths
  const categoriesData = [
    {
      name: "Çemberleme Makineleri",
      nameEn: "Strapping Machines",
      slug: "cemberleme-makineleri",
      description: "Profesyonel çemberleme makineleri ile ağır ve hafif yüklerinizi güvenle paketleyin",
      descriptionEn: "Securely package your heavy and light loads with professional strapping machines",
      image: "/products/cemberleme-makineleri-cat.webp",
      order: 1,
      subCategories: [
        {
          name: "Çelik Çember Çemberleme Makinesi",
          nameEn: "Steel Strapping Machine",
          slug: "celik-cember-makinesi",
          description: "Ağır yükler için profesyonel çelik çember çemberleme makineleri",
          descriptionEn: "Professional steel strapping machines for heavy loads",
          image: "/products/celik-cember-makineleri/kenetlemeli.webp",
          order: 1,
          products: [
            {
              name: "A337 Microlock Çelik Çember Makinesi",
              nameEn: "A337 Microlock Steel Strapping Machine",
              slug: "a337-microlock",
              description: "Yüksek performanslı çelik çember makinesi",
              descriptionEn: "High performance steel strapping machine",
              longDescription: "A337 Microlock, ağır sanayi uygulamaları için tasarlanmış profesyonel bir çelik çember makinesidir. Güçlü yapısı ve dayanıklı bileşenleri ile uzun ömürlü kullanım sağlar.",
              longDescriptionEn: "A337 Microlock is a professional steel strapping machine designed for heavy industrial applications. It provides long-lasting use with its strong structure and durable components.",
              image: "/products/celik-cember-makineleri/a337-microlock.jpg",
              order: 1,
              isFeatured: true,
            },
            {
              name: "SCL-2451 Çelik Çember Makinesi",
              nameEn: "SCL-2451 Steel Strapping Machine",
              slug: "scl-2451",
              description: "Kompakt tasarımlı çelik çember makinesi",
              descriptionEn: "Compact design steel strapping machine",
              longDescription: "SCL-2451, kompakt tasarımı ile dar alanlarda bile kolaylıkla kullanılabilen profesyonel bir çelik çember makinesidir.",
              longDescriptionEn: "SCL-2451 is a professional steel strapping machine that can be easily used even in narrow spaces with its compact design.",
              image: "/products/celik-cember-makineleri/scl-2451.jpg",
              order: 2,
              isFeatured: false,
            },
            {
              name: "Kenetlemeli Çelik Çember Makinesi",
              nameEn: "Sealless Steel Strapping Machine",
              slug: "kenetlemeli-makine",
              description: "Tokasız çelik çemberleme sistemi",
              descriptionEn: "Sealless steel strapping system",
              longDescription: "Kenetlemeli çelik çember makinesi, toka kullanmadan çelik çemberleri birleştiren yenilikçi bir sistemdir. Bu sayede malzeme maliyetlerinden tasarruf sağlanır.",
              longDescriptionEn: "Sealless steel strapping machine is an innovative system that joins steel straps without using seals. This saves on material costs.",
              image: "/products/celik-cember-makineleri/kenetlemeli.webp",
              order: 3,
              isFeatured: false,
            },
          ],
        },
        {
          name: "El Tipi Çemberleme Makinesi",
          nameEn: "Manual Strapping Tool",
          slug: "el-tipi-cemberleme",
          description: "Portatif ve kullanımı kolay manuel çemberleme makineleri",
          descriptionEn: "Portable and easy-to-use manual strapping machines",
          image: "/products/el-tipi-cemberleme/el-tipi-1.webp",
          order: 2,
          products: [
            {
              name: "El Tipi PP/PET Çemberleme Aleti",
              nameEn: "Manual PP/PET Strapping Tool",
              slug: "el-tipi-pp-pet",
              description: "PP ve PET çemberler için manuel gergi aleti",
              descriptionEn: "Manual tensioner for PP and PET straps",
              longDescription: "Hafif ve orta ağırlıktaki yükler için ideal el tipi çemberleme aleti. Ergonomik tasarımı ile uzun süreli kullanımda yorgunluk oluşturmaz.",
              longDescriptionEn: "Ideal manual strapping tool for light and medium weight loads. Its ergonomic design does not cause fatigue during long-term use.",
              image: "/products/el-tipi-cemberleme/el-tipi-1.webp",
              order: 1,
              isFeatured: true,
            },
            {
              name: "Profesyonel El Tipi Çemberleme Seti",
              nameEn: "Professional Manual Strapping Set",
              slug: "profesyonel-el-tipi-set",
              description: "Komple el tipi çemberleme seti",
              descriptionEn: "Complete manual strapping set",
              longDescription: "Gergi aleti, kesici ve toka sıkıştırıcı içeren komple profesyonel çemberleme seti.",
              longDescriptionEn: "Complete professional strapping set including tensioner, cutter and seal crimper.",
              image: "/products/el-tipi-cemberleme/el-tipi-2.webp",
              order: 2,
              isFeatured: false,
            },
          ],
        },
        {
          name: "Havalı Çemberleme Makinesi",
          nameEn: "Pneumatic Strapping Machine",
          slug: "havali-cemberleme",
          description: "Pnömatik çemberleme sistemleri ile hızlı ve güçlü bağlama",
          descriptionEn: "Fast and strong binding with pneumatic strapping systems",
          image: "/products/havali-cemberleme/havali-1.webp",
          order: 3,
          products: [
            {
              name: "Pnömatik Çelik Çember Makinesi",
              nameEn: "Pneumatic Steel Strapping Machine",
              slug: "pnomatik-celik-cember",
              description: "Havalı çelik çemberleme makinesi",
              descriptionEn: "Pneumatic steel strapping machine",
              longDescription: "Yüksek hacimli üretim hatları için tasarlanmış pnömatik çelik çember makinesi. Hava basıncı ile çalışarak yüksek gergi kuvveti sağlar.",
              longDescriptionEn: "Pneumatic steel strapping machine designed for high volume production lines. Provides high tension force by working with air pressure.",
              image: "/products/havali-cemberleme/havali-1.webp",
              order: 1,
              isFeatured: true,
            },
          ],
        },
        {
          name: "Masa Tipi Çemberleme Makinesi",
          nameEn: "Semi-Automatic Strapping Machine",
          slug: "masa-tipi-cemberleme",
          description: "Sabit tezgah tipi çemberleme çözümleri",
          descriptionEn: "Fixed table type strapping solutions",
          image: "/products/masa-tipi-cemberleme/masa-tipi-1.jpg",
          order: 4,
          products: [
            {
              name: "Yarı Otomatik Masa Tipi Çemberleme",
              nameEn: "Semi-Automatic Table Strapping Machine",
              slug: "yari-otomatik-masa-tipi",
              description: "Yarı otomatik masa üstü çemberleme makinesi",
              descriptionEn: "Semi-automatic tabletop strapping machine",
              longDescription: "Orta hacimli işletmeler için ideal yarı otomatik çemberleme makinesi. Kolay kullanım ve yüksek verimlilik sağlar.",
              longDescriptionEn: "Ideal semi-automatic strapping machine for medium volume businesses. Provides easy use and high efficiency.",
              image: "/products/masa-tipi-cemberleme/masa-tipi-1.jpg",
              order: 1,
              isFeatured: true,
            },
            {
              name: "Otomatik Masa Tipi Çemberleme",
              nameEn: "Automatic Table Strapping Machine",
              slug: "otomatik-masa-tipi",
              description: "Tam otomatik masa üstü çemberleme makinesi",
              descriptionEn: "Fully automatic tabletop strapping machine",
              longDescription: "Yüksek hacimli üretim için tam otomatik çemberleme makinesi. Operatör müdahalesi minimum düzeyde.",
              longDescriptionEn: "Fully automatic strapping machine for high volume production. Minimum operator intervention.",
              image: "/products/masa-tipi-cemberleme/masa-tipi-2.webp",
              order: 2,
              isFeatured: false,
            },
          ],
        },
        {
          name: "Şarjlı Çemberleme Makinesi",
          nameEn: "Battery Powered Strapping Machine",
          slug: "sarjli-cemberleme",
          description: "Kablosuz, şarjlı çemberleme makineleri ile özgürce çalışın",
          descriptionEn: "Work freely with wireless, battery-powered strapping machines",
          image: "/products/sarjli-cemberleme/sarjli-1.jpg",
          order: 5,
          products: [
            {
              name: "Akülü PET Çemberleme Makinesi",
              nameEn: "Battery PET Strapping Machine",
              slug: "akulu-pet-cemberleme",
              description: "Şarjlı PET çember makinesi",
              descriptionEn: "Battery powered PET strapping machine",
              longDescription: "Kablosuz çalışma özgürlüğü sunan akülü PET çemberleme makinesi. Uzun pil ömrü ve hızlı şarj özelliği.",
              longDescriptionEn: "Battery powered PET strapping machine offering wireless operation freedom. Long battery life and fast charging feature.",
              image: "/products/sarjli-cemberleme/sarjli-1.jpg",
              order: 1,
              isFeatured: true,
            },
            {
              name: "Profesyonel Şarjlı Çemberleme Seti",
              nameEn: "Professional Battery Strapping Set",
              slug: "profesyonel-sarjli-set",
              description: "Komple şarjlı çemberleme seti",
              descriptionEn: "Complete battery strapping set",
              longDescription: "Yedek batarya, şarj ünitesi ve taşıma çantası dahil profesyonel şarjlı çemberleme seti.",
              longDescriptionEn: "Professional battery strapping set including spare battery, charging unit and carrying case.",
              image: "/products/sarjli-cemberleme/sarjli-2.webp",
              order: 2,
              isFeatured: false,
            },
          ],
        },
      ],
    },
    {
      name: "Çemberler",
      nameEn: "Straps",
      slug: "cemberler",
      description: "Her türlü yük için uygun çember çeşitleri",
      descriptionEn: "Strap varieties suitable for all kinds of loads",
      image: "/products/cemberler-cat.webp",
      order: 2,
      subCategories: [
        {
          name: "Çelik Çember",
          nameEn: "Steel Strap",
          slug: "celik-cember",
          description: "Ağır yükler için yüksek dayanımlı çelik çemberler",
          descriptionEn: "High-strength steel straps for heavy loads",
          image: "/products/cemberler/celik-1.jpeg",
          order: 1,
          products: [
            {
              name: "16mm Çelik Çember",
              nameEn: "16mm Steel Strap",
              slug: "16mm-celik-cember",
              description: "16mm genişliğinde standart çelik çember",
              descriptionEn: "16mm width standard steel strap",
              longDescription: "Ağır sanayi uygulamaları için 16mm genişliğinde yüksek kaliteli çelik çember. Yüksek kopma dayanımı ve korozyon direnci.",
              longDescriptionEn: "High quality 16mm width steel strap for heavy industrial applications. High tensile strength and corrosion resistance.",
              image: "/products/cemberler/celik-1.jpeg",
              order: 1,
              isFeatured: true,
            },
            {
              name: "19mm Çelik Çember",
              nameEn: "19mm Steel Strap",
              slug: "19mm-celik-cember",
              description: "19mm genişliğinde ağır hizmet çelik çember",
              descriptionEn: "19mm width heavy duty steel strap",
              longDescription: "Ekstra ağır yükler için 19mm genişliğinde premium kalite çelik çember.",
              longDescriptionEn: "Premium quality 19mm width steel strap for extra heavy loads.",
              image: "/products/cemberler/celik-2.webp",
              order: 2,
              isFeatured: false,
            },
          ],
        },
        {
          name: "PET Çember",
          nameEn: "PET Strap",
          slug: "pet-cember",
          description: "Polyester çember, ağır yükler için güçlü alternatif",
          descriptionEn: "Polyester strap, strong alternative for heavy loads",
          image: "/products/cemberler/pet-1.jpg",
          order: 2,
          products: [
            {
              name: "12mm PET Çember",
              nameEn: "12mm PET Strap",
              slug: "12mm-pet-cember",
              description: "12mm genişliğinde PET çember",
              descriptionEn: "12mm width PET strap",
              longDescription: "Orta ağırlıktaki yükler için ideal 12mm PET çember. Çelik çembere göre daha hafif ve güvenli.",
              longDescriptionEn: "Ideal 12mm PET strap for medium weight loads. Lighter and safer than steel strap.",
              image: "/products/cemberler/pet-1.jpg",
              order: 1,
              isFeatured: true,
            },
            {
              name: "16mm PET Çember",
              nameEn: "16mm PET Strap",
              slug: "16mm-pet-cember",
              description: "16mm genişliğinde yüksek dayanımlı PET çember",
              descriptionEn: "16mm width high strength PET strap",
              longDescription: "Ağır yükler için yüksek dayanımlı 16mm PET çember. Geri dönüştürülebilir ve çevre dostu.",
              longDescriptionEn: "High strength 16mm PET strap for heavy loads. Recyclable and environmentally friendly.",
              image: "/products/cemberler/pet-2.png",
              order: 2,
              isFeatured: false,
            },
            {
              name: "19mm PET Çember Premium",
              nameEn: "19mm PET Strap Premium",
              slug: "19mm-pet-cember-premium",
              description: "19mm premium kalite PET çember",
              descriptionEn: "19mm premium quality PET strap",
              longDescription: "En ağır yükler için tasarlanmış 19mm premium PET çember.",
              longDescriptionEn: "19mm premium PET strap designed for the heaviest loads.",
              image: "/products/cemberler/pet-3.webp",
              order: 3,
              isFeatured: false,
            },
          ],
        },
        {
          name: "PP Çember",
          nameEn: "PP Strap",
          slug: "pp-cember",
          description: "Polipropilen çember, hafif yükler için ekonomik çözüm",
          descriptionEn: "Polypropylene strap, economical solution for light loads",
          image: "/products/cemberler/pp-1.webp",
          order: 3,
          products: [
            {
              name: "12mm PP Çember",
              nameEn: "12mm PP Strap",
              slug: "12mm-pp-cember",
              description: "12mm ekonomik PP çember",
              descriptionEn: "12mm economical PP strap",
              longDescription: "Hafif yükler ve paketleme için ekonomik 12mm PP çember. Geniş renk seçenekleri mevcut.",
              longDescriptionEn: "Economical 12mm PP strap for light loads and packaging. Wide color options available.",
              image: "/products/cemberler/pp-1.webp",
              order: 1,
              isFeatured: true,
            },
          ],
        },
        {
          name: "Kompozit Çember",
          nameEn: "Composite Strap",
          slug: "kompozit-cember",
          description: "Hafif ve dayanıklı kompozit çember çözümleri",
          descriptionEn: "Lightweight and durable composite strap solutions",
          image: "/products/cemberler/kompozit-1.jpg",
          order: 4,
          products: [
            {
              name: "19mm Kompozit Çember",
              nameEn: "19mm Composite Strap",
              slug: "19mm-kompozit-cember",
              description: "19mm yüksek performanslı kompozit çember",
              descriptionEn: "19mm high performance composite strap",
              longDescription: "Polyester lifler ve polimer matris kombinasyonu ile üretilen yüksek performanslı kompozit çember. Çelik çembere alternatif güvenli çözüm.",
              longDescriptionEn: "High performance composite strap produced with polyester fibers and polymer matrix combination. Safe alternative solution to steel strap.",
              image: "/products/cemberler/kompozit-1.jpg",
              order: 1,
              isFeatured: true,
            },
            {
              name: "25mm Kompozit Çember",
              nameEn: "25mm Composite Strap",
              slug: "25mm-kompozit-cember",
              description: "25mm ekstra dayanıklı kompozit çember",
              descriptionEn: "25mm extra durable composite strap",
              longDescription: "En ağır yükler için 25mm genişliğinde kompozit çember.",
              longDescriptionEn: "25mm width composite strap for the heaviest loads.",
              image: "/products/cemberler/kompozit-2.webp",
              order: 2,
              isFeatured: false,
            },
          ],
        },
      ],
    },
    {
      name: "Endüstriyel Yağlar",
      nameEn: "Industrial Oils",
      slug: "endustriyel-yaglar",
      description: "Makine bakım ve yağlama ürünleri ile ekipmanlarınızın ömrünü uzatın",
      descriptionEn: "Extend the life of your equipment with machine maintenance and lubrication products",
      image: "/products/industrial-oils.jpg",
      order: 3,
      subCategories: [
        {
          name: "Endüstriyel Yağlar",
          nameEn: "Industrial Lubricants",
          slug: "genel-yaglar",
          description: "Makine bakımı için profesyonel yağlama ürünleri",
          descriptionEn: "Professional lubrication products for machine maintenance",
          image: "/products/endustriyel-yaglar/krytox-240-aa.jpg",
          order: 1,
          products: [
            {
              name: "Krytox 240 AA Gres Yağı",
              nameEn: "Krytox 240 AA Grease",
              slug: "krytox-240-aa",
              description: "Yüksek performanslı sentetik gres yağı",
              descriptionEn: "High performance synthetic grease",
              longDescription: "Krytox 240 AA, aşırı sıcaklık ve basınç koşullarında mükemmel performans gösteren premium sentetik gres yağıdır.",
              longDescriptionEn: "Krytox 240 AA is a premium synthetic grease that performs excellently in extreme temperature and pressure conditions.",
              image: "/products/endustriyel-yaglar/krytox-240-aa.jpg",
              order: 1,
              isFeatured: true,
            },
            {
              name: "Krytox GPL 226 Gres Yağı",
              nameEn: "Krytox GPL 226 Grease",
              slug: "krytox-gpl-226",
              description: "Genel amaçlı sentetik gres yağı",
              descriptionEn: "General purpose synthetic grease",
              longDescription: "Krytox GPL 226, geniş uygulama alanına sahip çok amaçlı sentetik gres yağıdır.",
              longDescriptionEn: "Krytox GPL 226 is a multi-purpose synthetic grease with a wide range of applications.",
              image: "/products/endustriyel-yaglar/krytox-gpl-226.jpg",
              order: 2,
              isFeatured: false,
            },
            {
              name: "Molykote BR2 Plus Gres Yağı",
              nameEn: "Molykote BR2 Plus Grease",
              slug: "molykote-br2-plus",
              description: "Yüksek yük taşıma kapasiteli gres yağı",
              descriptionEn: "High load bearing capacity grease",
              longDescription: "Molykote BR2 Plus, ağır yük koşullarında üstün performans sağlayan MoS2 katkılı gres yağıdır.",
              longDescriptionEn: "Molykote BR2 Plus is a MoS2 fortified grease that provides superior performance under heavy load conditions.",
              image: "/products/endustriyel-yaglar/molykote-br2.jpg",
              order: 3,
              isFeatured: false,
            },
          ],
        },
      ],
    },
    {
      name: "Pre-Stretch Filmler",
      nameEn: "Pre-Stretch Films",
      slug: "pre-stretch",
      description: "Ön gerdirilmiş streç film çözümleri ile paletleme işlemlerinizde maksimum verimlilik",
      descriptionEn: "Maximum efficiency in palletizing with pre-stretched film solutions",
      image: "/products/stretch-film.jpg",
      order: 4,
      subCategories: [
        {
          name: "Pre-Stretch Filmler",
          nameEn: "Pre-Stretch Films",
          slug: "pre-stretch-filmler",
          description: "Ekonomik ve dayanıklı ön gerdirilmiş streç filmler",
          descriptionEn: "Economical and durable pre-stretched films",
          image: "/products/pre-stretch/pre-stretch-1.jpg",
          order: 1,
          products: [
            {
              name: "8 Mikron Pre-Stretch Film",
              nameEn: "8 Micron Pre-Stretch Film",
              slug: "8-mikron-pre-stretch",
              description: "Ultra ince 8 mikron pre-stretch film",
              descriptionEn: "Ultra thin 8 micron pre-stretch film",
              longDescription: "8 mikron kalınlığında ön gerdirilmiş streç film. Standart filme göre %50 daha az malzeme kullanımı ile aynı koruma.",
              longDescriptionEn: "8 micron thickness pre-stretched film. Same protection with 50% less material usage compared to standard film.",
              image: "/products/pre-stretch/pre-stretch-1.jpg",
              order: 1,
              isFeatured: true,
            },
            {
              name: "10 Mikron Pre-Stretch Film",
              nameEn: "10 Micron Pre-Stretch Film",
              slug: "10-mikron-pre-stretch",
              description: "Standart 10 mikron pre-stretch film",
              descriptionEn: "Standard 10 micron pre-stretch film",
              longDescription: "10 mikron kalınlığında standart pre-stretch film. Genel amaçlı paletleme için ideal.",
              longDescriptionEn: "10 micron thickness standard pre-stretch film. Ideal for general purpose palletizing.",
              image: "/products/pre-stretch/pre-stretch-2.webp",
              order: 2,
              isFeatured: false,
            },
            {
              name: "12 Mikron Pre-Stretch Film Premium",
              nameEn: "12 Micron Pre-Stretch Film Premium",
              slug: "12-mikron-pre-stretch-premium",
              description: "Premium kalite 12 mikron pre-stretch film",
              descriptionEn: "Premium quality 12 micron pre-stretch film",
              longDescription: "Ağır ve keskin kenarlı yükler için 12 mikron premium pre-stretch film.",
              longDescriptionEn: "12 micron premium pre-stretch film for heavy and sharp-edged loads.",
              image: "/products/pre-stretch/pre-stretch-3.png",
              order: 3,
              isFeatured: false,
            },
          ],
        },
      ],
    },
    {
      name: "Tokalar",
      nameEn: "Buckles",
      slug: "tokalar",
      description: "Metal ve plastik çember tokaları ile güvenli ve sağlam bağlantılar",
      descriptionEn: "Secure and strong connections with metal and plastic strap buckles",
      image: "/products/buckles.jpg",
      order: 5,
      subCategories: [
        {
          name: "Çember Tokaları",
          nameEn: "Strap Buckles",
          slug: "cember-tokalari",
          description: "Güvenli bağlantı için kaliteli toka çeşitleri",
          descriptionEn: "Quality buckle varieties for secure connection",
          image: "/products/tokalar/tel-toka.jpeg",
          order: 1,
          products: [
            {
              name: "Tel Toka 16mm",
              nameEn: "Wire Buckle 16mm",
              slug: "tel-toka-16mm",
              description: "16mm PP çember için tel toka",
              descriptionEn: "Wire buckle for 16mm PP strap",
              longDescription: "PP çemberler için galvanizli tel toka. Ekonomik ve güvenilir bağlantı sağlar.",
              longDescriptionEn: "Galvanized wire buckle for PP straps. Provides economical and reliable connection.",
              image: "/products/tokalar/tel-toka.jpeg",
              order: 1,
              isFeatured: true,
            },
          ],
        },
      ],
    },
  ];

  // Create categories, subcategories, and products
  for (const catData of categoriesData) {
    const { subCategories, ...categoryData } = catData;

    const category = await prisma.mainCategory.create({
      data: categoryData,
    });
    console.log(`✅ Category created: ${category.name}`);

    for (const subCatData of subCategories) {
      const { products, ...subCategoryData } = subCatData;

      const subCategory = await prisma.subCategory.create({
        data: {
          ...subCategoryData,
          mainCategoryId: category.id,
        },
      });
      console.log(`  ↳ SubCategory: ${subCategory.name}`);

      if (products && products.length > 0) {
        for (const productData of products) {
          await prisma.product.create({
            data: {
              ...productData,
              subCategoryId: subCategory.id,
            },
          });
        }
        console.log(`    ↳ ${products.length} products added`);
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
