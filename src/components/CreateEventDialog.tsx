import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Upload, X } from 'lucide-react';

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: {
    title: string;
    date: string;
    time: string;
    venue: string;
    description: string;
    image?: string;
    category?: string;
  }) => void;
}

export function CreateEventDialog({ open, onOpenChange, onSubmit }: CreateEventDialogProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [category, setCategory] = useState('Academic');
  const [description, setDescription] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !date || !time || !venue.trim() || !description.trim()) {
      return;
    }

    const newEvent = {
      title: title.trim(),
      date,
      time,
      venue: venue.trim(),
      description: description.trim(),
      image: uploadedImage || undefined,
      category
    };

    onSubmit(newEvent);
    
    // Reset form
    setTitle('');
    setDate('');
    setTime('');
    setVenue('');
    setCategory('Academic');
    setDescription('');
    setUploadedImage(null);
    onOpenChange(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
  };

  const handleCancel = () => {
    setTitle('');
    setDate('');
    setTime('');
    setVenue('');
    setCategory('Academic');
    setDescription('');
    setUploadedImage(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#111]">Create New Event</DialogTitle>
          <DialogDescription className="text-[#666]">
            Share your event with the Campus Connect community
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Title */}
          <div>
            <Label htmlFor="event-title" className="text-[#666] mb-1.5 block">
              Event Title *
            </Label>
            <Input
              id="event-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title..."
              className="border-[#e5e7eb] rounded-lg"
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event-date" className="text-[#666] mb-1.5 block">
                Date *
              </Label>
              <Input
                id="event-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-[#e5e7eb] rounded-lg"
                required
              />
            </div>

            <div>
              <Label htmlFor="event-time" className="text-[#666] mb-1.5 block">
                Time *
              </Label>
              <Input
                id="event-time"
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g., 2:00 PM - 5:00 PM"
                className="border-[#e5e7eb] rounded-lg"
                required
              />
            </div>
          </div>

          {/* Venue */}
          <div>
            <Label htmlFor="event-venue" className="text-[#666] mb-1.5 block">
              Venue *
            </Label>
            <Input
              id="event-venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Event location..."
              className="border-[#e5e7eb] rounded-lg"
              required
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="event-category" className="text-[#666] mb-1.5 block">
              Category
            </Label>
            <Input
              id="event-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Academic, Social, Career, Sports"
              className="border-[#e5e7eb] rounded-lg"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="event-description" className="text-[#666] mb-1.5 block">
              Event Description *
            </Label>
            <Textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your event..."
              className="border-[#e5e7eb] rounded-lg min-h-[120px]"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label className="text-[#666] mb-1.5 block">
              Event Photo (Optional)
            </Label>
            
            {!uploadedImage ? (
              <div className="border-2 border-dashed border-[#e5e7eb] rounded-lg p-5 text-center hover:border-[#0b5fff] transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="event-image-upload"
                />
                <label htmlFor="event-image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#eff6ff] flex items-center justify-center">
                      <Upload className="w-5 h-5 text-[#0b5fff]" />
                    </div>
                    <div className="text-sm text-[#666]">
                      Click to upload an image
                    </div>
                    <div className="text-xs text-[#999]">
                      PNG, JPG, GIF up to 10MB
                    </div>
                  </div>
                </label>
              </div>
            ) : (
              <div className="relative border border-[#e5e7eb] rounded-lg overflow-hidden">
                <img 
                  src={uploadedImage} 
                  alt="Upload preview" 
                  className="w-full h-auto max-h-[250px] object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#f9fafb] transition-colors"
                >
                  <X className="w-4 h-4 text-[#666]" />
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-3">
            <Button
              type="button"
              onClick={handleCancel}
              className="bg-white border border-[#e5e7eb] text-[#111] hover:bg-[#f9fafb] px-6 py-2 rounded-lg w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !date || !time || !venue.trim() || !description.trim()}
              className="bg-[#0b5fff] hover:bg-[#0949cc] text-white px-6 py-2 rounded-lg shadow-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}