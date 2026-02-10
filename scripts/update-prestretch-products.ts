import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('\n=== Pre-Stretch Film Ürünlerini Güncelliyorum ===\n')

  // Önce alt kategoriyi bulalım
  const subCategory = await prisma.subCategory.findFirst({
    where: { slug: 'pre-stretch-filmler' }
  })

  if (!subCategory) {
    throw new Error('Pre-Stretch Filmler alt kategorisi bulunamadı!')
  }

  // 1. 8 Mikron -> 8 Micron el tipi
  const product1 = await prisma.product.findFirst({
    where: {
      subCategoryId: subCategory.id,
      slug: '8-mikron-pre-stretch'
    }
  })

  if (product1) {
    await prisma.product.update({
      where: { id: product1.id },
      data: {
        name: '8 Micron el tipi Pre-Stretch Film',
        nameEn: '8 Micron Manual Pre-Stretch Film',
        slug: '8-micron-el-tipi-pre-stretch'
      }
    })
    console.log('✓ Güncellendi: 8 Micron el tipi Pre-Stretch Film')
  }

  // 2. 10 Mikron -> 9 micron el tipi
  const product2 = await prisma.product.findFirst({
    where: {
      subCategoryId: subCategory.id,
      slug: '10-mikron-pre-stretch'
    }
  })

  if (product2) {
    await prisma.product.update({
      where: { id: product2.id },
      data: {
        name: '9 micron el tipi Pre-Stretch Film',
        nameEn: '9 Micron Manual Pre-Stretch Film',
        slug: '9-micron-el-tipi-pre-stretch'
      }
    })
    console.log('✓ Güncellendi: 9 micron el tipi Pre-Stretch Film')
  }

  // 3. 12 Mikron -> 9 micron makine tipi
  const product3 = await prisma.product.findFirst({
    where: {
      subCategoryId: subCategory.id,
      slug: '12-mikron-pre-stretch-premium'
    }
  })

  if (product3) {
    await prisma.product.update({
      where: { id: product3.id },
      data: {
        name: '9 micron makine tipi Pre-Stretch Film',
        nameEn: '9 Micron Machine Pre-Stretch Film',
        slug: '9-micron-makine-tipi-pre-stretch'
      }
    })
    console.log('✓ Güncellendi: 9 micron makine tipi Pre-Stretch Film')
  }

  console.log('\n✅ Tüm Pre-Stretch Film ürünleri başarıyla güncellendi!\n')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
