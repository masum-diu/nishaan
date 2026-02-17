import Link from 'next/link';
import styles from '../styles/Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          eCommerce
        </Link>
        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="/products">All Products</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
        </nav>
        <div className={styles.userActions}>
          <Link href="/cart">Cart</Link>
          <Link href="/account">Account</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;