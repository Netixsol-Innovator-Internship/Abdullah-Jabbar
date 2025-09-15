//dashboard/page.tsx
import { Breadcrumb } from "@/components/breadcrumb"

export default function DashboardPage() {
  return (

      <div className="p-6">
        <Breadcrumb items={[{ label: "Dashboard" }]} />
        <div className="bg-white rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Arik Dashboard</h1>
          <p className="text-gray-600">Select a section from the sidebar to get started.</p>
        </div>
      </div>

  )
}
