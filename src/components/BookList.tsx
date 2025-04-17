
import { Book } from "@/types/book";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface BookListProps {
  books: Book[];
}

const BookList = ({ books }: BookListProps) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-lg text-gray-500">No books found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <Card key={book.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">{book.title}</CardTitle>
            <CardDescription>by {book.author}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Genre</div>
              <div>{book.genre}</div>
              <div className="text-muted-foreground">Published</div>
              <div>{new Date(book.publishDate).toLocaleDateString()}</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center bg-muted/50 py-2">
            <span className="font-medium">{formatCurrency(book.price)}</span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default BookList;
