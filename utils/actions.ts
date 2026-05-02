'use server'

import { supabase } from "./supabase";

interface Photo {
    id: number;
    title: string | null;
    image_url: string;
    cameras: {
        name: string;
    } | null;       // Null for when data fails to load
    film_stocks: {
        name: string;
    } | null;       // Null for when data fails to load
    is_digital: boolean;
    date: string;
}

export async function getPhotos(): Promise<Photo[]> {
    const { data, error } = await supabase
        .from('photos')
        .select(`
            id,
            title,
            image_url,
            cameras ( name ),
            film_stocks ( name ),
            is_digital,
            date
        `)
        .order('date', { ascending: false });

    if (error) {
        console.error(error);
        return [];
    }

    return (data as any) as Photo[];
}