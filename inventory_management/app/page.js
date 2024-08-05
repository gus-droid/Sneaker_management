'use client'
import {useState, useEffect} from 'react';
import {firestore} from '@/firebase';
import {Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import {collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  // Updating inventory from firebase
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=> {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  useEffect(()=>{
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex"
      flexDirection="column"
      justifyContent="center" 
      alignItems="center"
      gap={2}
      bgcolor="#1C1C1C"  // Lighter black background
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
                setItemName(e.target.value)
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
                addItem(itemName)
                setItemName('')
                handleClose()
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
          handleOpen()
        }}
      >
        Add New Item
      </Button>
      <Box border="1px solid #fff">
        <Box 
          width="800px" 
          height="100px" 
          bgcolor="#333"  // Dark gray background for the header
          display="flex" 
          alignItems="center" 
          justifyContent="center"
        >
          <Typography variant="h2" color="#fff">
            Inventory Items
          </Typography>
        </Box>
      
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {inventory.map(({name, quantity}) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#444"  // Slightly lighter gray for items
              padding={5}
              color="#fff"
            >
              <Typography variant="h3" color="#fff" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#fff" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="contained" 
                  style={{
                    backgroundColor: '#28a745',
                    color: '#fff'
                  }}
                  onClick={() => {
                    addItem(name)
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
                    removeItem(name)
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
