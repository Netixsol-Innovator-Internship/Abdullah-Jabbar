"use client"

import { useJobStore } from "@/store/job-store"
import { X } from "lucide-react"

export function FilterBar() {
  const { filters, removeFilter, clearFilters } = useJobStore()

  // Combine all filters into a single array for rendering
  const activeFilters = [
    ...filters.languages,
    ...filters.tools,
    ...(filters.role ? [filters.role] : []),
    ...(filters.level ? [filters.level] : []),
  ]


  if (activeFilters.length === 0) return null

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter, index) => (
          <div
            key={`${filter}-${index}`}
            className="bg-teal-50 text-teal-600 px-3 py-1 rounded flex items-center gap-2 text-sm font-medium"
          >
            <span>{filter}</span>
            <button
              onClick={() => removeFilter(filter)}
              className="hover:bg-teal-500 hover:text-white p-1 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      <button onClick={clearFilters} className="cursor-pointer text-teal-600 hover:text-teal-800 font-medium text-sm hover:underline mr-3">
        Clear
      </button>
    </div>
  )
}
