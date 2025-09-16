import React, { useState } from 'react';
import { SecondLayout } from '@/components/Layouts';
import ColorPicker from 'react-pick-color';
import { ColorPickerIcon } from '@/assets/NewWorld';
import { CameraComponent } from './components/cameraPackage';
import { imageThemes } from './data/imageTheme';
import { useTheme } from '@/utils/themeContext';

export const Pitbooth = () => {
  const imageColorDefault = '#39afaf';
  const [imageBackground, setImageBackground] = useState(imageColorDefault);

  const handleBackgroundChange = (value) => {
    if (typeof value === 'object' && value.hex) {
      setImageBackground(value.hex);
    } else {
      setImageBackground(value);
    }
  };

  return (
    <SecondLayout title="PitBooth">
      <CameraComponent imageBackground={imageThemes[imageBackground] || imageBackground} />
      <ImageBackgroundPackage
        imageBackground={imageBackground}
        onBackgroundChange={handleBackgroundChange}
      />
    </SecondLayout>
  );
};

const ImageBackgroundPackage = ({ imageBackground, onBackgroundChange }) => {
  const { theme } = useTheme();

  return (
    <div className="mt-6 flex flex-row items-start justify-between gap-4 md:w-[85%]">
      <div className="flex w-full flex-row gap-2">
        <SetColorPicker imageBackground={imageBackground} onChange={onBackgroundChange} />

        {/* Default Theme Images */}
        <div className="flex flex-wrap gap-4 md:max-w-[60%]">
          {Object.keys(imageThemes).map((key) => (
            <div
              key={key}
              className="h-12 w-12 cursor-pointer rounded-full border border-gray-300"
              style={{ background: imageThemes[key] }}
              onClick={() => onBackgroundChange(key)}
            ></div>
          ))}
        </div>
      </div>

      {/* Input custom image URL */}
      <div className="relative mb-6 hidden w-[40%] md:block">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
          <svg
            className="h-6 w-6 text-gray-500 dark:text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm.5 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm0 5c.47 0 .917-.092 1.326-.26l1.967 1.967a1 1 0 0 0 1.414-1.414l-1.817-1.818A3.5 3.5 0 1 0 11.5 17Z" />
          </svg>
        </div>
        <input
          type="text"
          className={`block w-full rounded-lg border border-gray-300 p-3 ps-10 text-sm
            ${theme === 'dark' ? 'bg-gray-100 text-black' : 'bg-gray-900 text-white'}`}
          placeholder="Image Background URL..."
          onBlur={(e) => onBackgroundChange(e.target.value)}
        />
      </div>
    </div>
  );
};

const SetColorPicker = ({ imageColor, onChange }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <button className="-mt-3">
        <img src={ColorPickerIcon} className="h-16" />
      </button>
      {isHover && (
        <div className="absolute top-full -mt-[340px] ml-7">
          <div>
            <ColorPicker
              color={imageColor}
              onChange={onChange}
              theme={{
                background: 'lightgrey',
                borderRadius: '10px',
                width: '200px',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
