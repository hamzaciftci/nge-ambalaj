import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('\n=== Ürün Çevirilerini Güncelliyorum ===\n')

  // Tüm ürünleri al
  const products = await prisma.product.findMany({
    include: {
      subCategory: {
        include: {
          mainCategory: true
        }
      }
    }
  })

  // Çeviri mapping
  const translations: Record<string, { nameEn: string; descriptionEn: string; longDescriptionEn?: string }> = {
    // Pre-Stretch Filmler
    '8-micron-el-tipi-pre-stretch': {
      nameEn: '8 Micron Manual Pre-Stretch Film',
      descriptionEn: 'High quality 8 micron manual pre-stretch film for efficient packaging operations.'
    },
    '9-micron-el-tipi-pre-stretch': {
      nameEn: '9 Micron Manual Pre-Stretch Film',
      descriptionEn: 'Professional 9 micron manual pre-stretch film for optimal load protection.'
    },
    '9-micron-makine-tipi-pre-stretch': {
      nameEn: '9 Micron Machine Pre-Stretch Film',
      descriptionEn: 'Industrial 9 micron machine pre-stretch film for automated packaging lines.'
    },

    // Çelik Çember Makineleri
    'fromm-a337-celik-cember-makinesi': {
      nameEn: 'Fromm A337 Steel Strapping Machine',
      descriptionEn: 'High performance Fromm A337 steel strapping machine for industrial applications.'
    },
    'signode-scl-manuel-kombine-el-aleti': {
      nameEn: 'Signode SCL Manual Combination Tool',
      descriptionEn: 'Signode SCL manual combination tool for easy steel strapping operations.',
      longDescriptionEn: `The sealless Signode SCL is a suitable, easy, lightweight and fast manual combination tool for flat packages. It provides effortless tensioning and sealing as well as quick and easy strap installation.
SCL can be used with 13 to 19 mm steel straps and ensures safe storage and transportation of your products.

Product advantages:
- Easy and safe use due to its lightweight design
- High efficiency thanks to simple use and easy strap width changes
- Compact base plate maximizes tension on the package`
    },
    'kenetlemeli-makine': {
      nameEn: 'Sealless Steel Strapping Machine',
      descriptionEn: 'Professional sealless steel strapping machine for secure packaging.'
    },

    // Havalı Çemberleme
    'pnomatik-cember-makinesi': {
      nameEn: 'Pneumatic Strapping Machine',
      descriptionEn: 'High efficiency pneumatic strapping machine for industrial packaging needs.'
    },

    // El Tipi Çemberleme
    'kompozit-cember-makinesi': {
      nameEn: 'Composite Strap Machine',
      descriptionEn: 'Manual composite strap machine for efficient strapping operations.'
    },
    'profesyonel-el-tipi-set': {
      nameEn: 'Professional Manual Strapping Set',
      descriptionEn: 'Complete professional manual strapping set with all necessary accessories.'
    },

    // Masa Tipi Çemberleme
    'yari-otomatik-masa-tipi': {
      nameEn: 'Semi-Automatic Table Strapping Machine',
      descriptionEn: 'Efficient semi-automatic table strapping machine for moderate volume packaging.'
    },
    'otomatik-masa-tipi': {
      nameEn: 'Automatic Table Strapping Machine',
      descriptionEn: 'High-speed automatic table strapping machine for high volume operations.'
    },

    // Şarjlı Çemberleme
    'akulu-pet-cemberleme': {
      nameEn: 'Battery PET Strapping Machine',
      descriptionEn: 'Cordless battery-powered PET strapping machine for flexible operations.'
    },
    'profesyonel-sarjli-set': {
      nameEn: 'Professional Battery Strapping Set',
      descriptionEn: 'Complete professional battery-powered strapping set with charger and accessories.'
    },

    // Çemberler
    '16mm-celik-cember': {
      nameEn: '16mm Steel Strap',
      descriptionEn: 'High tensile 16mm steel strap for heavy-duty packaging applications.'
    },
    '19mm-celik-cember': {
      nameEn: '19mm Steel Strap',
      descriptionEn: 'Premium 19mm steel strap for maximum strength packaging.'
    },
    '12mm-pet-cember': {
      nameEn: '12mm PET Strap',
      descriptionEn: 'Lightweight and durable 12mm PET strap for various packaging needs.'
    },
    '16mm-pet-cember': {
      nameEn: '16mm PET Strap',
      descriptionEn: 'High quality 16mm PET strap for secure packaging solutions.'
    },
    '19mm-pet-cember-premium': {
      nameEn: '19mm PET Strap Premium',
      descriptionEn: 'Premium grade 19mm PET strap for demanding applications.'
    },
    '12mm-pp-cember': {
      nameEn: '12mm PP Strap',
      descriptionEn: 'Cost-effective 12mm PP strap for light to medium duty packaging.'
    },
    '19mm-kompozit-cember': {
      nameEn: '19mm Composite Strap',
      descriptionEn: 'High performance 19mm composite strap combining strength and flexibility.'
    },
    '25mm-kompozit-cember': {
      nameEn: '25mm Composite Strap',
      descriptionEn: 'Heavy duty 25mm composite strap for maximum load security.'
    },

    // Endüstriyel Yağlar
    'krytox-240-aa': {
      nameEn: 'Krytox 240 AA Grease',
      descriptionEn: 'High performance Krytox 240 AA grease for industrial lubrication.'
    },
    'krytox-gpl-226': {
      nameEn: 'Krytox GPL 226 Grease',
      descriptionEn: 'Premium Krytox GPL 226 grease for demanding applications.'
    },
    'molykote-br2-plus': {
      nameEn: 'Molykote BR2 Plus Grease',
      descriptionEn: 'Multipurpose Molykote BR2 Plus grease for general industrial use.'
    },

    // Tokalar
    'tel-toka-16mm': {
      nameEn: 'Wire Buckle 16mm',
      descriptionEn: 'Durable 16mm wire buckle for secure strap fastening.'
    }
  }

  let updatedCount = 0

  for (const product of products) {
    const translation = translations[product.slug]
    if (translation) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          nameEn: translation.nameEn,
          descriptionEn: translation.descriptionEn,
          longDescriptionEn: translation.longDescriptionEn || product.longDescriptionEn
        }
      })
      console.log(`✓ ${product.name} → ${translation.nameEn}`)
      updatedCount++
    } else {
      // Eğer çeviri yoksa, mevcut nameEn kontrol et
      if (!product.nameEn || product.nameEn === product.name) {
        console.log(`⚠ Çeviri eksik: ${product.name} (slug: ${product.slug})`)
      }
    }
  }

  // Kategorileri de güncelle
  console.log('\n=== Kategori Çevirilerini Güncelliyorum ===\n')

  const categoryTranslations: Record<string, { nameEn: string; descriptionEn: string }> = {
    'cemberleme-makineleri': {
      nameEn: 'Strapping Machines',
      descriptionEn: 'Professional strapping machines for industrial packaging needs.'
    },
    'cemberler': {
      nameEn: 'Straps',
      descriptionEn: 'High quality straps for secure packaging solutions.'
    },
    'endustriyel-yaglar': {
      nameEn: 'Industrial Oils',
      descriptionEn: 'Premium industrial lubricants and greases for machinery maintenance.'
    },
    'pre-stretch': {
      nameEn: 'Pre-Stretch Films',
      descriptionEn: 'Advanced pre-stretch films for efficient packaging operations.'
    },
    'tokalar': {
      nameEn: 'Buckles',
      descriptionEn: 'Durable buckles for secure strap fastening.'
    }
  }

  const mainCategories = await prisma.mainCategory.findMany()
  for (const cat of mainCategories) {
    const translation = categoryTranslations[cat.slug]
    if (translation) {
      await prisma.mainCategory.update({
        where: { id: cat.id },
        data: {
          nameEn: translation.nameEn,
          descriptionEn: translation.descriptionEn
        }
      })
      console.log(`✓ ${cat.name} → ${translation.nameEn}`)
    }
  }

  // Alt kategorileri güncelle
  console.log('\n=== Alt Kategori Çevirilerini Güncelliyorum ===\n')

  const subCategoryTranslations: Record<string, { nameEn: string; descriptionEn: string }> = {
    'celik-cember-makinesi': {
      nameEn: 'Steel Strapping Machine',
      descriptionEn: 'Professional steel strapping machines for heavy-duty applications.'
    },
    'el-tipi-cemberleme': {
      nameEn: 'Manual Strapping Tool',
      descriptionEn: 'Portable manual strapping tools for flexible operations.'
    },
    'havali-cemberleme': {
      nameEn: 'Pneumatic Strapping Machine',
      descriptionEn: 'High-speed pneumatic strapping machines for industrial use.'
    },
    'masa-tipi-cemberleme': {
      nameEn: 'Table Strapping Machine',
      descriptionEn: 'Semi-automatic and automatic table strapping machines.'
    },
    'sarjli-cemberleme': {
      nameEn: 'Battery Strapping Machine',
      descriptionEn: 'Cordless battery-powered strapping machines for mobility.'
    },
    'celik-cember': {
      nameEn: 'Steel Strap',
      descriptionEn: 'High tensile steel straps for heavy-duty packaging.'
    },
    'pet-cember': {
      nameEn: 'PET Strap',
      descriptionEn: 'Lightweight and durable PET straps for various applications.'
    },
    'pp-cember': {
      nameEn: 'PP Strap',
      descriptionEn: 'Cost-effective PP straps for light to medium duty packaging.'
    },
    'kompozit-cember': {
      nameEn: 'Composite Strap',
      descriptionEn: 'High performance composite straps combining strength and flexibility.'
    },
    'genel-yaglar': {
      nameEn: 'Industrial Lubricants',
      descriptionEn: 'Premium lubricants and greases for industrial machinery.'
    },
    'pre-stretch-filmler': {
      nameEn: 'Pre-Stretch Films',
      descriptionEn: 'Advanced pre-stretch films for efficient load protection.'
    },
    'cember-tokalari': {
      nameEn: 'Strap Buckles',
      descriptionEn: 'Durable buckles for secure strap fastening.'
    }
  }

  const subCategories = await prisma.subCategory.findMany()
  for (const sub of subCategories) {
    const translation = subCategoryTranslations[sub.slug]
    if (translation) {
      await prisma.subCategory.update({
        where: { id: sub.id },
        data: {
          nameEn: translation.nameEn,
          descriptionEn: translation.descriptionEn
        }
      })
      console.log(`✓ ${sub.name} → ${translation.nameEn}`)
    }
  }

  console.log(`\n✅ Toplam ${updatedCount} ürün çevirisi güncellendi!\n`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
