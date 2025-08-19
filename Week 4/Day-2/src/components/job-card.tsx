// job-card.ts

"use client"

import type { Job } from "@/types/job"
import { useJobStore } from "@/store/job-store"


interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const addFilter = useJobStore((state) => state.addFilter)

  const allTags = [...job.languages, ...job.tools, job.role, job.level]

  return (
    <div
      className={"bg-white rounded-lg shadow-lg p-6 mb-10 sm:mb-6 relative hover:border-l-4 border-teal-500 hover:scale-102 transition-all ease-in-out duration-200"}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4 ">
        {/* Company Logo */}
        <div className="flex-shrink-0 absolute -top-6 sm:relative sm:top-0 ">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm md:text-lg border-4 border-white sm:border-none">
            <img
      src={job.logo.replace("./images/", "/images/")}
      alt={`${job.company} logo`}
      className="w-full h-full object-contain  rounded-full"
    />

          </div>
        </div>

        {/* Job Details */}
        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-2 mb-2 mt-4 sm:mt-0">
            <h3 className="text-teal-600 font-semibold text-sm md:text-base">{job.company}</h3>
            
  {job.new && (
    <h3 className="text-white rounded-full bg-teal-600 font-semibold text-sm  px-2 py-0.5">
      NEW!
    </h3>
  )}

  {job.featured && (
    <h3 className="text-white rounded-full bg-black font-semibold text-sm  px-2 py-0.5">
      FEATURED
    </h3>
  )}
</div>

          <h2 className="text-gray-800 font-bold text-lg md:text-xl mb-2 hover:text-teal-600 cursor-pointer">
            {job.position}
          </h2>

          <div className="flex flex-wrap items-center gap-2 text-gray-500 font-bold text-sm ">
            <span>{job.postedAt}</span>
            <span>•</span>
            <span>{job.contract}</span>
            <span>•</span>
            <span>{job.location}</span>
          </div>
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2 md:ml-auto">
          {allTags.map((tag, index) => (
            <button
              key={`${tag}-${index}`}
              onClick={() => addFilter(tag)}
              className="bg-teal-50 text-teal-600 px-3 py-1 rounded text-sm font-medium hover:bg-teal-500 hover:text-white transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
