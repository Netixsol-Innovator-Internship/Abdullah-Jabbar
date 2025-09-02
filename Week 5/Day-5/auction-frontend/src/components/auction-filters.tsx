import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export function AuctionFilters() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Filter By</h3>
        <Button variant="outline" size="sm">
          Clear All
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Any Car Type</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select car type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="hatchback">Hatchback</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Any Color</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="black">Black</SelectItem>
              <SelectItem value="red">Red</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Any Makes</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="audi">Audi</SelectItem>
              <SelectItem value="bmw">BMW</SelectItem>
              <SelectItem value="mercedes">Mercedes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Any Car Model</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="q3">Q3</SelectItem>
              <SelectItem value="q5">Q5</SelectItem>
              <SelectItem value="a4">A4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Any Style</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sport">Sport</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="classic">Classic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-4">Price Range</label>
          <Slider defaultValue={[50000]} max={100000} step={1000} className="mb-2" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>$30,000</span>
            <span>$80,000</span>
          </div>
        </div>

        <Button className="w-full bg-[#4A5FBF] hover:bg-[#3A4FAF]">Filter</Button>
      </div>
    </Card>
  )
}
