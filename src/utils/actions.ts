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
    width: number;
    height: number;
}

interface FilmStock {
    id: number;
    name: string;
    iso: number;
}

interface Camera {
    id: number;
    name: string;
    format: string;
}

export async function getPhotos(
    filmStockIds: number[],
    cameraIds: number[],
): Promise<Photo[]> {

    // Build the base query
    let query = supabase
        .from('photos')
        .select(`
            id,
            title,
            image_url,
            cameras ( name ),
            film_stocks ( name ),
            is_digital,
            date,
            width,
            height
        `)
        .order('date', { ascending: false });

    // Apply filters
    if (filmStockIds.length > 0) {
        query = query.in('film_stock_id', filmStockIds)
    }

    if (cameraIds.length > 0) {
        query = query.in('camera_id', cameraIds)
    }

    // Apply sorting
    query = query.order('date', { ascending: true })

    // Run the query
    const { data, error } = await query;

    if (error) {
        console.error(error);
        return [];
    }

    // Map the data onto a list of Photo type
    return (data as any) as Photo[];
}

export async function getFilmStocks(): Promise<FilmStock[]> {
    const { data, error } = await supabase
        .from('film_stocks')
        .select(
            '*'
        );

    if (error) {
        console.log(error);
        return [];
    }

    return (data as any) as FilmStock[];
}

export async function getCameras(): Promise<Camera[]> {
    const { data, error } = await supabase
        .from('cameras')
        .select(
            '*'
        );

    if (error) {
        console.log(error);
        return [];
    }

    return (data as any) as Camera[];
}