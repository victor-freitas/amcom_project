import React, { useState, useRef, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { text: 'Vendas', icon: <StorefrontIcon /> },
  { text: 'Comissões', icon: <AttachMoneyIcon /> },
];

function ToolbarComponent() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('Menu');
  const mainContentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mainContentRef.current && !mainContentRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleMenuItemClick = (text) => {
    setSelectedMenuItem(text);
    setOpen(false);
    if (text === 'Vendas') {
      navigate('/list-sales');
    } else {
      navigate('/comission');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <h2>{selectedMenuItem}</h2>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
        open={open}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleMenuItemClick(item.text)}
              selected={selectedMenuItem === item.text}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main
        style={{ flexGrow: 1, padding: '20px', marginTop: '64px' }}
        ref={mainContentRef}
      >
      </main>
    </div>
  );
}

export default ToolbarComponent;
