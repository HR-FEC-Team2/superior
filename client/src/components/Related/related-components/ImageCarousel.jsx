import React from 'react';
import imgUnavailable from '../assets/imgUnavailable.png';
import './styles/imageCarousel.css';

export default function ImageCarousel({
  relStyle, setRelStyle, setShowImg,
}) {
  const handlePhotoChange = (e, index) => {
    e.stopPropagation();
    const newStyle = {};
    Object.assign(newStyle, relStyle);
    [newStyle.photos[0], newStyle.photos[index]] = [newStyle.photos[index], newStyle.photos[0]];
    setRelStyle(newStyle);
  };

  return (
    <div className="img-carousel-outside" onMouseLeave={() => setShowImg(false)}>
      <div id="img-carousel-inside">
        {relStyle.photos.map((photo, index) => (
          /* eslint-disable
               react/no-array-index-key,
               jsx-a11y/no-noninteractive-tabindex,
               jsx-a11y/no-noninteractive-element-interactions */
          <div key={`img${index}`} className="img-carousel-container">
            <img
              key={`img${index}`}
              id="img-carousel"
              src={relStyle.photos[index].thumbnail_url || imgUnavailable}
              alt="Image Not Available"
              tabIndex={0}
              onKeyDown={(e) => handlePhotoChange(e, index)}
              onClick={(e) => handlePhotoChange(e, index)}
            />
          </div>
          /* eslint-enable */
        ))}
      </div>
    </div>
  );
}