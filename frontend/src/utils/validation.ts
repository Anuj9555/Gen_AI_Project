import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const tripFormSchema = z.object({
  title: z.string().min(2, 'Trip title must be at least 2 characters').max(100),
  destination: z.string().min(2, 'Please enter a destination city/country'),
  start_date: z.string().min(1, 'Please select a start date'),
  end_date: z.string().min(1, 'Please select an end date'),
  budget: z.coerce.number().positive('Budget must be greater than 0'),
  currency: z.string().default('USD'),
  group_size: z.coerce.number().int().min(1, 'At least 1 traveler required'),
  travel_style: z.string().default('Balanced'),
  pace: z.string().default('Balanced'),
  interests: z.array(z.string()).min(1, 'Select at least 1 interest'),
  accommodation_preference: z.string().optional(),
  transportation_preference: z.string().optional(),
  food_preference: z.string().optional(),
  special_requirements: z.string().optional(),
}).refine((data) => {
  if (data.start_date && data.end_date) {
    return new Date(data.end_date) >= new Date(data.start_date);
  }
  return true;
}, {
  message: 'End date cannot be earlier than start date',
  path: ['end_date'],
});

export type TripFormData = z.infer<typeof tripFormSchema>;
