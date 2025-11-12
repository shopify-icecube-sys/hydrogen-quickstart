import React, {useState, useEffect, useRef} from 'react';
import {Link, useLoaderData} from 'react-router';
import HeroBanner from '~/components/HeroBanner';
import ImageWithText from '~/components/imageWithText';
import FaqGrid from '~/components/FaqGrid';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import {Scrollbar} from 'swiper/modules';
import HumansOfNewYorkSection from '~/components/HumansOfNewYorkSection';
import HeadingMainHydrogen from '~/components/HeadingMainHydrogen';
import VideoSection from '~/components/VideoSection';
import TextLogoSection from '~/components/TextLogoSection';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader({context, request}) {
  // 1. Hero banner
  const {metaobjects: heroBannerMetaobjects} = await context.storefront.query(
    HERO_BANNER_METAOBJECT_QUERY,
  );

  const heroBannerImages = heroBannerMetaobjects.nodes.flatMap((entry) =>
    entry.fields
      .filter((f) => f.key === 'banner_images' && f.reference?.image?.url)
      .map((f) => {
        const headingField = entry.fields.find(
          (x) => x.key === 'banner_heading',
        );
        return {
          url: f.reference.image.url,
          altText: f.reference.image.altText || '',
          heading: headingField?.value || '',
        };
      }),
  );

  // 2. Homepage settings (featured collection)
  const {metaobject: homepageSettings} = await context.storefront.query(
    HOMEPAGE_SETTINGS_QUERY,
  );

  const featuredCollectionHandle = homepageSettings?.fields.find(
    (f) => f.key === 'featured_collection',
  )?.reference?.handle;

  // 3. Collection products
  let collectionProducts = [];
  if (featuredCollectionHandle) {
    const {collection} = await context.storefront.query(
      COLLECTION_PRODUCTS_QUERY,
      {variables: {handle: featuredCollectionHandle}},
    );
    collectionProducts = collection?.products?.nodes || [];
  }

  // 4. Image with text
  const {metaobject: imageWithTextMetaobject} = await context.storefront.query(
    IMAGE_WITH_TEXT_QUERY,
  );

  const imageWithText = {
    image: imageWithTextMetaobject?.fields.find((f) => f.key === 'image')
      ?.reference?.image,
    heading: imageWithTextMetaobject?.fields.find((f) => f.key === 'heading')
      ?.value,
    description: imageWithTextMetaobject?.fields.find(
      (f) => f.key === 'description',
    )?.value,
    buttonLabel: imageWithTextMetaobject?.fields.find(
      (f) => f.key === 'button_label',
    )?.value,
    buttonUrl: imageWithTextMetaobject?.fields.find(
      (f) => f.key === 'button_url',
    )?.value,
  };

  // 5. FAQs
  const {metaobjects: faqMetaobjects} =
    await context.storefront.query(FAQ_QUERY);

  const faqs = faqMetaobjects.nodes.map((entry) => {
    const question = entry.fields.find((f) => f.key === 'question')?.value;
    const answer = entry.fields.find((f) => f.key === 'answer')?.value;
    const iconField = entry.fields.find((f) => f.key === 'icon');
    const icon = iconField?.reference?.image?.url;

    return {question, answer, icon};
  });

  const {metaobject: humansOfNewYorkMetaobject} =
    await context.storefront.query(HUMANS_OF_NEW_YORK_QUERY);

  const humansOfNewYork = {
    image: humansOfNewYorkMetaobject?.fields.find((f) => f.key === 'image')
      ?.reference?.image,
    heading: humansOfNewYorkMetaobject?.fields.find((f) => f.key === 'heading')
      ?.value,
    description: humansOfNewYorkMetaobject?.fields.find(
      (f) => f.key === 'description',
    )?.value,
    buttonLabel: humansOfNewYorkMetaobject?.fields.find(
      (f) => f.key === 'button_label',
    )?.value,
    buttonUrl: humansOfNewYorkMetaobject?.fields.find(
      (f) => f.key === 'button_url',
    )?.value,
  };

  const {metaobject: headingMainHydrogenMetaobject} =
    await context.storefront.query(HEADING_MAIN_HYDROGEN_QUERY);

  const headingMainHydrogen = {
    heading: headingMainHydrogenMetaobject?.fields.find(
      (f) => f.key === 'heading',
    )?.value,
    subheading: headingMainHydrogenMetaobject?.fields.find(
      (f) => f.key === 'subheading',
    )?.value,
    button1Label: headingMainHydrogenMetaobject?.fields.find(
      (f) => f.key === 'button_one_label',
    )?.value,
    button1Url: headingMainHydrogenMetaobject?.fields.find(
      (f) => f.key === 'button_one_url',
    )?.value,
    button2Label: headingMainHydrogenMetaobject?.fields.find(
      (f) => f.key === 'button_two_label',
    )?.value,
    button2Url: headingMainHydrogenMetaobject?.fields.find(
      (f) => f.key === 'button_two_url',
    )?.value,
  };

  // 6. Video Section
  const {metaobject: videoSectionMetaobject} =
    await context.storefront.query(VIDEO_SECTION_QUERY);

  const videoSection = {
    heading: videoSectionMetaobject?.fields.find((f) => f.key === 'heading')
      ?.value,
    subheading: videoSectionMetaobject?.fields.find(
      (f) => f.key === 'subheading',
    )?.value,
    videoFile: videoSectionMetaobject?.fields.find(
      (f) => f.key === 'video_file',
    )?.reference,
    thumbnail: videoSectionMetaobject?.fields.find(
      (f) => f.key === 'thumbnail_image',
    )?.reference,
    autoplay:
      videoSectionMetaobject?.fields.find((f) => f.key === 'autoplay')
        ?.value === 'true',
    loop:
      videoSectionMetaobject?.fields.find((f) => f.key === 'loop')?.value ===
      'true',
  };

  const {metaobject: productDetailsMetaobject} = await context.storefront.query(
    PRODUCT_DETAILS_QUERY,
  );

  const productDetails = {};
  productDetailsMetaobject?.fields.forEach((f) => {
    if (f.reference?.image) {
      productDetails[f.key] = f.reference.image;
    } else {
      productDetails[f.key] = f.value;
    }
  });

  const { metaobjects: textLogoMetaobjects } = await context.storefront.query(TEXT_LOGO_SECTION_QUERY);

  const textLogoSection = textLogoMetaobjects.edges.map(edge => {
    const node = edge.node;
    return {
      text: node.fields.find(f => f.key === "text")?.value,
      logos: node.fields
        .filter(f => f.key.includes("image") && f.reference?.image)
        .map(f => f.reference.image),
    };
  });

  return {
    heroBannerImages,
    collectionProducts,
    imageWithText,
    faqs,
    humansOfNewYork,
    headingMainHydrogen,
    videoSection,
    productDetails,
    textLogoSection,
  };
}

export default function Homepage() {
  const {
    heroBannerImages,
    collectionProducts,
    imageWithText,
    faqs,
    humansOfNewYork,
    headingMainHydrogen,
    videoSection,
    productDetails,
    textLogoSection,
  } = useLoaderData();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="home">
      <HeroBanner images={heroBannerImages} />
      {/* <h1 className="text-amber-400 text-lg italic underline">This should be blue</h1> */}
      {headingMainHydrogen && (
        <HeadingMainHydrogen
          heading={headingMainHydrogen.heading}
          subheading={headingMainHydrogen.subheading}
          button1Label={headingMainHydrogen.button1Label}
          button1Url={headingMainHydrogen.button1Url}
          button2Label={headingMainHydrogen.button2Label}
          button2Url={headingMainHydrogen.button2Url}
        />
      )}
      {imageWithText?.image && (
        <ImageWithText
          image={imageWithText.image}
          heading={imageWithText.heading}
          description={imageWithText.description}
          buttonLabel={imageWithText.buttonLabel}
          buttonUrl={imageWithText.buttonUrl}
        />
      )}
      {videoSection && <VideoSection data={videoSection} />}
      {faqs.length > 0 && <FaqGrid faqs={faqs} />}
      {productDetails?.heading && (
        <section className="product-details">
          {productDetails?.secondary_heading && (
            <h3 className="secondary-heading text-3xl text-center">
              {productDetails.secondary_heading}
            </h3>
          )}
          <h2 className="text-center text-6xl">{productDetails.heading}</h2>
          {(productDetails.image_one ||
            productDetails.image_two ||
            productDetails.image_three) && (
            <section className="three-images">
              <div className="image-grid">
                {productDetails.image_one &&
                  productDetails.image_two &&
                  productDetails.image_three && (
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <img
                        src={productDetails.image_one.url}
                        alt={productDetails.image_one.altText || 'Image one'}
                        className="w-full h-auto object-cover rounded-lg"
                      />
                      <img
                        src={productDetails.image_two.url}
                        alt={productDetails.image_two.altText || 'Image two'}
                        className="w-full h-auto object-cover rounded-lg"
                      />
                      <img
                        src={productDetails.image_three.url}
                        alt={
                          productDetails.image_three.altText || 'Image three'
                        }
                        className="w-full h-auto object-cover rounded-lg"
                      />
                    </div>
                  )}
              </div>
            </section>
          )}
          {productDetails?.button_label && (
            <div className="mt-6 text-center">
              <a
                href={productDetails.button_url || '#'}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                {productDetails.button_label}
              </a>
            </div>
          )}
        </section>
      )}
      <TextLogoSection data={textLogoSection} />
      {humansOfNewYork && <HumansOfNewYorkSection data={humansOfNewYork} />}
      <div className="home-content">
        <section className="collection-products">
          <h2>Featured Products</h2>
          {collectionProducts.length > 4 && isClient ? (
            <Swiper
              spaceBetween={20}
              slidesPerView={4}
              navigation={true}
              scrollbar={{hide: false}}
              modules={[Scrollbar]}
              breakpoints={{
                0: {slidesPerView: 1},
                640: {slidesPerView: 2},
                1024: {slidesPerView: 4},
              }}
            >
              {collectionProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="product-card">
                    <Link
                      to={`/products/${product.handle}`}
                      className="product-link"
                    >
                      <img
                        src={product.images.nodes[0]?.url}
                        alt={product.images.nodes[0]?.altText || product.title}
                        className="product-image"
                      />
                      <h3 className="product-title">{product.title}</h3>
                      <p className="product-price">
                        {product.priceRange.minVariantPrice.amount}{' '}
                        {product.priceRange.minVariantPrice.currencyCode}
                      </p>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="products-grid">
              {collectionProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <Link
                    to={`/products/${product.handle}`}
                    className="product-link"
                  >
                    <img
                      src={product.images.nodes[0]?.url}
                      alt={product.images.nodes[0]?.altText || product.title}
                      className="product-image"
                    />
                    <h3 className="product-title">{product.title}</h3>
                    <p className="product-price">
                      {product.priceRange.minVariantPrice.amount}{' '}
                      {product.priceRange.minVariantPrice.currencyCode}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <style>{`
        .home-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 1rem;
        }

        /* Featured Products */
        .collection-products h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 2rem;
          text-align: center;
        }
        .products-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
       

        @media (min-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .product-card {
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
          transition: box-shadow 0.2s ease;
          min-height: 350px; /* ensures equal height before image loads */
        }

        .product-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .product-card:hover {
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .product-title {
          font-size: 1.125rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .product-price {
          font-size: 1rem;
          font-weight: 600;
        }
          .swiper-button-next,
        .swiper-button-prev {
          color: #0c0c0cff; /* arrow color */
        }

        .swiper-slide {
          display: flex;
          justify-content: center;
        }

      `}</style>
    </div>
  );
}

const HERO_BANNER_METAOBJECT_QUERY = `#graphql
  query HeroBannerMetaobjects {
    metaobjects(type: "hydrogen_banner_images", first: 10) {
      nodes {
        id
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

const HOMEPAGE_SETTINGS_QUERY = `#graphql
  query HomepageSettings {
    metaobject(handle: {type: "homepage_settings", handle: "homepage-settings-bd0pky6i"}) {
      id
      fields {
        key
        value
        reference {
          ... on Collection {
            handle
            title
          }
        }
      }
    }
  }
`;

const COLLECTION_PRODUCTS_QUERY = `#graphql
  query CollectionProducts($handle: String!) {
    collection(handle: $handle) {
      id
      title
      products(first: 8) {
        nodes {
          id
          handle
          title
          images(first: 1) {
            nodes {
              url
              altText
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

const IMAGE_WITH_TEXT_QUERY = `#graphql
  query ImageWithText {
    metaobject(
      handle: {type: "hydrogen_image_with_text", handle: "hydrogen-image-with-text-e04krilt"}
    ) {
      id
      handle
      fields {
        key
        value
        reference {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

const FAQ_QUERY = `#graphql
  query FAQs {
    metaobjects(type: "faq", first: 10) {
      nodes {
        id
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

const HUMANS_OF_NEW_YORK_QUERY = `#graphql
  query HumansOfNewYork {
    metaobject(handle: {type: "humans_of_new_york", handle: "humans-of-new-york"}) {
      id
      fields {
        key
        value
        reference {
          ... on MediaImage {
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

const HEADING_MAIN_HYDROGEN_QUERY = `#graphql
  query HeadingMainHydrogen {
    metaobject(handle: {type: "heading_main_hydrogen", handle: "fresh-colors-lighter-steps"}) {
      id
      fields {
        key
        value
      }
    }
  }
`;

const VIDEO_SECTION_QUERY = `#graphql
  query VideoSection {
    metaobject(handle: {type: "video_section", handle: "video-section-obzyhio7"}) {
      id
      fields {
        key
        value
        reference {
          ... on Video {
            id
            sources {
              mimeType
              url
            }
            previewImage {
              url
            }
          }
          ... on MediaImage {
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_DETAILS_QUERY = `#graphql
  query ProductDetails {
    metaobject(handle: {type: "product_details", handle: "product-details-rlscerys"}) {
      id
      fields {
        key
        value
        reference {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

const TEXT_LOGO_SECTION_QUERY = `#graphql
  query TextLogoSection {
    metaobjects(type: "text_logo_section", first: 10) {
      edges {
        node {
          id
          fields {
            key
            value
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('react-router').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
