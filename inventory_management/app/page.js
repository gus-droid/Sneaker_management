'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button, Grid } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore";

const initialItems = [
  { name: 'nike-air-max', image: 'https://warsawsneakerstore.com/storage/media/f1000/2022/nike/212479/nike-air-max-97-og-silver-bullet-dm0028-002-636b690d5de4d.jpg' },
  { name: 'adidas-ultraboost', image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/bad84b99019d4386a67cd03ecc51c0a4_9366/ULTRABOOST_1.0_SHOES_Black_HQ4201_HM1.jpg' },
  { name: 'puma-suede', image: 'https://www.shopwss.com/cdn/shop/files/37491504_1.jpg?v=1715300448' },
  { name: 'new-balance-574', image: 'https://m.media-amazon.com/images/I/71-TrfZu4KL._AC_UY900_.jpg' },
  { name: 'reebok-classic', image: 'https://reebok.bynder.com/transform/c80308a1-5b46-4176-be34-33a48a8e0207/100007795_SLC_eCom-tif?io=transform:fit,width:500&quality=100' },
  // Add more items as needed
];

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState(initialItems);

  // Updating inventory from firebase
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    setFilteredItems(
      initialItems.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setSearch(e.target.value);
    }
  };

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex"
      flexDirection="column"
      justifyContent="center" 
      alignItems="center"
      gap={2}
      bgcolor="#1C1C1C"
      padding={4}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="#333"
          border="2px solid #fff"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Typography variant="h6" color="#fff">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
              InputProps={{
                style: {
                  color: 'white',
                  backgroundColor: '#555',
                  borderColor: 'white'
                }
              }}
              InputLabelProps={{
                style: { color: 'white' }
              }}
            />
            <Button
              variant="contained"
              style={{
                backgroundColor: '#28a745',
                color: '#fff'
              }}
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        style={{
          backgroundColor: '#28a745',
          color: '#fff'
        }}
        onClick={() => {
          handleOpen();
        }}
      >
        Add New Item
      </Button>
      <TextField
        variant="outlined"
        placeholder="Search for shoes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearch}
        InputProps={{
          style: {
            color: 'white',
            backgroundColor: '#333',
            borderColor: 'white'
          }
        }}
        InputLabelProps={{
          style: { color: 'white' }
        }}
        sx={{ margin: '20px 0', width: '50%' }}
      />
      <Grid container spacing={2} width="800px">
        {filteredItems.map(({ name, image }) => (
          <Grid item xs={12} sm={6} md={4} key={name}>
            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#444"
              padding={2}
              color="#fff"
              borderRadius={2}
            >
              <img src={image} alt={name} width="100px" height="100px" />
              <Typography variant="h6" color="#fff" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ')}
              </Typography>
              <Typography variant="body1" color="#fff" textAlign="center">
                {inventory.find(item => item.name === name)?.quantity || 0}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="contained" 
                  style={{
                    backgroundColor: '#28a745',
                    color: '#fff'
                  }}
                  onClick={() => {
                    addItem(name);
                  }}
                >
                  Add
                </Button>
                <Button 
                  variant="contained" 
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#fff'
                  }}
                  onClick={() => {
                    removeItem(name);
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
