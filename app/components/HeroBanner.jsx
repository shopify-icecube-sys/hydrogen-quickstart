import { useEffect, useState } from 'react';

export default function HeroBanner({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const current = images[currentIndex];

  return (
    <section className="relative w-full max-w-4xl mx-auto overflow-hidden">
      <img
        src={current.url}
        alt={current.altText}
        className="w-full h-[500px] object-cover"
      />
      {current.heading && (
        <div className="absolute bottom-10 left-10 text-white text-5xl font-extrabold bg-black bg-opacity-50 px-6 py-3 rounded-lg">
          {current.heading}
        </div>
      )}
    </section>
  );
}
