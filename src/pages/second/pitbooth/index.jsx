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
    <div className="mt-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 w-full max-w-4xl mx-auto card-panel p-6">
      <div className="flex flex-col sm:flex-row w-full gap-6 items-center">
        
        {/* Color Picker Toggle */}
        <div className="flex-shrink-0">
          <SetColorPicker imageColor={imageBackground} onChange={onBackgroundChange} />
        </div>

        {/* Default Theme Images */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-3 w-full">
          {Object.keys(imageThemes).map((key) => (
            <div
              key={key}
              className="h-10 w-10 cursor-pointer rounded-full transition-transform duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              style={{ 
                background: imageThemes[key],
                border: imageBackground === key ? '3px solid var(--accent-cyan)' : '2px solid var(--glass-border)'
              }}
              onClick={() => onBackgroundChange(key)}
            ></div>
          ))}
        </div>
      </div>

      {/* Input custom image URL */}
      <div className="relative w-full md:w-[60%] flex-shrink-0">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4">
          <svg
            className="h-5 w-5 opacity-70"
            style={{ color: 'var(--text-secondary)' }}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm.5 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm0 5c.47 0 .917-.092 1.326-.26l1.967 1.967a1 1 0 0 0 1.414-1.414l-1.817-1.818A3.5 3.5 0 1 0 11.5 17Z" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full rounded-xl p-3 ps-12 text-sm focus:outline-none focus:ring-2 transition-all duration-300"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)'
          }}
          placeholder="Paste Image URL..."
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--glass-border)';
            onBackgroundChange(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

const SetColorPicker = ({ imageColor, onChange }) => {
  const [isHover, setIsHover] = useState(false);
  const { theme } = useTheme();

  return (
    <div
      className="relative inline-block z-50"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <button className="transition-transform duration-300 hover:scale-105">
        <img src={ColorPickerIcon} alt="Color Picker" className="h-14 w-14 object-contain" />
      </button>
      
      {isHover && (
        <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2">
          <div className="shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden border border-[var(--glass-border)]">
            <ColorPicker
              color={imageColor}
              onChange={onChange}
              theme={{
                background: theme === 'dark' ? '#1a1a2e' : '#ffffff',
                borderRadius: '16px',
                width: '220px',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
