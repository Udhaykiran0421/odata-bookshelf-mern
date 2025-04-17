
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Book, BookFormValues } from "@/types/book";
import BookList from "@/components/BookList";
import BookFilters from "@/components/BookFilters";
import BookForm from "@/components/BookForm";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock book data
let MOCK_BOOKS: Book[] = [
  { id: "1", title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", price: 12.99, publishDate: "1937-09-21" },
  { id: "2", title: "1984", author: "George Orwell", genre: "Dystopian", price: 10.99, publishDate: "1949-06-08" },
  { id: "3", title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", price: 9.99, publishDate: "1960-07-11" },
  { id: "4", title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic", price: 11.99, publishDate: "1925-04-10" },
  { id: "5", title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", price: 8.99, publishDate: "1813-01-28" },
];

// Mock API URL - to be replaced with actual API when backend is connected
const API_URL = "https://mockapi.example.com/odata/Books";

const fetchBooks = async (queryString: string = ""): Promise<Book[]> => {
  // This is a mock implementation that simulates OData filtering behavior
  console.log(`Fetching books with query: ${queryString}`);
  
  let filteredBooks = [...MOCK_BOOKS];
  
  // Parse the query string to extract filter and sort parameters
  if (queryString) {
    const params = queryString.split('&');
    
    // Process filters
    const filterParam = params.find(p => p.startsWith('$filter='));
    if (filterParam) {
      const filterValue = decodeURIComponent(filterParam.substring('$filter='.length));
      
      // Process each filter condition
      const conditions = filterValue.split(' and ');
      conditions.forEach(condition => {
        // Title filter
        if (condition.includes('contains(title,')) {
          const titleValue = condition.match(/contains\(title,'(.+?)'\)/)?.[1] || '';
          if (titleValue) {
            filteredBooks = filteredBooks.filter(book => 
              book.title.toLowerCase().includes(titleValue.toLowerCase())
            );
          }
        }
        
        // Author filter
        if (condition.includes('contains(author,')) {
          const authorValue = condition.match(/contains\(author,'(.+?)'\)/)?.[1] || '';
          if (authorValue) {
            filteredBooks = filteredBooks.filter(book => 
              book.author.toLowerCase().includes(authorValue.toLowerCase())
            );
          }
        }
        
        // Genre filter
        if (condition.includes('genre eq')) {
          const genreValue = condition.match(/genre eq '(.+?)'/)?.[1] || '';
          if (genreValue) {
            filteredBooks = filteredBooks.filter(book => book.genre === genreValue);
          }
        }
        
        // Price range filters
        if (condition.includes('price ge')) {
          const minPrice = parseFloat(condition.match(/price ge (\d+\.?\d*)/)?.[1] || '0');
          filteredBooks = filteredBooks.filter(book => book.price >= minPrice);
        }
        
        if (condition.includes('price le')) {
          const maxPrice = parseFloat(condition.match(/price le (\d+\.?\d*)/)?.[1] || '99999');
          filteredBooks = filteredBooks.filter(book => book.price <= maxPrice);
        }
      });
    }
    
    // Process sorting
    const orderByParam = params.find(p => p.startsWith('$orderby='));
    if (orderByParam) {
      const orderByValue = orderByParam.substring('$orderby='.length);
      const [field, direction] = orderByValue.split(' ');
      
      filteredBooks.sort((a, b) => {
        let aValue: any = a[field as keyof Book];
        let bValue: any = b[field as keyof Book];
        
        // Convert string values to lowercase for case-insensitive comparison
        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();
        
        if (direction === 'desc') {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      });
    }
  }
  
  return filteredBooks;
};

const addBook = async (book: BookFormValues): Promise<Book> => {
  // Create a new book with an ID
  const newBook = {
    id: Math.random().toString(36).substr(2, 9),
    ...book
  };
  
  // Add the new book to the mock books array
  MOCK_BOOKS = [...MOCK_BOOKS, newBook];
  
  console.log("Adding book:", newBook);
  console.log("Updated books list:", MOCK_BOOKS);
  
  return newBook;
};

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [queryString, setQueryString] = useState("");

  const { data: books = [], isLoading, error, refetch } = useQuery({
    queryKey: ["books", queryString],
    queryFn: () => fetchBooks(queryString),
  });

  const handleFilterChange = (newQueryString: string) => {
    setQueryString(newQueryString);
  };

  const handleAddBook = async (bookData: BookFormValues) => {
    try {
      await addBook(bookData);
      toast({
        title: "Book added successfully",
        description: `"${bookData.title}" has been added to your collection.`,
      });
      setShowForm(false);
      refetch();
    } catch (error) {
      toast({
        title: "Error adding book",
        description: "There was a problem adding your book. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding book:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">BookStore</h1>
        <p className="text-gray-600 mb-4">Browse and manage your book collection with OData queries</p>
        
        <div className="flex justify-between items-center">
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            {showForm ? "Cancel" : "Add New Book"}
          </Button>
        </div>
      </header>

      {showForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
          <BookForm onSubmit={handleAddBook} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="mb-6">
        <BookFilters onFilterChange={handleFilterChange} />
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-lg">Loading books...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p className="text-lg">Error loading books. Please try again later.</p>
        </div>
      ) : (
        <BookList books={books} />
      )}
    </div>
  );
};

export default Index;
