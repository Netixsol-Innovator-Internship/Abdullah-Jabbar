"use client"

import { useJobStore } from "@/store/job-store"
import { JobCard } from "@/components/job-card"
import { FilterBar } from "@/components/filter-bar"

export default function HomePage() {
  const filteredJobs = useJobStore((state) => state.filteredJobs)

  return (
    <div className="bg-[hsl(180,52%,96%)] pb-4 max-w-360 mx-auto ">
  {/* Header Background */}
  <div className="h-38 bg-[hsl(180,29%,50%)] relative overflow-hidden">

  {/* Desktop Image */}
  <div className="hidden md:block absolute inset-0 bg-[url('/bg-header-desktop.svg')] bg-cover bg-center"></div>

  {/* Mobile Image */}
  <div className="block md:hidden absolute inset-0 bg-[url('/bg-header-mobile.svg')] bg-cover bg-center"></div>


  </div>

  {/* Main Content */}
  <div className="container mx-auto  -mt-8 relative z-10 px-4 sm:px-6 md:px-14 lg:px-20 xl:px-24">
    <FilterBar />

    <div className="space-y-6">
      {filteredJobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>

    {filteredJobs.length === 0 && (
      <div className="bg-[hsl(180,52%,96%)] rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-[15px] font-semibold text-[hsl(180,14%,20%)] mb-2">
          No jobs found
        </h2>
        <p className="text-[15px] text-[hsl(180,8%,52%)]">
          Try adjusting your filters to see more results.
        </p>
      </div>
    )}
  </div>
</div>

  )
}
