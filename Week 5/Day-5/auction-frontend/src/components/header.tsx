import { Mail, Phone } from "lucide-react"

export function Header() {
  return (
    <div className="bg-[#4A5FBF] text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span>Call Us</span>
          <span className="font-medium">570-694-4002</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <span>Email Id : info@cardeposit.com</span>
        </div>
      </div>
    </div>
  )
}
