import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    where: {
      subCategory: {
        slug: 'masa-tipi-cemberleme'
      }
    },
    include: {
      subCategory: true
    },
    orderBy: {
      order: 'asc'
    }
  })

  console.log('\n=== Masa Tipi Çemberleme Makinesi Ürünleri ===\n')
  products.forEach(p => {
    console.log(`- ${p.name}`)
    console.log(`  EN: ${p.nameEn}`)
    console.log(`  Slug: ${p.slug}`)
    console.log(`  Order: ${p.order}`)
    console.log(`  Görsel: ${p.image}`)
    console.log('')
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
