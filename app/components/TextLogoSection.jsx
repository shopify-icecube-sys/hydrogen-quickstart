import { useState } from "react";

export default function TextLogoSection({ data }) {
  // Flatten all logos with corresponding text for easier handling
  const flattened = data.flatMap((entry) =>
    entry.logos.map((logo) => ({ logo, text: entry.text }))
  );

  // State to track which logo is active
  const [activeIndex, setActiveIndex] = useState(0); // first logo selected by default

  return (
    <section className="text-logo-section px-10 py-16 bg-gray-200 rounded-xl max-w-7xl mx-auto md:px-20 md:py-24">
      {/* Show text for the active logo above */}
      <div className="mb-8 text-center">
        <p className="text-xl font-medium text-gray-900">{flattened[activeIndex]?.text}</p>
      </div>

      {/* Logos row */}
      <div className="flex justify-center gap-8 items-center flex-wrap">
        {flattened.map((item, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer transition-transform"
              onClick={() => setActiveIndex(index)}
            >
            <img
              key={index}
              src={item.logo.url}
              alt={item.logo.altText || `Logo ${index + 1}`}
              className={`h-12 w-auto object-contain cursor-pointer transition-transform ${
                isActive ? "scale-110 opacity-100" : "opacity-60"
              }`}
              onClick={() => setActiveIndex(index)}
            />
            <span
                className={`mt-2 h-2 w-2 rounded-full transition-all duration-300 ${
                  isActive ? "bg-black" : "bg-transparent"
                }`}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
