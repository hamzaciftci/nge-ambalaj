import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('\n=== Tüm Çemberleme Makinesi Ürünlerini Güncelliyorum ===\n')

  // 1. MASA TİPİ: Görselleri swap et
  console.log('1. Masa Tipi Çemberleme - Görselleri değiştiriyorum...')

  const masaTipiSub = await prisma.subCategory.findFirst({
    where: { slug: 'masa-tipi-cemberleme' }
  })

  if (masaTipiSub) {
    // Yarı Otomatik → Görselini masa-tipi-2.webp yap
    const yarimOtomatik = await prisma.product.findFirst({
      where: {
        subCategoryId: masaTipiSub.id,
        slug: 'yari-otomatik-masa-tipi'
      }
    })

    if (yarimOtomatik) {
      await prisma.product.update({
        where: { id: yarimOtomatik.id },
        data: {
          image: '/products/masa-tipi-cemberleme/masa-tipi-2.webp'
        }
      })
      console.log('   ✓ Yarı Otomatik görsel değiştirildi: masa-tipi-2.webp')
    }

    // Otomatik → Görselini masa-tipi-1.jpg yap
    const otomatik = await prisma.product.findFirst({
      where: {
        subCategoryId: masaTipiSub.id,
        slug: 'otomatik-masa-tipi'
      }
    })

    if (otomatik) {
      await prisma.product.update({
        where: { id: otomatik.id },
        data: {
          image: '/products/masa-tipi-cemberleme/masa-tipi-1.jpg'
        }
      })
      console.log('   ✓ Otomatik görsel değiştirildi: masa-tipi-1.jpg')
    }
  }

  // 2. HAVALI: Pnömatik Çelik Çember → Pnömatik Çember Makinesi
  console.log('\n2. Havalı Çemberleme - İsim değiştiriyorum...')

  const havaliSub = await prisma.subCategory.findFirst({
    where: { slug: 'havali-cemberleme' }
  })

  if (havaliSub) {
    const pnomatik = await prisma.product.findFirst({
      where: {
        subCategoryId: havaliSub.id,
        slug: 'pnomatik-celik-cember'
      }
    })

    if (pnomatik) {
      await prisma.product.update({
        where: { id: pnomatik.id },
        data: {
          name: 'Pnömatik Çember Makinesi',
          nameEn: 'Pneumatic Strapping Machine',
          slug: 'pnomatik-cember-makinesi'
        }
      })
      console.log('   ✓ Güncellendi: Pnömatik Çember Makinesi')
    }
  }

  // 3. EL TİPİ: Yeşil olan → Kompozit Çember makinesi
  console.log('\n3. El Tipi Çemberleme - İsim değiştiriyorum...')

  const elTipiSub = await prisma.subCategory.findFirst({
    where: { slug: 'el-tipi-cemberleme' }
  })

  if (elTipiSub) {
    // el-tipi-pp-pet olan ürünü bulalım (yeşil olan muhtemelen bu)
    const elTipiPP = await prisma.product.findFirst({
      where: {
        subCategoryId: elTipiSub.id,
        slug: 'el-tipi-pp-pet'
      }
    })

    if (elTipiPP) {
      await prisma.product.update({
        where: { id: elTipiPP.id },
        data: {
          name: 'Kompozit Çember Makinesi',
          nameEn: 'Composite Strap Machine',
          slug: 'kompozit-cember-makinesi'
        }
      })
      console.log('   ✓ Güncellendi: Kompozit Çember Makinesi')
    }
  }

  // 4. ÇELİK ÇEMBER: A337 Microlock → Fromm A337
  console.log('\n4. Çelik Çember Makineleri - A337 güncelleniyor...')

  const celikSub = await prisma.subCategory.findFirst({
    where: { slug: 'celik-cember-makinesi' }
  })

  if (celikSub) {
    const a337 = await prisma.product.findFirst({
      where: {
        subCategoryId: celikSub.id,
        slug: 'a337-microlock'
      }
    })

    if (a337) {
      await prisma.product.update({
        where: { id: a337.id },
        data: {
          name: 'Fromm A337 Çelik Çember Makinesi',
          nameEn: 'Fromm A337 Steel Strapping Machine',
          slug: 'fromm-a337-celik-cember-makinesi'
        }
      })
      console.log('   ✓ Güncellendi: Fromm A337 Çelik Çember Makinesi')
    }

    // 5. ÇELİK ÇEMBER: SCL-2451 → Signode SCL Manuel Kombine El Aleti
    console.log('\n5. Çelik Çember Makineleri - SCL güncelleniyor...')

    const scl = await prisma.product.findFirst({
      where: {
        subCategoryId: celikSub.id,
        slug: 'scl-2451'
      }
    })

    if (scl) {
      await prisma.product.update({
        where: { id: scl.id },
        data: {
          name: 'Signode SCL Manuel Kombine El Aleti',
          nameEn: 'Signode SCL Manual Combination Tool',
          slug: 'signode-scl-manuel-kombine-el-aleti',
          description: 'Signode SCL manuel kombine el aleti ile çelik çemberleme işlemlerinizi kolayca gerçekleştirin.',
          descriptionEn: 'Perform your steel strapping operations easily with Signode SCL manual combination tool.',
          longDescription: `Tokasız Signode SCL, düz paketler için uygun, kolay, hafif ve hızlı bir manuel kombinasyon aletidir. Hızlı ve kolay çember takmanın yanı sıra zahmetsiz germe ve tokalama sağlar.
SCL, 13 ila 19 mm çelik çemberlerle kullanılabilir ve ürünlerinizin güvenli bir şekilde depolanmasını ve taşınmasını sağlar.

Ürün avantajları
 Hafif olması sebebi ile kolay ve güvenli kullanım sağlamaktadır
 Basit kullanım ve kolay çember genişliği değişiklikleri sayesinde yüksek verimlilik sağlamaktadır.
 Kompakt taban plakası, paket üzerindeki gerilimi en üst düzeye çıkartmaktadır`,
          longDescriptionEn: `The sealless Signode SCL is a suitable, easy, lightweight and fast manual combination tool for flat packages. It provides effortless tensioning and sealing as well as quick and easy strap installation.
SCL can be used with 13 to 19 mm steel straps and ensures safe storage and transportation of your products.

Product advantages
 Easy and safe use due to its lightness
 High efficiency thanks to simple use and easy strap width changes
 Compact base plate maximizes tension on the package`
        }
      })
      console.log('   ✓ Güncellendi: Signode SCL Manuel Kombine El Aleti (uzun açıklama ile)')
    }
  }

  console.log('\n✅ Tüm güncellemeler başarıyla tamamlandı!\n')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
