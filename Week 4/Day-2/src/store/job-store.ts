// job-store.ts

import { create } from "zustand"
import type { Job, JobFilters } from "@/types/job"
import jobsData from "@/data/jobs.json"

interface JobStore {
  jobs: Job[]
  filteredJobs: Job[]
  filters: JobFilters
  addFilter: (filter: string) => void
  removeFilter: (filter: string) => void
  clearFilters: () => void
  applyFilters: () => void
}

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: jobsData as Job[],
  filteredJobs: jobsData as Job[],
  filters: {
    languages: [],
    tools: [],
    role: "",   // single value
    level: "",  // single value
  },

  addFilter: (filter: string) => {
    const { filters } = get()
    const newFilters = { ...filters }

    const allLanguages = [...new Set(jobsData.flatMap((job) => job.languages))]
    const allTools = [...new Set(jobsData.flatMap((job) => job.tools))]
    const allRoles = [...new Set(jobsData.map((job) => job.role))]
    const allLevels = [...new Set(jobsData.map((job) => job.level))]

    if (allLanguages.includes(filter) && !newFilters.languages.includes(filter)) {
      newFilters.languages = [...newFilters.languages, filter]
    } else if (allTools.includes(filter) && !newFilters.tools.includes(filter)) {
      newFilters.tools = [...newFilters.tools, filter]
    } else if (allRoles.includes(filter)) {
      newFilters.role = filter
    } else if (allLevels.includes(filter)) {
      newFilters.level = filter
    }

    set({ filters: newFilters })
    get().applyFilters()
  },

  removeFilter: (filter: string) => {
    const { filters } = get()
    const newFilters = {
      ...filters,
      languages: filters.languages.filter((lang) => lang !== filter),
      tools: filters.tools.filter((tool) => tool !== filter),
      role: filters.role === filter ? "" : filters.role,
      level: filters.level === filter ? "" : filters.level,
    }

    set({ filters: newFilters })
    get().applyFilters()
  },

  clearFilters: () => {
    set({
      filters: { languages: [], tools: [], role: "", level: "" },
      filteredJobs: jobsData as Job[],
    })
  },

  applyFilters: () => {
    const { jobs, filters } = get()

    if (
      filters.languages.length === 0 &&
      filters.tools.length === 0 &&
      !filters.role &&
      !filters.level
    ) {
      set({ filteredJobs: jobs })
      return
    }

    const filtered = jobs.filter((job) => {
      const hasLanguage =
        filters.languages.length === 0 || filters.languages.some((lang) => job.languages.includes(lang))
      const hasTool = filters.tools.length === 0 || filters.tools.some((tool) => job.tools.includes(tool))
      const hasRole = !filters.role || job.role === filters.role
      const hasLevel = !filters.level || job.level === filters.level

      return hasLanguage && hasTool && hasRole && hasLevel
    })

    set({ filteredJobs: filtered })
  },
}))
