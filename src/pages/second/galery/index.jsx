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

  const images = Array(3).fill(imageList).flat();

  const changeMainImage = (src) => {
    setMainImage(src);
  };

  useEffect(() => {
    if (ulRef.current) {
      const totalWidth = ulRef.current.scrollWidth;
      const speed = 100;
      const newDuration = totalWidth / speed;
      setDuration(newDuration);
    }
  }, [images]);

  return (
    <div className="relative flex flex-col gap-8 w-full max-w-5xl mx-auto mt-6">
      {/* Main Image Frame */}
      <div className="flex justify-center">
        <div className="card-panel p-4 sm:p-6 w-full flex justify-center items-center overflow-hidden min-h-[40vh] md:min-h-[60vh]">
          {isLoading ? (
            <div role="status" className="animate-pulse w-full h-full flex flex-col items-center justify-center">
              <div className="flex h-[40vh] md:h-[55vh] w-full max-w-3xl items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <svg
                  className="h-16 w-16 opacity-20"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                </svg>
              </div>
            </div>
          ) : (
            <img
              className="max-h-[55vh] w-auto rounded-xl object-contain shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-opacity duration-500"
              src={mainImage}
              alt="Featured"
            />
          )}
        </div>
      </div>

      {/* Scroll thumbnail */}
      {isLoading ? (
        <div className="flex justify-center gap-4 overflow-hidden py-4 w-full">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} role="status" className="animate-pulse flex-shrink-0">
              <div className="flex h-24 w-32 items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>
                <svg
                  className="h-8 w-8 opacity-20"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative w-full overflow-hidden rounded-xl bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)] py-4">
          <div className="inline-flex w-full flex-nowrap">
            <ul
              ref={ulRef}
              className="flex items-center justify-center hover:[animation-play-state:paused] md:justify-start [&_img]:max-w-none [&_li]:mx-3"
              style={{
                animation: `infinite-scroll ${duration}s linear infinite`,
              }}
            >
              {images.concat(images).map((src, index) => (
                <li key={index} onClick={() => changeMainImage(src)} className="cursor-pointer group">
                  <div className="overflow-hidden rounded-xl border-2 border-transparent transition-all duration-300 group-hover:border-[var(--accent-cyan)] group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                    <img
                      src={src}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-24 w-32 object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Gradient mask kiri */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 md:w-40" style={{ background: 'linear-gradient(to right, var(--bg-primary), transparent)' }} />
          {/* Gradient mask kanan */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 md:w-40" style={{ background: 'linear-gradient(to left, var(--bg-primary), transparent)' }} />
        </div>
      )}
    </div>
  );
};
