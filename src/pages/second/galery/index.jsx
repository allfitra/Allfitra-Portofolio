import React, { useState, useEffect, useRef } from 'react';
import { SecondLayout } from '@/components/Layouts';
import { PhotoContact } from '@/assets/images/ImagesContact';
import { Link } from 'react-router-dom';
import { OnGoing } from '@/utils/components/OnGoing';

export const MyGalery = () => {
  return (
    <SecondLayout>
      <AlbumList />
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-5 bg-black opacity-90">
        <OnGoing />
        <div className="rounded-xl bg-blue-800 px-3 py-2">
          <Link to={'/base'}> Kembali ke Base</Link>
        </div>
      </div>
    </SecondLayout>
  );
};

const AlbumList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mainImage, setMainImage] = useState(
    'https://flowbite.s3.amazonaws.com/docs/gallery/featured/image.jpg'
  );

  const originalImages = [
    PhotoContact,
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg',
  ];

  // Gandakan konten 5x agar panjang & looping halus
  const images = Array(5).fill(originalImages).flat();

  const changeMainImage = (src) => {
    setMainImage(src);
  };

  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    const initialOffset = images.length / 2;

    if (container) {
      container.scrollLeft = initialOffset;
    }

    const interval = setInterval(() => {
      if (container) {
        container.scrollLeft += 1;

        // Reset scroll ke tengah saat hampir habis (loop mulus)
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 2) {
          container.scrollLeft = initialOffset;
        }
      }
    }, 20);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="relative grid gap-4">
      {/* Gambar utama */}
      <div className="flex justify-center">
        {isLoading ? (
          <div role="status" className="animate-pulse ">
            <div className="flex h-[60vh] w-[90vh] items-center justify-center rounded-sm bg-gray-300 dark:bg-gray-700">
              <svg
                className="h-16 w-16 text-gray-200 dark:text-gray-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
              </svg>
            </div>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <img
            className="max-h-[60vh] w-auto rounded-lg object-cover"
            src={mainImage}
            alt="Featured"
          />
        )}
      </div>

      {/* Scroll thumbnail */}
      <div className="overflow-hidden py-2">
        <div
          className="album-scroll gap-3"
          ref={scrollRef}
          onWheel={(e) => {
            scrollRef.current.scrollLeft += e.deltaY;
          }}
        >
          {images.map((src, index) => (
            <div
              key={index}
              onClick={() => changeMainImage(src)}
              className="h-28 w-32 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg transition-transform duration-200 hover:scale-105"
            >
              <img
                className="h-full w-full object-cover"
                src={src}
                alt={`Thumbnail ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

//  return (
//     <div className="grid gap-4 ">
//       {/* Gambar utama */}
//       <div className="flex justify-center">
//         {isLoading ? (
//           <div role="status" class="animate-pulse ">
//             <div class="flex h-[60vh] w-[90vh] items-center justify-center rounded-sm bg-gray-300 dark:bg-gray-700">
//               <svg
//                 class="h-16 w-16 text-gray-200 dark:text-gray-600"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="currentColor"
//                 viewBox="0 0 20 18"
//               >
//                 <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
//               </svg>
//             </div>
//             <span class="sr-only">Loading...</span>
//           </div>
//         ) : (
//           <img
//             className="max-h-[60vh] w-auto rounded-lg object-cover"
//             src={mainImage}
//             alt="Featured"
//           />
//         )}
//       </div>

//       {/* Scroll thumbnail */}
//       <div className="overflow-hidden py-2">
//         <div
//           className="album-scroll gap-3"
//           ref={scrollRef}
//           onWheel={(e) => {
//             scrollRef.current.scrollLeft += e.deltaY;
//           }}
//         >
//           {images.map((src, index) => (
//             <div
//               key={index}
//               onClick={() => changeMainImage(src)}
//               className="h-28 w-32 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg transition-transform duration-200 hover:scale-105"
//             >
//               <img
//                 className="h-full w-full object-cover"
//                 src={src}
//                 alt={`Thumbnail ${index + 1}`}
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
