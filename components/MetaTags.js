import Head from 'next/head';

export default function MetaTags({ 
  title = 'Your Store', 
  description = 'Welcome to our online store',
  image = '/assets/og-image.jpg',
  url = 'https://yoursite.com'
}) {
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="keywords" content="online store, ecommerce, shopping" />
      <meta name="author" content="Your Store" />
      <link rel="canonical" href={url} />
    </Head>
  );
}
