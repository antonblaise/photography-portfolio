'use server' // This tells Next.js to only run this code on the server

import { supabase } from './supabase'

export async function getPhotos() {
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
    .order('date', { ascending: false }) // Shows newest photos first

  if (error) {
    console.error('Fetch error:', error)
    return []
  }

  return data
}