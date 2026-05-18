'use client';

import { getPhotos, getFilmStocks, getCameras } from '@/utils/actions';
import { RowsPhotoAlbum } from 'react-photo-album';
import Spinner from '@/components/Spinner';
import Filter from '@/components/Filter';
import 'react-photo-album/rows.css';
import { useEffect, useState, Suspense } from 'react';
import '@/utils/animations';
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface Photo {
    src: string;
    width: number;
    height: number;
    alt: string;
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

function GalleryContent() {

    // Utils
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // State and data
    const [hasMounted, setHasMounted] = useState<boolean>(false);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [filmStocks, setFilmStocks] = useState<FilmStock[]>([]);
    const [cameras, setCameras] = useState<Camera[]>([]);

    // Filters
    const [filmStocksFilter, setFilmStocksFilter] = useState<number[]>([]);
    const [camerasFilter, setCamerasFilter] = useState<number[]>([]);

    const filters = [
        {
            name: "Film Stocks",
            options: filmStocks,
            state: filmStocksFilter,
            setState: setFilmStocksFilter
        },
        {
            name: "Cameras",
            options: cameras,
            state: camerasFilter,
            setState: setCamerasFilter
        }
    ];

    // RowsPhotoAlbum specs
    const [rowHeight, setRowHeight] = useState<number>(250);
    const [spacing, setSpacing] = useState<number>(10);

    // Helper function
    function handleFilterChange(filterName: string, filterState: number[]) {

        // 1. Read the current parameters from the URL
        const params = new URLSearchParams(window.location.search);

        // 2. Reset that filter's URL parameter
        const filterParamName = filterName.toLowerCase().replace(" ", "_");
        params.delete(filterParamName);

        // 3. Assign the filter's new URL parameter based on the given state only if it's not empty
        if (filterState.length > 0) {
            params.append(filterParamName, filterState.map(String).join(","));
        }

        // 4. Set the filter
        filters.forEach((filter) => {
            if (filter.name == filterName) {
                filter.setState(filterState);
            }
        });

        // 5. Update the browser's address seamlessly in the background
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }

    useEffect(() => {

        setHasMounted(false);

        // ---------- Get parameters from the current URL ----------
        // URL -> parameters
        const params = new URLSearchParams(window.location.search);


        // ---------- Get filter combination from the browser's address bar and set the filter ----------
        // parameters -> number[]
        const filmStocksFilterFromUrl = params.get("film_stocks") ? params.get("film_stocks")!.split(",").map(Number) : [];
        const camerasFilterFromUrl = params.get("cameras") ? params.get("cameras")!.split(",").map(Number) : [];


        // ---------- Set the filters ----------
        // number[] -> filters
        setFilmStocksFilter(filmStocksFilterFromUrl);
        setCamerasFilter(camerasFilterFromUrl);


        // ---------- Query Supabase for data from all the tables - film_stocks, cameras, photos ----------
        // Supabase -> data
        getFilmStocks().then((data) => { setFilmStocks(data) })
        getCameras().then((data) => { setCameras(data) })


        // ---------- Directly use the list (number[]) read from URL instead of the actual filters! ----------
        // Because setting state in React is NOT instant.
        // number[] -> Supabase -> data
        getPhotos(filmStocksFilterFromUrl, camerasFilterFromUrl)
        .then((rawPhotos) => {

            // Format the photos object into something readable by RowsPhotoAlbum.
            const formattedPhotos = rawPhotos.map((p) => (
                {
                    src: p.image_url.replace("/upload", "/upload/f_auto,q_auto,w_800"),
                    width: p.width,
                    height: p.height,
                    alt: p.title || "photo"
                }
            ));

            setPhotos(formattedPhotos);

            // Only raise the flag when all photos have indeed been loaded.
            setHasMounted(true);
        });

        const updateRowHeightAndSpacing = () => {
            setRowHeight(window.innerWidth >= 768 ? 250 : 150);
            setSpacing(window.innerWidth >= 768 ? 10 : 5);
        };

        updateRowHeightAndSpacing();

        window.addEventListener('resize', updateRowHeightAndSpacing);

        return () => window.removeEventListener('resize', updateRowHeightAndSpacing);

    }, [searchParams]);


    return (

        <main className="p-5 md:p-10">
            <h1
                className="flex justify-center tracking-widest pb-5 text-xl md:pb-10 md:text-3xl"
            >
                GALLERY
            </h1>

            <Filter
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            { 
                hasMounted ? 
                (
                    photos.length > 0 ?
                        <RowsPhotoAlbum
                            photos={photos}
                            targetRowHeight={rowHeight}
                            spacing={spacing}
                        />
                    :
                        <p className="flex max-w-screen justify-center p-20 tracking-widest italic">None</p>
                ) : (
                    <Spinner />
                )
            }
            
        </main>

    );

};

export default function GalleryPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <GalleryContent />
        </Suspense>
    )
}