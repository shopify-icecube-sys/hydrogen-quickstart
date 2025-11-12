// Exporting the component by default
export default function HeadingMainHydrogen({ heading, subheading, button1Label, button1Url, button2Label, button2Url }) {
  return (
    <section className="heading-main-hydrogen">
      <div className="content">
        {heading && <h2 className="section-heading text-center text-6xl">{heading}</h2>}
        {subheading && <p className="section-subheading text-center text-3xl">{subheading}</p>}
        <div className="buttons flex justify-center gap-4 mt-6">
          {button1Label && button1Url && (
            <a href={button1Url} className="button bg-black text-white py-3 px-6 rounded-full hover:bg-gray-800 transition">
              {button1Label}
            </a>
          )}
          {button2Label && button2Url && (
            <a href={button2Url} className="button bg-black text-white py-3 px-6 rounded-full hover:bg-gray-800 transition">
              {button2Label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
