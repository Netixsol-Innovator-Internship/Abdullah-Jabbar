import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export function SearchFilters() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto flex justify-between gap-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4">
        
        <div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Audi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="audi">Audi</SelectItem>
              <SelectItem value="bmw">BMW</SelectItem>
              <SelectItem value="mercedes">Mercedes</SelectItem>
              <SelectItem value="toyota">Toyota</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="q3">Q3</SelectItem>
              <SelectItem value="q5">Q5</SelectItem>
              <SelectItem value="a4">A4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-50000">$0 - $50,000</SelectItem>
              <SelectItem value="50000-100000">$50,000 - $100,000</SelectItem>
              <SelectItem value="100000+">$100,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="w-5/12 ">
        <Button className=" w-full bg-[#4A5FBF] hover:bg-[#3A4FAF]">
          <Search className="w-full h-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
}
