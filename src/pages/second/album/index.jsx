import React, { useState, useEffect, useRef } from 'react';
import { SecondLayout } from '@/components/Layouts';
import { PhotoContact } from '@/assets/images/ImagesContact';

export const MyAlbum = () => {
  return (
    <SecondLayout>
      <AlbumList />
    </SecondLayout>
  );
};

const AlbumList = () => {
  const [mainImage, setMainImage] = useState(
    'https://flowbite.s3.amazonaws.com/docs/gallery/featured/image.jpg'
  );

  const originalImages = [
    PhotoContact,
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg',
  ];

  // Gandakan konten 5x agar panjang & looping halus
  const images = Array(10).fill(originalImages).flat();

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
    <div className="grid gap-4">
      {/* Gambar utama */}
      <div className="flex justify-center">
        <img
          className="max-h-[60vh] w-auto rounded-lg object-cover"
          src={mainImage}
          alt="Featured"
        />
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

export default AlbumList;
