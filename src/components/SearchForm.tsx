
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Search, CalendarIcon, Users, DollarSign } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

export interface SearchFormProps {
  onSearch?: (searchCriteria: any) => void;
  className?: string;
}

const SearchForm = ({ onSearch, className }: SearchFormProps) => {
  const navigate = useNavigate();
  const [searchCriteria, setSearchCriteria] = useState({
    city: '',
    checkIn: null as Date | null,
    checkOut: null as Date | null,
    guests: 1,
    priceRange: [50, 500] as [number, number]
  });

  const handleChange = (field: string, value: any) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Save search criteria to localStorage for dynamic pricing
    if (field === 'guests') {
      localStorage.setItem('searchGuests', value.toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save all search criteria to localStorage
    localStorage.setItem('searchCriteria', JSON.stringify(searchCriteria));
    
    if (onSearch) {
      onSearch(searchCriteria);
    } else {
      // If no onSearch prop, navigate to hotels page with query params
      navigate(`/hotels?city=${searchCriteria.city}&guests=${searchCriteria.guests}&minPrice=${searchCriteria.priceRange[0]}&maxPrice=${searchCriteria.priceRange[1]}`);
    }
  };

  useEffect(() => {
    // Restore search criteria from localStorage if available
    const savedCriteria = localStorage.getItem('searchCriteria');
    if (savedCriteria) {
      try {
        const parsed = JSON.parse(savedCriteria);
        // Convert date strings back to Date objects
        if (parsed.checkIn) parsed.checkIn = new Date(parsed.checkIn);
        if (parsed.checkOut) parsed.checkOut = new Date(parsed.checkOut);
        setSearchCriteria(parsed);
      } catch (error) {
        console.error("Error parsing saved search criteria:", error);
      }
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-4 w-full", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Destination */}
        <div className="lg:col-span-2">
          <Label htmlFor="city" className="mb-2 block">Destination</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="city"
              placeholder="Where are you going?"
              className="pl-9"
              value={searchCriteria.city}
              onChange={(e) => handleChange('city', e.target.value)}
            />
          </div>
        </div>
        
        {/* Check-in Date */}
        <div>
          <Label className="mb-2 block">Check-in Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {searchCriteria.checkIn ? (
                  format(searchCriteria.checkIn, "PPP")
                ) : (
                  <span>Select date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={searchCriteria.checkIn || undefined}
                onSelect={(date) => handleChange('checkIn', date)}
                initialFocus
                className="p-3 pointer-events-auto"
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Check-out Date */}
        <div>
          <Label className="mb-2 block">Check-out Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {searchCriteria.checkOut ? (
                  format(searchCriteria.checkOut, "PPP")
                ) : (
                  <span>Select date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={searchCriteria.checkOut || undefined}
                onSelect={(date) => handleChange('checkOut', date)}
                initialFocus
                className="p-3 pointer-events-auto"
                disabled={(date) => !searchCriteria.checkIn || date <= searchCriteria.checkIn}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Guests */}
        <div>
          <Label htmlFor="guests" className="mb-2 block">Guests</Label>
          <Select 
            value={searchCriteria.guests.toString()} 
            onValueChange={(value) => handleChange('guests', parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Guests" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Price Range */}
      <div className="py-2">
        <Label className="mb-2 block">Price Range: ${searchCriteria.priceRange[0]} - ${searchCriteria.priceRange[1]}</Label>
        <Slider
          value={searchCriteria.priceRange}
          min={0}
          max={1000}
          step={10}
          className="my-4"
          onValueChange={(value) => handleChange('priceRange', value as [number, number])}
        />
      </div>
      
      {/* Search Button */}
      <Button type="submit" className="bg-hotel-500 hover:bg-hotel-600">
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  );
};

export default SearchForm;
