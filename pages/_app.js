import Layout from '../components/Layout';
import '../styles/globals.css';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/lib/theme';
import { CartProvider } from '../lib/CartContext';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const noLayout = router.pathname.startsWith('/admin');

  return (
    <CartProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {noLayout ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </ThemeProvider>
    </CartProvider>
  );
}

export default MyApp;