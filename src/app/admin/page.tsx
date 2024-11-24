import { Suspense } from 'react'
import { Bell, ChevronDown, Film, Tv, Users, User, DollarSign } from 'lucide-react'

import TabNavigation from '../../components/tab-navigation'

     

export default async function NetflixAdminDashboard() {
  

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <nav className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black to-transparent">
        <div className="flex items-center">
          
          
        </div>
        <div className="flex items-center space-x-6">
          <Bell className="h-6 w-6 text-gray-300 hover:text-white transition-colors" />
          <div className="flex items-center group hidden">
            <User className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors" />
            <ChevronDown className="h-4 w-4 ml-1 text-gray-300 group-hover:text-white transition-colors" />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
          </div>

          <TabNavigation />
        </Suspense>
      </main>
    </div>
  )
}