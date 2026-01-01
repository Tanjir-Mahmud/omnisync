
import { OverviewCards } from "@/components/dashboard/OverviewCards"
import { StockTrendChart } from "@/components/dashboard/StockTrendChart"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import { getSession, removeSession } from "@/lib/auth-session"

export default async function DashboardPage() {
  const session = await getSession()
  let userName = "User";
  let userId = "";

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    userName = user?.name || "User";
    userId = user?.id || "";
  }

  // Fetch Metrics
  const products = await prisma.product.findMany({
    where: { userId: userId },
    include: { stockLevels: true }
  })

  let totalStock = 0
  let totalValue = 0
  let lowStockCount = 0

  products.forEach((p: any) => {
    const pStock = p.stockLevels.reduce((a: number, b: { quantity: number }) => a + b.quantity, 0)
    totalStock += pStock
    totalValue += pStock * p.price

    if (pStock <= p.minStockLevel) {
      lowStockCount++
    }
  })
  // Fetch Sales Revenue (Last 24h)
  const recentSalesData = await prisma.order.aggregate({
    _sum: {
      totalAmount: true
    },
    where: {
      userId: userId,
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    }
  })

  // Default to 0 if no sales
  const recentSalesAmount = recentSalesData._sum.totalAmount || 0

  // Fetch Transfers and Sales for Chart (Last 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const [transfers, orderItems] = await Promise.all([
    prisma.transfer.findMany({
      where: {
        userId: userId,
        createdAt: { gte: sixMonthsAgo }
      },
      select: { createdAt: true, quantity: true }
    }),
    prisma.orderItem.findMany({
      where: {
        order: {
          userId: userId,
          createdAt: { gte: sixMonthsAgo }
        }
      },
      include: { order: { select: { createdAt: true } } }
    })
  ])

  // Aggregate by Month
  const chartDataMap = new Map<string, number>()
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = months[d.getMonth()]
    chartDataMap.set(key, 0)
  }

  // Add Transfers
  transfers.forEach(t => {
    const key = months[t.createdAt.getMonth()]
    if (chartDataMap.has(key)) {
      chartDataMap.set(key, (chartDataMap.get(key) || 0) + t.quantity)
    }
  })

  // Add Sales
  orderItems.forEach(item => {
    const key = months[item.order.createdAt.getMonth()]
    if (chartDataMap.has(key)) {
      chartDataMap.set(key, (chartDataMap.get(key) || 0) + item.quantity)
    }
  })

  const chartData = Array.from(chartDataMap.entries()).map(([name, total]) => ({ name, total }))


  return (
    <div className="flex-1 space-y-4 p-8 pt-6 text-cyan-50">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-sm">Dashboard</h2>
          <p className="text-cyan-100/60">Welcome back, <span className="text-cyan-300 font-semibold">{userName}</span></p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/inventory">
            <Button className="bg-cyan-600/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-600/40 hover:text-cyan-300">Manage Inventory</Button>
          </Link>
          <a href="/api/reports/download" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-900/20 hover:text-purple-200 bg-transparent">Download Reports</Button>
          </a>
        </div>
      </div>

      <div className="space-y-4">
        {/* Overview Cards */}
        <OverviewCards
          totalStock={totalStock}
          totalValue={totalValue}
          lowStockCount={lowStockCount}
          recentSales={recentSalesAmount}
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <StockTrendChart data={chartData} />

          <div className="col-span-3 rounded-xl border border-cyan-500/20 bg-[#0a0a1f]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(34,211,238,0.05)]">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="font-semibold leading-none tracking-tight text-cyan-100">Recent Activity</h3>
            </div>
            <div className="p-6 pt-0">
              <RecentActivityFeed userId={userId} />
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

async function RecentActivityFeed({ userId }: { userId: string }) {
  const logs = await prisma.auditLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5
  })

  if (logs.length === 0) {
    return <div className="text-center text-cyan-100/30 text-sm py-4">No recent activity</div>
  }

  return (
    <div className="space-y-6">
      {logs.map(log => (
        <div key={log.id} className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-4 shadow-sm ${log.action === 'SALE' ? 'bg-green-500 shadow-green-500/50' :
            log.action === 'TRANSFER' ? 'bg-blue-500 shadow-blue-500/50' :
              'bg-orange-500 shadow-orange-500/50'
            }`} />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-cyan-50 capitalize">{log.action.replace("_", " ").toLowerCase()}</p>
            <p className="text-xs text-cyan-100/50 truncate max-w-[200px]" title={log.details || ""}>{log.details}</p>
          </div>
          <div className="ml-auto text-xs text-cyan-100/30">
            {new Date(log.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )
}
