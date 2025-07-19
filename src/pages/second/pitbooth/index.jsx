import React, { useRef, useState } from 'react';
import { SecondLayout } from '@/components/Layouts';
import { Camera } from 'react-camera-pro';
import { useTheme } from '@/utils/themeContext';
import ColorPicker from 'react-pick-color';
import { ColorPickerIcon } from '@/assets/NewWorld';

export const Pitbooth = () => {
  return (
    <SecondLayout title="PitBooth">
      <CameraComponent />
      <button className="mt-3">
        <img src={ColorPickerIcon} className="h-16" />
      </button>
    </SecondLayout>
  );
};

const CameraComponent = () => {
  const { theme } = useTheme();
  const camera = useRef(null);

  const [images, setImages] = useState([]);
  const maxPhotos = 2;

  const captureImage = () => {
    if (!camera.current || images.length >= maxPhotos) return;

    const photo = camera.current.takePhoto();
    setImages((prev) => [...prev, photo]);
  };

  const resetAll = () => {
    setImages([]);
  };

  const downloadCollage = async () => {
    const canvas = document.createElement('canvas');
    const width = 280;
    const height = 680;
    canvas.width = width;
    canvas.height = height;
    const photoWidth = 250;
    const photoHeight = 200;
    const padding = 10;
    const totalHeight = images.length * (photoHeight + padding) + padding;

    canvas.width = width;
    canvas.height = totalHeight;

    const ctx = canvas.getContext('2d');

    // Background canvas
    ctx.fillStyle = '#60A5FA';
    ctx.fillRect(0, 0, width, totalHeight);

    const reversedImages = [...images];

    for (let i = 0; i < reversedImages.length; i++) {
      const img = new Image();
      img.src = reversedImages[i];
      await new Promise((resolve) => {
        img.onload = () => {
          const x = (width - photoWidth) / 2;
          const y = padding + i * (photoHeight + padding);
          ctx.drawImage(img, x, y, photoWidth, photoHeight);
          resolve();
        };
      });
    }

    const collageData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = collageData;
    link.download = 'PhotoByPitbooth.png';
    link.click();
  };

  return (
    <div className="items-center justify-center gap-4 text-center md:flex">
      {/* Collage Photo Desktop */}
      <div className="order-2 hidden md:order-none md:block">
        <PhotoResult images={images} />
      </div>

      {/* Camera Section */}
      <div
        className={`relative flex-1 overflow-hidden rounded-[5%] border-[10px] md:max-w-[600px] ${
          theme === 'dark' ? 'border-white' : 'border-black'
        }`}
      >
        <Camera
          ref={camera}
          aspectRatio={4 / 3}
          facingMode="user"
          errorMessages={{
            noCameraAccessible: 'Tidak ada kamera yang dapat diakses.',
            permissionDenied: 'Izin ditolak. Mohon izinkan akses kamera.',
            switchCamera: 'Tidak dapat mengganti kamera.',
            canvas: 'Browser tidak mendukung canvas.',
          }}
          videoReadyCallback={() => {
            console.log('Kamera siap.');
          }}
        />

        {/* Dark Overlay */}
        {images.length >= maxPhotos && (
          <div className="pointer-events-none absolute inset-0 z-10 bg-black bg-opacity-90">
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-2xl text-red-600">Photos Already Done</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 md:mt-0 md:w-[150px]">
        {/* Take Photo */}
        <button
          onClick={captureImage}
          className={`rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-400 ${
            images.length < maxPhotos ? '' : 'hidden md:invisible md:block md:opacity-0'
          }`}
        >
          Take Photo {images.length + 1}
        </button>

        {/* Switch Camera */}
        <button
          onClick={() => camera.current?.switchCamera()}
          className={`rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-400 ${
            images.length < maxPhotos ? '' : 'hidden md:invisible md:block md:opacity-0'
          }`}
        >
          Switch Camera
        </button>

        {/* Reset Photo */}
        <button
          onClick={resetAll}
          className={`rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-400 ${
            images.length > 0 ? '' : 'hidden md:invisible md:block md:opacity-0'
          }`}
        >
          Reset Photo
        </button>

        {/* Download */}
        <button
          onClick={downloadCollage}
          className={`rounded-lg bg-yellow-500 px-4 py-2 text-white transition hover:bg-yellow-400 ${
            images.length === maxPhotos ? '' : 'hidden md:invisible md:block md:opacity-0'
          }`}
        >
          Download Now
        </button>
      </div>

      {/* Collage Photo Mobile */}
      <div className="order-3 mt-4 block md:hidden">
        <PhotoResult images={images} />
      </div>
    </div>
  );
};

const PhotoResult = ({ images }) => {
  return (
    <div className="flex h-[450px] w-full flex-col items-center justify-center gap-2 overflow-y-auto rounded-lg bg-blue-300 p-4 md:w-[300px]">
      {images.length > 0 ? (
        images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Photo ${index + 1}`}
            className="h-[200px] w-[300px] rounded border object-cover"
          />
        ))
      ) : (
        <span className="text-white">Let's Take the Photo</span>
      )}
    </div>
  );
};

const PhotoBackgroundTheme = () => {
  const [color, setColor] = useState('#fff');

  return (
    <div>
      <ColorPicker
        color={color}
        onChange={(newColor) => setColor(newColor.hex)}
        theme={{
          background: 'lightgrey',
          borderRadius: '10px',
          width: '300px',
        }}
      />
    </div>
  );
};
