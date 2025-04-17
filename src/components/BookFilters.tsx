import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { BookFilterValues } from "@/types/book";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface BookFiltersProps {
  onFilterChange: (queryString: string) => void;
}

const BookFilters = ({ onFilterChange }: BookFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<BookFilterValues>({
    title: "",
    author: "",
    genre: "",
    sortBy: "title",
    sortOrder: "asc"
  });

  // Generate OData query string from filters
  const generateQueryString = () => {
    const queryParts = [];
    
    // Filter conditions
    const filterConditions = [];
    
    if (filters.title) {
      filterConditions.push(`contains(title,'${filters.title}')`);
    }
    
    if (filters.author) {
      filterConditions.push(`contains(author,'${filters.author}')`);
    }
    
    // Only add genre filter if it's not the "all-genres" placeholder
    if (filters.genre && filters.genre !== "all-genres") {
      filterConditions.push(`genre eq '${filters.genre}'`);
    }
    
    if (filters.minPrice !== undefined) {
      filterConditions.push(`price ge ${filters.minPrice}`);
    }
    
    if (filters.maxPrice !== undefined) {
      filterConditions.push(`price le ${filters.maxPrice}`);
    }
    
    if (filterConditions.length > 0) {
      queryParts.push(`$filter=${filterConditions.join(' and ')}`);
    }
    
    // Sorting
    if (filters.sortBy) {
      queryParts.push(`$orderby=${filters.sortBy} ${filters.sortOrder || 'asc'}`);
    }
    
    return queryParts.join('&');
  };

  useEffect(() => {
    const queryString = generateQueryString();
    onFilterChange(queryString);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = (name: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      title: "",
      author: "",
      genre: "",
      sortBy: "title",
      sortOrder: "asc"
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Search & Filter</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          {(filters.title || filters.author || filters.genre || filters.minPrice || filters.maxPrice) && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleClearFilters}
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title" 
            className="pl-9"
            value={filters.title || ""}
            onChange={(e) => handleFilterChange("title", e.target.value)}
          />
        </div>
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by author" 
            className="pl-9"
            value={filters.author || ""}
            onChange={(e) => handleFilterChange("author", e.target.value)}
          />
        </div>
      </div>
      
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Genre</label>
            <Select
              value={filters.genre || "all-genres"}
              onValueChange={(value) => handleFilterChange("genre", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-genres">All Genres</SelectItem>
                <SelectItem value="Fantasy">Fantasy</SelectItem>
                <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                <SelectItem value="Romance">Romance</SelectItem>
                <SelectItem value="Mystery">Mystery</SelectItem>
                <SelectItem value="Thriller">Thriller</SelectItem>
                <SelectItem value="Non-fiction">Non-fiction</SelectItem>
                <SelectItem value="Biography">Biography</SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="Fiction">Fiction</SelectItem>
                <SelectItem value="Classic">Classic</SelectItem>
                <SelectItem value="Dystopian">Dystopian</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Sort By</label>
            <Select
              value={filters.sortBy || "title"}
              onValueChange={(value) => handleFilterChange("sortBy", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="author">Author</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="publishDate">Publish Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Sort Order</label>
            <Select
              value={filters.sortOrder || "asc"}
              onValueChange={(value) => handleFilterChange("sortOrder", value as "asc" | "desc")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Min Price</label>
            <Input
              type="number"
              min="0"
              placeholder="Min Price"
              value={filters.minPrice || ""}
              onChange={(e) => handleFilterChange("minPrice", e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Max Price</label>
            <Input
              type="number"
              min="0"
              placeholder="Max Price"
              value={filters.maxPrice || ""}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookFilters;
