import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Clock } from "lucide-react"

interface PaymentStep {
  date: string
  time: string
  amount: string
  id: string
  status: "completed" | "current" | "pending"
  label: string
}

interface PaymentStepsProps {
  steps: PaymentStep[]
}

export function PaymentSteps({ steps }: PaymentStepsProps) {
  return (
    <Card className="p-6 mt-8">
      <h3 className="text-lg font-semibold mb-6">Steps of Payment (Just update the component)</h3>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="text-sm text-gray-600 w-20">{step.date}</div>
                <div className="text-sm text-gray-600 w-16">{step.time}</div>
                <div className="text-sm font-semibold text-green-600 w-20">{step.amount}</div>
                <div className="text-sm text-gray-600 w-16">{step.id}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">{step.date}</div>
                <div className="text-sm text-gray-600">{step.date}</div>

                {step.status === "completed" ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : step.status === "current" ? (
                  <Clock className="w-6 h-6 text-orange-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}

                <Badge variant={step.status === "completed" ? "default" : "secondary"}>{step.label}</Badge>
              </div>
            </div>

            {index < steps.length - 1 && <div className="absolute left-[400px] top-8 w-px h-6 bg-gray-200"></div>}
          </div>
        ))}

        <div className="text-center mt-8">
          <Badge className="bg-red-500 text-lg px-6 py-2">Bidding has ended</Badge>
        </div>
      </div>
    </Card>
  )
}
