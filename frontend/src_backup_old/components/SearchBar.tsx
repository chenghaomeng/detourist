import { Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

export function SearchBar() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="relative flex items-center bg-white rounded-lg shadow-md border border-gray-200 h-12 min-w-[400px] max-w-[600px]">
      <Search className="ml-4 h-5 w-5 text-gray-400" />
      <Input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search Google Maps"
        className="flex-1 border-0 bg-transparent px-3 py-2 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      {searchValue && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSearchValue("")}
          className="mr-2 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}