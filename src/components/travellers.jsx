import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
    const token = localStorage.getItem("token");

const TravellerOperations = () => {
  const [travellers, setTravellers] = useState([]);
  const [username, setUsername] = useState('');
  const [count, setCount] = useState(0);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [tourId, setTourId] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentTraveller, setCurrentTraveller] = useState(null);

  const fetchTravellers = async () => {
    try {
  const response = await fetch("http://localhost:3001/admin/traveller", {
    headers: {
    Authorization: `Bearer ${token}`,
  }
  });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setTravellers(data);
    } catch (error) {
      console.error('Error fetching travellers:', error);
    }
  };

  useEffect(() => {
    fetchTravellers();
  }, []);

  const handleCreate = async () => {
    try {
      const response = await fetch("http://localhost:3001/admin/traveller", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          count,
          phone,
          email,
          tour_id: tourId,
        }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      await response.json();
      fetchTravellers();
      setEditOpen(false);
      resetFields();
    } catch (error) {
      console.error('Error creating traveller:', error);
    }
  };

  const handleUpdate = async () => {
    if (!currentTraveller) return;

    try {
      const response = await fetch(
        `http://localhost:3001/admin/traveller/${currentTraveller.username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username,
            count,
            phone,
            email,
            tour_id: tourId,
          }),
        }
      );
      if (!response.ok) throw new Error('Network response was not ok');
      await response.json();
      fetchTravellers();
      setEditOpen(false);
    } catch (error) {
      console.error('Error updating traveller:', error);
    }
  };

  const handleDelete = async () => {
    if (!currentTraveller) return;

    try {
      // console.log(currentTraveller);
      const response = await fetch(
        `http://localhost:3001/admin/traveller/${currentTraveller.username}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ tour_id: currentTraveller.tour_id }),
        }
      );
      if (!response.ok) throw new Error('Network response was not ok');
      await response.json();
      fetchTravellers();
    } catch (error) {
      console.error('Error deleting traveller:', error);
    }
  };

  const openEditForm = (traveller) => {
    setCurrentTraveller(traveller);
    setUsername(traveller.username);
    setCount(traveller.count);
    setPhone(traveller.phone);
    setEmail(traveller.email);
    setTourId(traveller.tour_id);
    setIsCreating(false);
    setEditOpen(true);
  };

  const openCreateForm = () => {
    resetFields();
    setIsCreating(true);
    setEditOpen(true);
  };

  const resetFields = () => {
    setUsername('');
    setCount(0);
    setPhone('');
    setEmail('');
    setTourId('');
  };

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Button startIcon={<Add />} onClick={openCreateForm}>
            Create New Traveller
          </Button>
        </Grid>
      </Grid>

      <div>
        <h3>Manage Travellers</h3>
        <Grid container spacing={2}>
          {travellers.map((traveller) => (
            <Grid item xs={12} sm={6} md={4} key={traveller._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {traveller.username}
                  </Typography>
                  <Typography color="textSecondary">
                    <strong>Phone:</strong> {traveller.phone}
                  </Typography>
                  <Typography color="textSecondary">
                    <strong>Email:</strong> {traveller.email}
                  </Typography>
                  <Typography color="textSecondary">
                    <strong>Tour ID:</strong> {traveller.tour_id}
                  </Typography>
                  <Typography color="textSecondary">
                    <strong>Count:</strong> {traveller.count}
                  </Typography>

                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ marginTop: '10px' }}
                  >
                    <Grid item>
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => openEditForm(traveller)}
                      >
                        <Edit />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton
                        aria-label="delete"
                        color="secondary"
                        onClick={() => {
                          setCurrentTraveller(traveller);
                          handleDelete();
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>{isCreating ? 'Create Traveller' : 'Edit Traveller'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Count"
            type="number"
            fullWidth
            variant="outlined"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
          <TextField
            margin="dense"
            label="Phone"
            type="number"
            fullWidth
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Tour ID"
            fullWidth
            variant="outlined"
            value={tourId}
            disabled={!isCreating}
            onChange={(e) => setTourId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="primary">
            Cancel
          </Button>
          {isCreating ? (
            <Button onClick={handleCreate} color="primary">
              Create
            </Button>
          ) : (
            <Button onClick={handleUpdate} color="primary">
              Update
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TravellerOperations;
