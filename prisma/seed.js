const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    try {
        // Clean up existing data
        await prisma.orderItem.deleteMany()
        await prisma.order.deleteMany()
        await prisma.stockLevel.deleteMany()
        await prisma.product.deleteMany()
        await prisma.location.deleteMany()

        console.log('Cleaned old data.')

        // Create Locations
        const warehouse = await prisma.location.create({
            data: {
                name: 'Central Warehouse',
                type: 'WAREHOUSE',
                address: '123 Industrial Park, Logic City',
                latitude: 40.7128,
                longitude: -74.0060,
            }
        })

        const store1 = await prisma.location.create({
            data: {
                name: 'Downtown Flagship',
                type: 'STORE',
                address: '45 Main St, Metroville',
                latitude: 40.730610,
                longitude: -73.935242,
            }
        })

        const store2 = await prisma.location.create({
            data: {
                name: 'Suburban Outlet',
                type: 'STORE',
                address: '88 Mall Rd, Suburbia',
                latitude: 40.7500,
                longitude: -73.9800,
            }
        })

        console.log('Locations created.')

        // Create Products
        const productsData = [
            { sku: 'LAP-001', name: 'UltraSlim Laptop 15"', price: 1200.00, minStock: 10 },
            { sku: 'PHN-X02', name: 'SmartPhone Pro X', price: 999.00, minStock: 20 },
            { sku: 'HDP-500', name: 'NoiseCancelling Headphones', price: 250.00, minStock: 15 },
            { sku: 'MNT-4K', name: '4K Monitor 27"', price: 450.00, minStock: 5 },
            { sku: 'KB-MECH', name: 'Mechanical Keyboard', price: 120.00, minStock: 10 },
        ]

        for (const p of productsData) {
            const product = await prisma.product.create({
                data: {
                    sku: p.sku,
                    name: p.name,
                    price: p.price,
                    minStockLevel: p.minStock,
                    description: `Premium ${p.name}`
                }
            })

            // Assign Stock
            // Warehouse has lots
            await prisma.stockLevel.create({
                data: {
                    productId: product.id,
                    locationId: warehouse.id,
                    quantity: 125, // Fixed value
                }
            })

            // Stores have less
            await prisma.stockLevel.create({
                data: {
                    productId: product.id,
                    locationId: store1.id,
                    quantity: 42, // Fixed value
                }
            })

            await prisma.stockLevel.create({
                data: {
                    productId: product.id,
                    locationId: store2.id,
                    quantity: 18, // Fixed value
                }
            })
        }

        console.log('Products and Stock Levels created.')
    } catch (e) {
        console.error(e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
