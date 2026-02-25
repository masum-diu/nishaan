import { useState, useEffect } from 'react';
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
  Stack,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useCart } from '@/lib/CartContext';
import supabase from '@/lib/createClient';
import { useRouter } from 'next/router';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/products' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { cartCount } = useCart();
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

const drawer = (
  <Box sx={{ textAlign: "center", height: "100%" }}>
    
    {/* Logo */}
    <Typography
      variant="h6"
      sx={{
        my: 3,
        display: "flex",
        alignItems: "center",
        gap: 1,
        justifyContent: "center",
        fontWeight: "bold",
        color: "#2A6498",
      }}
    >
      Nishaan <VerifiedIcon fontSize="small" />
    </Typography>

    <Divider />

    {/* Navigation */}
    <List sx={{ mt: 1 }}>
      {navItems.map((item) => (
        <ListItem key={item.label} disablePadding>
          <ListItemButton
            component={Link}
            href={item.href}
            sx={{
              textAlign: "center",
              py: 1.5,
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>

    <Divider sx={{ my: 2 }} />

    {/* User Section */}
    <Box px={2}>
      {user ? (
        <Stack spacing={2} alignItems="center">
          
          {/* Profile Button */}
          <Button
            fullWidth
            variant="contained"
            startIcon={<AccountCircleIcon />}
            component={Link}
            href="/profile"
            sx={{ borderRadius: 2 }}
          >
            {user.email.split("@")[0]}
          </Button>

          {/* Optional Admin Link */}
          {user?.role === "admin" && (
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              href="/admin"
            >
              Admin Dashboard
            </Button>
          )}

          {/* Logout */}
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={handleLogout}
            sx={{ borderRadius: 2 }}
          >
            Logout
          </Button>
        </Stack>
      ) : (
        <Button
          fullWidth
          variant="contained"
          component={Link}
          href="/auth"
          sx={{ borderRadius: 2 }}
        >
          Login / Register
        </Button>
      )}
    </Box>
  </Box>
);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        component="nav"
        position="sticky"
        sx={{ bgcolor: 'var(--surface-color)', color: 'var(--text-color)', boxShadow: 'var(--box-shadow)' }}
      >
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
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              Nishaan <VerifiedIcon color="#2A6498" />
            </Typography>
            <IconButton component={Link} href="/cart" sx={{ mr: 1, color: 'var(--text-color)' ,display: { xs: 'block', md: 'none' } }}>
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  sx={{ color: 'var(--text-color)', textTransform: 'capitalize', outline: 'none' }}
                >
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

              {user ? (
                <>
                  <Button variant="contained" sx={{ mr: 1 }} startIcon={<AccountCircleIcon />} component={Link} href="/profile">
                    {user.email.split('@')[0]}
                  </Button>
                  <Button variant="outlined" color="error" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button component={Link} href="/auth" variant="contained" startIcon={<AccountCircleIcon />}>
                  Login / Register
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
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