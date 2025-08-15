import React, { useRef, useState } from 'react';
import { Camera } from 'react-camera-pro';
import { useTheme } from '@/utils/themeContext';

export const CameraComponent = ({ imageBackground }) => {
  const { theme } = useTheme();
  const camera = useRef(null);

  const [images, setImages] = useState([]);
  const [maxPhotos, setMaxPhoto] = useState(2);
  const [openModal, setOpenModal] = useState(false);

  const captureImage = () => {
    if (!camera.current || images.length >= maxPhotos) return;

    const photo = camera.current.takePhoto();
    setImages((prev) => [...prev, photo]);
  };

  const resetAll = () => {
    setImages([]);
  };

  // Download image function
  const downloadCollage = async () => {
    if (images.length === maxPhotos) {
      const collageData = await imageCollage();
      const link = document.createElement('a');
      link.href = collageData;
      link.download = 'PhotoByPitbooth.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Function to add collage to gallery
  const handleAddtoGallery = async () => {
    const collageData = await imageCollage();

    // const response = await fetch('/api/gallery', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ image: collageData }),
    // });

    setOpenModal(false);
  };

  // Function to render images as a collage
  const imageCollage = async () => {
    const canvas = document.createElement('canvas');
    const width = 280;
    const photoWidth = 250;
    const photoHeight = 200;
    const padding = 20;
    const totalHeight = images.length * (photoHeight + padding) + padding;

    canvas.width = width;
    canvas.height = totalHeight;

    const ctx = canvas.getContext('2d');

    let finalBackground = imageBackground;
    if (imageBackground && imageBackground.startsWith('url(')) {
      finalBackground = imageBackground;
    }

    let isImage = false;
    let imgSrc = '';

    if (typeof finalBackground === 'string') {
      // Format url(...)
      if (finalBackground.startsWith('url(')) {
        const match = finalBackground.match(/url\(["']?(.*?)["']?\)/);
        if (match?.[1]) {
          imgSrc = match[1].startsWith('/') ? `${window.location.origin}${match[1]}` : match[1];
          isImage = true;
        }
      }
      // Format langsung http atau data:image
      else if (finalBackground.startsWith('http') || finalBackground.startsWith('data:image')) {
        imgSrc = finalBackground;
        isImage = true;
      }
    }

    if (isImage) {
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      bgImg.src = imgSrc;

      await new Promise((resolve, reject) => {
        bgImg.onload = () => {
          ctx.drawImage(bgImg, 0, 0, width, totalHeight);
          resolve();
        };
        bgImg.onerror = reject;
      });
    } else {
      ctx.fillStyle = imageBackground || '#39afaf';
      ctx.fillRect(0, 0, width, totalHeight);
    }

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

    return collageData;
  };

  return (
    <div className="items-center justify-center gap-4 text-center md:flex">
      {/* Collage Photo Desktop */}
      <div className="order-2 hidden md:order-none md:block">
        <PhotoResult images={images} imageBackground={imageBackground} />
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
            console.log('Camera Ready broo');
          }}
        />

        {/* Dark Overlay */}
        {images.length >= maxPhotos && (
          <div className="absolute inset-0 cursor-not-allowed bg-black bg-opacity-95">
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
          Mirror Camera
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

        {/* add to galery */}
        <button
          onClick={() => {
            setOpenModal(true);
          }}
          className={`rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-400 ${
            images.length === maxPhotos ? '' : 'hidden md:invisible md:block md:opacity-0'
          }`}
        >
          Add to Gallery
        </button>

        {/* Open Modal */}
        {openModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold">Add to Gallery</h2>
              <p className="mb-4">Are you sure, want to add this collage to the gallery?</p>
              <button
                onClick={handleAddtoGallery}
                className="mr-2 rounded bg-blue-500 px-4 py-2 text-white"
              >
                Yes, i agree
              </button>
              <button
                onClick={() => setOpenModal(false)}
                className="rounded bg-gray-300 px-4 py-2 text-black"
              >
                Maybe later
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Collage Photo Mobile */}
      <div className="order-3 mt-4 block md:hidden">
        <PhotoResult images={images} imageBackground={imageBackground} />
      </div>
    </div>
  );
};

const PhotoResult = ({ images, imageBackground }) => {
  const isImage = imageBackground?.startsWith('http') || imageBackground?.startsWith('data:image');
  return (
    <div
      className="flex h-[450px] w-full flex-col items-center justify-center gap-3 overflow-y-auto rounded-lg p-4 md:w-[300px]"
      style={{
        background: isImage
          ? `url(${imageBackground}) center/cover no-repeat`
          : imageBackground || '#39afaf',
      }}
    >
      {images.length > 0 ? (
        images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Photo ${index + 1}`}
            className="h-[200px] w-[300px] rounded border border-none object-cover"
          />
        ))
      ) : (
        <span className="text-white">Let's Take the Photo</span>
      )}
    </div>
  );
};
