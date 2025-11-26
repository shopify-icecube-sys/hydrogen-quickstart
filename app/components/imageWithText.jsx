export default function ImageWithText({ image, heading, description, buttonLabel, buttonUrl }) {
  if (!image) return null;

  return (
    <section className="image-with-text text">
      {/* Left: Image */}
      <div className="iwt-image">
        <img
          src={image.url}
          alt={image.altText || 'Hydrogen Image With Text'}
        />
      </div>

      {/* Right: Text */}
      <div className="iwt-text">
        {heading && <h2>{heading}</h2>}
        {description && <p>{description}</p>}
        {buttonLabel && buttonUrl && (
          <a href={buttonUrl} className="iwt-button">
            {buttonLabel}
          </a>
        )}
      </div>

      <style>{`
        .image-with-text {
          display: flex;
          align-items: center;
          gap: 2rem;
          max-width: 1200px;
          margin: 4rem auto;
          padding: 0 1rem;
        }

        /* Image */
        .iwt-image {
          flex: 1.2;
        }

        .iwt-image img {
          width: 100%;
          height: auto;
          border-radius: 12px;
        }

        /* Text */
        .iwt-text {
          flex: 1;
        }

        .iwt-text h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .iwt-text p {
          font-size: 1rem;
          color: #4a4a4a;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        /* Button */
        .iwt-button {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background-color: #000000;
          color: #ffffff;      
          font-weight: 600;
          border-radius: 8px;
          text-decoration: none;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }

        .iwt-button:hover {
          background-color: #005bb5;
          transform: translateY(-2px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .image-with-text {
            flex-direction: column;
          }
          .iwt-image, .iwt-text {
            flex: unset;
            width: 100%;
          }
          .iwt-text h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}
