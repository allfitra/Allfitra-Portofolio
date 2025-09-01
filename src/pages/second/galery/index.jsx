import React, { useState, useEffect, useRef } from 'react';
import { SecondLayout } from '@/components/Layouts';
import { PhotoContact, PhotoContact4 } from '@/assets/images/ImagesContact';
import { OnGoing } from '@/utils/components/OnGoing';
import supabase from '@/utils/Database/supabase';

export const MyGalery = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [galleryList, setGalleryList] = useState([]);

  useEffect(() => {
    getGalleryList();
  }, []);

  const getGalleryList = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('gallery_pitbooth')
      .select('id, username, image_url');

    if (error) {
      console.error(error.message);
    } else {
      setGalleryList(data);
      setIsLoading(false);
      // console.log(data);
    }
  };

  return (
    <SecondLayout>
      <AlbumList isLoading={isLoading} galleryData={galleryList} />
      {/* <div className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-5 bg-black opacity-90">
        <OnGoing />
      </div> */}
    </SecondLayout>
  );
};

const AlbumList = ({ isLoading, galleryData }) => {
  const ulRef = useRef(null);
  const [duration, setDuration] = useState(20);
  const [mainImage, setMainImage] = useState(PhotoContact4);

  const getImageList = galleryData.map((data) => data.image_url);
  const imageList = [PhotoContact4, ...getImageList];

  // Gandakan konten 5x agar panjang & looping halus
  const images = Array(3).fill(imageList).flat();

  const changeMainImage = (src) => {
    setMainImage(src);
  };

  useEffect(() => {
    if (ulRef.current) {
      const totalWidth = ulRef.current.scrollWidth;
      const speed = 100; // px per detik
      const newDuration = totalWidth / speed;
      setDuration(newDuration);
    }
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
      {isLoading ? (
        <div className="flex justify-center gap-2 overflow-hidden py-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} role="status" className="animate-pulse">
              <div className="flex h-28 w-32 items-center justify-center rounded-sm bg-gray-300 dark:bg-gray-700">
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
          ))}
        </div>
      ) : (
        <div className="relative w-full overflow-hidden">
          <div className="inline-flex w-full flex-nowrap">
            <ul
              ref={ulRef}
              className="flex items-center justify-center hover:[animation-play-state:paused] md:justify-start [&_img]:max-w-none [&_li]:mx-3"
              style={{
                animation: `infinite-scroll ${duration}s linear infinite`,
              }}
            >
              {images.concat(images).map((src, index) => (
                <li key={index} onClick={() => changeMainImage(src)} className="cursor-pointer">
                  <img
                    src={src}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-28 w-32 rounded-lg object-cover"
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Gradient mask kiri */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#1D1D1D] to-transparent" />
          {/* Gradient mask kanan */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#1D1D1D] to-transparent" />
        </div>
      )}
    </div>
  );
};
