
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Attempting to query products...')
        const products = await prisma.product.findMany()
        console.log(`Success! Found ${products.length} products.`)
        console.log('Database schema is correct.')
    } catch (e) {
        console.error('Error querying products:', e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
