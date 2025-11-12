import React from "react";

export default function VideoSection({ data }) {
  if (!data) return null;

  const {heading, subheading, videoFile, thumbnail, autoplay, loop} = data;

  const videoSource = videoFile?.sources?.[0]?.url;
  const poster =
    thumbnail?.image?.url || videoFile?.previewImage?.url;

  return (
    <section className="video-section text-center py-10">
      {heading && <h2 className="text-4xl font-bold mb-4">{heading}</h2>}
      {subheading && <p className="text-lg mb-6">{subheading}</p>}

      {videoSource ? (
        <video
          className="mx-auto max-w-3xl rounded-lg shadow-lg"
          src={videoSource}
          poster={poster}
          controls
          autoPlay={autoplay}
          muted={autoplay}   // Mute the video when autoplay is enabled
          loop={loop}
        />
      ) : (
        <p>No video available</p>
      )}
    </section>
  );
}
