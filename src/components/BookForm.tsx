
import { useState } from "react";
import { BookFormValues } from "@/types/book";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface BookFormProps {
  onSubmit: (book: BookFormValues) => void;
  onCancel: () => void;
  initialValues?: Partial<BookFormValues>;
}

const BookForm = ({ onSubmit, onCancel, initialValues }: BookFormProps) => {
  const [formValues, setFormValues] = useState<BookFormValues>({
    title: initialValues?.title || "",
    author: initialValues?.author || "",
    genre: initialValues?.genre || "",
    price: initialValues?.price || 0,
    publishDate: initialValues?.publishDate || new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookFormValues, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BookFormValues, string>> = {};
    
    if (!formValues.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formValues.author.trim()) {
      newErrors.author = "Author is required";
    }
    
    if (!formValues.genre) {
      newErrors.genre = "Genre is required";
    }
    
    if (formValues.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    
    if (!formValues.publishDate) {
      newErrors.publishDate = "Publish date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formValues);
    }
  };

  const handleChange = (field: keyof BookFormValues, value: string | number) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formValues.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-red-500 text-xs">{errors.title}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={formValues.author}
            onChange={(e) => handleChange("author", e.target.value)}
            className={errors.author ? "border-red-500" : ""}
          />
          {errors.author && (
            <p className="text-red-500 text-xs">{errors.author}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Select
            value={formValues.genre}
            onValueChange={(value) => handleChange("genre", value)}
          >
            <SelectTrigger className={errors.genre ? "border-red-500" : ""}>
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
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
          {errors.genre && (
            <p className="text-red-500 text-xs">{errors.genre}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formValues.price}
            onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
            className={errors.price ? "border-red-500" : ""}
          />
          {errors.price && (
            <p className="text-red-500 text-xs">{errors.price}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="publishDate">Publish Date</Label>
          <Input
            id="publishDate"
            type="date"
            value={formValues.publishDate.substring(0, 10)}
            onChange={(e) => handleChange("publishDate", e.target.value)}
            className={errors.publishDate ? "border-red-500" : ""}
          />
          {errors.publishDate && (
            <p className="text-red-500 text-xs">{errors.publishDate}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Book
        </Button>
      </div>
    </form>
  );
};

export default BookForm;
