'use server' // This tells Next.js to only run this code on the server

import { supabase } from './supabase'

// This is the "Contract" for your data
interface Photo {
  id: number;
  title: string | null;
  image_url: string;
  date: string;
  cameras: {
    name: string;
  } | null; // It's an object, not an array!
  film_stocks: {
    name: string;
  } | null;
}

// Update your function to use this Interface
export async function getPhotos(): Promise<Photo[]> {
  const { data, error } = await supabase
    .from('photos')
    .select(`
      id,
      title,
      image_url,
      date,
      cameras ( name ),
      film_stocks ( name )
    `)
    .order('date', { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  // We "cast" the data to our Photo interface
  return (data as any) as Photo[];
}
