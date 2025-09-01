import React, { useRef, useState } from 'react';
import { Camera } from 'react-camera-pro';
import { useTheme } from '@/utils/themeContext';
import { ModalAccepted } from './modalAccepted';
import supabase from '@/utils/Database/supabase';
import { SuccessToast } from './toastNotif';

export const CameraComponent = ({ imageBackground }) => {
  const { theme } = useTheme();
  const camera = useRef(null);

  const [images, setImages] = useState([]);
  const [maxPhotos, setMaxPhoto] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onUpload, setOnUpload] = useState(false);

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

  const postToGallery = async ({ username, image_url }) => {
    const data = {
      username: username,
      image_url: image_url,
    };
    // Insert data into Supabase
    await supabase
      .from('gallery_pitbooth')
      .insert([data])
      .then(({ error }) => {
        if (error) {
          console.error('Error adding to gallery:', error);
        } else {
          console.log('added data succesfully:');
        }
      });
  };

  // Function to upload image to bracket
  const handleAddtoGallery = async () => {
    const collageData = await imageCollage();

    // Convert base64 → Blob
    const blob = dataURLtoBlob(collageData);

    const fileName = `${Date.now()}_pitbooth.png`;
    const filePath = `public_area/${fileName}`;

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('gallery-collection')
      .upload(filePath, blob, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return;
    }

    // Get public URL
    const { data: publicUrl } = supabase.storage.from('gallery-collection').getPublicUrl(filePath);

    await postToGallery({ username: 'pitbooth user', image_url: `${publicUrl.publicUrl}` });

    setOnUpload(true);
    setTimeout(() => {
      setOnUpload(false);
    }, 3000);
    setIsModalOpen(false);
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
    <>
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
              setIsModalOpen(true);
            }}
            className={`rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-400 ${
              images.length === maxPhotos ? '' : 'hidden md:invisible md:block md:opacity-0'
            }`}
          >
            Add to Gallery
          </button>

          {/* Open Modal */}
          <ModalAccepted
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleAddtoGallery}
          />
        </div>

        {/* Collage Photo Mobile */}
        <div className="order-3 mt-4 block md:hidden">
          <PhotoResult images={images} imageBackground={imageBackground} />
        </div>
      </div>

      {/* Toast Notification */}
      {onUpload && <SuccessToast showTime={3000} />}
    </>
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

function dataURLtoBlob(dataURL) {
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}
