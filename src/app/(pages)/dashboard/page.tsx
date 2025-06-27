import type React from "react"
import AdminLayout from "@/app/components/adminCommon/adminLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Bed, Users, Calendar, Star } from "lucide-react"

const DashboardPage: React.FC = () => {
  const stats = [
    { title: "Total Rooms", value: "124", icon: Bed, color: "text-blue-600" },
    { title: "Active Bookings", value: "89", icon: Calendar, color: "text-green-600" },
    { title: "Total Users", value: "1,234", icon: Users, color: "text-purple-600" },
    { title: "Average Rating", value: "4.8", icon: Star, color: "text-yellow-600" },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
          <p className="text-gray-600">Welcome back! Here's what's happening with your hotel.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

export default DashboardPage
