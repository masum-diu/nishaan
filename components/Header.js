import { useState } from 'react';
import Link from 'next/link';
import {
  AppBar,
  Box,
  Button,
  Container,
  Badge,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useCart } from '@/lib/CartContext';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/products' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount } = useCart();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 ,display: 'flex', alignItems: 'center', gap: 1,justifyContent:"center",fontWeight:"bold",color:"#2A6498"}}>
        Nishaan <VerifiedIcon/>
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} component={Link} href={item.href}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav" position="sticky" sx={{ bgcolor: 'var(--surface-color)', color: 'var(--text-color)', boxShadow: 'var(--box-shadow)' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component={Link}
              href="/"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                color: '#2A6498',
                textDecoration: 'none',
                display:"flex",
                alignItems:"center",
                gap:1
              }}
            >
              Nishaan <VerifiedIcon color='#2A6498'/>
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              {navItems.map((item) => (
                <Button key={item.label} component={Link} href={item.href} sx={{ color: 'var(--text-color)', textTransform: 'capitalize' ,outline:"none"}}>
                  {item.label}
                </Button>
              ))}
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, ml: 2 }}>
              <IconButton component={Link} href="/cart" sx={{ mr: 1, color: 'var(--text-color)' }}>
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <Button component={Link} href="/account" variant="contained" startIcon={<AccountCircleIcon />}>Account</Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Better open performance on mobile.
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default Header;