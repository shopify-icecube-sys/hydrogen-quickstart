import { Image } from '@shopify/hydrogen';

const HumansOfNewYorkSection = ({ data }) => {
  if (!data || !data.image?.url) return null;

  return (
    <section className="flex items-stretch p-8 gap-0">
      {/* Left Column (Image) */}
      <div className="flex-1 aspect-[3/4] flex items-center justify-center">
        <Image 
          src={data.image.url}
          alt={data.image.altText || 'Humans of New York'}
          className="rounded-lg shadow-lg object-contain w-full h-full"
        />
      </div>

      {/* Middle Column (Heading with black background) */}
      <div className="flex-1 aspect-[3/4] flex items-center justify-center">
        <div className="bg-black text-white w-full h-full flex items-center justify-center rounded-lg shadow-lg">
          <h2 className="text-4xl font-extrabold">{data.heading}</h2>
        </div>
      </div>

      {/* Right Column (Description and Button) */}
      <div className="flex-1 pl-12 flex flex-col justify-center aspect-[3/4]">
        <p className="text-lg mb-6">{data.description}</p>
        <a
          href={data.buttonUrl}
          className="bg-black text-white text-center px-10 py-4 rounded-full text-lg font-semibold transition hover:bg-gray-800 mt-8"
        >
          {data.buttonLabel || 'Learn More'}
        </a>
      </div>
    </section>
  );
};

export default HumansOfNewYorkSection;