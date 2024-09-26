import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Divider from "@mui/material/Divider";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  TextField,
  Button,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import DirectionsTransitIcon from "@mui/icons-material/DirectionsTransit";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import TempleBuddhistIcon from "@mui/icons-material/TempleBuddhist";
import NaturePeopleIcon from "@mui/icons-material/NaturePeople";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import SpaIcon from "@mui/icons-material/Spa";

// Icons mapping
const iconsMapping = {
  train: <DirectionsTransitIcon />,
  beach: <BeachAccessIcon />,
  breakfast: <RestaurantIcon />,
  temple: <TempleBuddhistIcon />,
  nature: <NaturePeopleIcon />,
  sunset: <WbSunnyIcon />,
  meditation: <SpaIcon />,
};

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const BookingDetails = () => {
  const [bookingData, setBookingData] = useState([]);
  const navigate = useNavigate()
  const query = useQuery();
  const tourid = query.get("tourid");
  const token = localStorage.getItem('token')
  console.log(token)
  const [tour, setTour] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    count: 1,
  });

  // Fetch tours data
  useEffect(() => {
    fetch("http://localhost:3001/user/tours", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        const tur = data.map((e) => e.details);
        setBookingData([...tur]);
      })
      .catch((error) => {
        console.error("Error fetching tours:", error);
      });
  }, []);

  // Find and set the selected tour
  useEffect(() => {
    if (bookingData.length > 0) {
      const selectedTour = bookingData.find((tour) => tour.tourid == tourid);
      setTour(selectedTour);
    }
  }, [bookingData, tourid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking Details:", formData);
    // Add your form submission logic here
  };

  if (!tour) {
    return <Typography variant="h5">Loading........</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // Make the container span the full viewport height
      }}
    >
      <Navbar />

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="md" sx={{ marginTop: 5 }}>
          <Card sx={{ padding: 2, boxShadow: 3 }}>
            <Carousel>
              {tour.carousel.map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image}
                  alt={`carousel-${index}`}
                  sx={{
                    width: "100%",
                    height: "400px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
              ))}
            </Carousel>

            <CardContent>
              <Typography
                variant="h4"
                gutterBottom
                textAlign="center"
                color="primary"
              >
                {tour.tourname}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h6" color="textSecondary">
                    Location: {tour.location}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Duration: {tour.timespent}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Rating: {tour.rating} / 10
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h5" color="primary" align="right">
                    Cost: ₹{tour.cost}
                  </Typography>
                  <Typography variant="body1" align="right">
                    Starting: {tour.starting_date}, {tour.starting_time}
                  </Typography>
                  <Typography variant="body1" align="right">
                    Return: {tour.return_time}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
                Included:
              </Typography>
              <List>
                {tour.included.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
              {/* Divider added here */}
              <Divider sx={{ marginY: 4 }} />
              <Box sx={{ borderBottom: "2px solid #ccc", my: 3 }} />
              <Typography
                variant="h5"
                gutterBottom
                sx={{ marginTop: 4, textAlign: "center" }}
              >
                Trip Schedule
              </Typography>

              <Box
                sx={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  paddingRight: 2,
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#ccc",
                    borderRadius: "10px",
                  },
                }}
              >
                {tour.stops.map((day, dayIndex) => (
                  <Box key={dayIndex} sx={{ marginTop: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Day {dayIndex + 1} Stops:
                    </Typography>
                    {Object.values(day)
                      .flat()
                      .map((stop, index) => (
                        <Card
                          key={index}
                          sx={{ marginBottom: 3, boxShadow: 2 }}
                        >
                          <CardContent>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={4}>
                                <Box
                                  component="img"
                                  src={stop.image}
                                  alt={stop.loc}
                                  sx={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "cover",
                                    borderRadius: "5px",
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <Typography variant="h6" gutterBottom>
                                  {stop.loc}
                                </Typography>
                                <Typography
                                  variant="body1"
                                  color="textSecondary"
                                  paragraph
                                >
                                  {stop.notes}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Duration: {stop.duration}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  gutterBottom
                                >
                                  Pros:
                                </Typography>
                                <Box display="flex" flexWrap="wrap">
                                  {stop.pros.map((pro, index) => (
                                    <Chip
                                      key={index}
                                      icon={iconsMapping[pro] || null}
                                      label={pro}
                                      sx={{ margin: 0.5 }}
                                      color="primary"
                                      variant="outlined"
                                    />
                                  ))}
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      ))}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Separate Booking Form Section */}
          {token !== null ? (
            <Card sx={{ marginTop: 4, padding: 2, boxShadow: 3 }}>
              <Typography variant="h5" align="center">
                Booking Information
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ marginTop: 3, textAlign: "center" }}
              >
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  label="People Count"
                  name="count"
                  type="number"
                  value={formData.count}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    if (!localStorage.getItem("token")) {
                      alert("login");
                      navigate("/login");
                      return;
                    }
                    fetch(`http://localhost:3001/user/tour/${tourid}`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                      body: JSON.stringify({
                        username: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        count: formData.count,
                        tour_id: tourid,
                      }),
                    })
                      .then((res) => {
                        if (res.ok) {
                          alert("booking ok");
                        }
                      })
                      .catch(() => {
                        alert("error booking");
                      });
                  }}
                >
                  Book Now
                </Button>
              </Box>
            </Card>
          ) : (
            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{
                padding: 2,
                backgroundColor: "#f0f0f0",
                borderRadius: 2,
                color: "#333",
                boxShadow: 3,
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
            >
              Please Login to Book
            </Button>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default BookingDetails;
