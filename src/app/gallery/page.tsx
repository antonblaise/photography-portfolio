'use client';

import { getPhotos, getFilmStocks, getCameras } from '@/utils/actions';
import '@/utils/animations';
import Spinner from '@/components/Spinner';
import Filter from '@/components/Filter';
import { RowsPhotoAlbum } from 'react-photo-album';
import 'react-photo-album/rows.css';
import { useEffect, useState, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

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

    // ---------------------------- Data ----------------------------
    const [hasMounted, setHasMounted] = useState<boolean>(false);
    const [photos, setPhotos] = useState<any[]>([]);
    const [filmStocks, setFilmStocks] = useState<FilmStock[]>([]);
    const [cameras, setCameras] = useState<Camera[]>([]);
    const searchParams = useSearchParams();

    // ---------------------------- Filters ----------------------------
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

    const filteredPhotos = useMemo(() => {
        let result = photos;

        // Apply film stocks filter
        if (filmStocksFilter.length > 0) {
            result = result.filter((p) => 
                p.film_stock_id && filmStocksFilter.includes(p.film_stock_id)
            );
        }

        // Apply cameras filter
        if (camerasFilter.length > 0) {
            result = result.filter((p) => 
                p.camera_id && camerasFilter.includes(p.camera_id)
            );
        }

        // Output the photos into a format readable by RowsPhotoAlbum
        return result.map((p) => ({
            src: p.image_url.replace("/upload", "/upload/f_auto,q_auto,w_800"),
            width: p.width,
            height: p.height,
            alt: p.title || "photo"
        }));

    }, [photos, filmStocksFilter, camerasFilter])   // Reruns if any of these changes

    // Sync URL parameters to filter state
    useEffect(() => {

        // URL -> parameters
        const params = new URLSearchParams(searchParams.toString());

        // parameters -> number[]
        const filmStocksFilterFromUrl = params.get("film_stocks") ? params.get("film_stocks")!.split(",").map(Number).filter(Boolean) : [];
        const camerasFilterFromUrl = params.get("cameras") ? params.get("cameras")!.split(",").map(Number).filter(Boolean) : [];

        // number[] -> filters
        setFilmStocksFilter(filmStocksFilterFromUrl);
        setCamerasFilter(camerasFilterFromUrl);

    }, [searchParams]);

    // ---------------------------- RowsPhotoAlbum specs ----------------------------
    const [rowHeight, setRowHeight] = useState<number>(250);
    const [spacing, setSpacing] = useState<number>(10);

    useEffect(() => {
        const updateRowHeightAndSpacing = () => {
            setRowHeight(window.innerWidth >= 768 ? 250 : 150);
            setSpacing(window.innerWidth >= 768 ? 10 : 5);
        };

        updateRowHeightAndSpacing();

        window.addEventListener('resize', updateRowHeightAndSpacing);

        return () => window.removeEventListener('resize', updateRowHeightAndSpacing);
    }, []);

    // ---------------------------- Load data from Supabase ----------------------------
    useEffect(() => {

        Promise.all([
            getPhotos(), // Fetches all photos without conditions
            getFilmStocks(),
            getCameras()
        ]).then(([rawPhotos, rawFilmStocks, rawCameras]) => {
            setPhotos(rawPhotos || []);
            setFilmStocks(rawFilmStocks || []);
            setCameras(rawCameras || []);
            setHasMounted(true);
        }).catch((err) => {
            console.error("Failed downloading items from Supabase:", err);
            setHasMounted(true);
        });

    }, []);

    // ---------------------------- Helper function ----------------------------
    const handleFilterChange = (filterName: string, filterState: number[]) => {

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
            if (filter.name === filterName) {
                filter.setState(filterState);
            }
        });

        // 5. Update the browser's address
        window.history.pushState(null, '', `${window.location.pathname}?${params.toString()}`);
    }



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
                    filteredPhotos.length > 0 ?
                        <RowsPhotoAlbum
                            photos={filteredPhotos}
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