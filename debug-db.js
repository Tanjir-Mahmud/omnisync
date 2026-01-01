const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const stockLevels = await prisma.stockLevel.findMany({
        include: { product: true, location: true }
    })
    console.log('Total Stock Levels:', stockLevels.length)
    stockLevels.forEach(s => {
        console.log(`${s.product.name} @ ${s.location.name}: ${s.quantity}`)
    })

    const products = await prisma.product.findMany()
    console.log('Total Products:', products.length)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
