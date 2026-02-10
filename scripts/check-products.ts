import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('\n=== KATEGORILER ===\n')
  const categories = await prisma.mainCategory.findMany({
    include: {
      subCategories: {
        include: {
          products: true
        }
      }
    },
    orderBy: { order: 'asc' }
  })

  for (const cat of categories) {
    console.log(`📁 ${cat.name} (${cat.nameEn})`)
    console.log(`   Slug: ${cat.slug}`)
    console.log(`   Görsel: ${cat.image}`)

    if (cat.subCategories.length > 0) {
      for (const sub of cat.subCategories) {
        console.log(`   └─ ${sub.name} (${sub.nameEn})`)
        console.log(`      Slug: ${sub.slug}`)
        if (sub.image) {
          console.log(`      Görsel: ${sub.image}`)
        }

        if (sub.products.length > 0) {
          for (const prod of sub.products) {
            console.log(`      └─ ${prod.name} (${prod.nameEn})`)
            console.log(`         Slug: ${prod.slug}`)
            console.log(`         Görsel: ${prod.image}`)
          }
        } else {
          console.log(`      └─ Ürün yok`)
        }
      }
    }
    console.log('')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
