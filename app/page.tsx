import Image from 'next/image' // 1. Import the component
import { getPhotos } from '../utils/actions'

export default async function HomePage() {
  const photos = await getPhotos()

  return (
    <main className="p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-10 text-center">Film Gallery</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {photos.map((photo) => (
          <div key={photo.id} className="flex flex-col gap-2">
            
            {/* 2. The Image Component */}
            <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-gray-100">
              <Image 
                src={photo.image_url} 
                alt={photo.title || "Film photograph"}
                fill // This makes the image fill the container div
                className="object-cover" // This keeps the proportions correct
              />
            </div>

            {/* 3. The Details */}
            <div className="mt-2">
              <h2 className="font-medium">{photo.title}</h2>
              <p className="text-sm text-gray-500">
                {photo.cameras?.name} • {photo.film_stocks?.name || 'Digital'}
              </p>
            </div>

          </div>
        ))}
      </div>
    </main>
  )
}