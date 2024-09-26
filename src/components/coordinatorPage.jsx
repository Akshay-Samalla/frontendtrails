import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Button,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  Skeleton, // Import Skeleton
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import CloseIcon from "@mui/icons-material/Close";
import Navbar from "./Navbar";
import Footer from "./Footer";

const CoordinatorPage = () => {
  const navigate = useNavigate();
  const [coordinators, setCoordinators] = useState([]);
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [coordinatorResponse, toursResponse, bookingsResponse] =
          await Promise.all([
            fetch(`http://localhost:3001/guide/guide/${user.username}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch(`http://localhost:3001/guide/tour/${user.username}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch(`http://localhost:3001/guide/travellers/${user.username}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        if (
          !coordinatorResponse.ok ||
          !toursResponse.ok ||
          !bookingsResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const coordinatorsData = await coordinatorResponse.json();
        const toursData = await toursResponse.json();
        const bookingsData = await bookingsResponse.json();

        setCoordinators(coordinatorsData || []);
        setTours(toursData?.map((tour) => tour.details) || []);
        setBookings(bookingsData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const findTourById = (tourId) => tours.find((tour) => tour.tourid === tourId);

  const findBookingsByTourId = (tourId) =>
    bookings.filter((booking) => booking.tour_id === tourId);

  const handleTourClick = (tour) => setSelectedTour(tour);

  const handleCloseModal = () => setSelectedTour(null);

  // Skeleton loading UI
  if (loading) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          color="primary"
        >
          Coordinator's Profile & Tours
        </Typography>
        <Grid container spacing={4}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ boxShadow: 3, marginBottom: 4 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box ml={2}>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="80%" />
                    </Box>
                  </Box>
                  <Skeleton variant="text" width="40%" />
                </CardContent>
              </Card>
              <Divider sx={{ marginY: 2 }} />
              <Typography variant="h6" color="primary">
                Assigned Tours:
              </Typography>
              <Skeleton variant="text" width="50%" />
              <Grid container spacing={4}>
                {[...Array(2)].map((_, tourIndex) => (
                  <Grid item xs={12} md={6} key={tourIndex}>
                    <Card sx={{ boxShadow: 3 }}>
                      <CardContent>
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="60%" />
                        <Carousel>
                          <Skeleton variant="rectangular" height={140} />
                        </Carousel>
                        <Skeleton variant="rectangular" height={40} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Error message
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Navbar />
      <Box sx={{ padding: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          color="primary"
        >
          Coordinator's Profile & Tours
        </Typography>

        {coordinators.length > 0 ? (
          <Grid container spacing={4}>
            {coordinators.map((coordinator) => (
              <Grid item xs={12} key={coordinator.guide_id}>
                <Card sx={{ boxShadow: 3, marginBottom: 4 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ mr: 2 }}>{coordinator.username[0]}</Avatar>
                      <Box>
                        <Typography variant="h5" color="primary">
                          {coordinator.username}
                        </Typography>
                        <Typography variant="body1">
                          Email: {coordinator.email}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                <Divider sx={{ marginY: 2 }} />

                <Typography variant="h6" color="primary">
                  Assigned Tours:
                </Typography>

                <Grid container spacing={4}>
                  {coordinator.tours?.assigned_tours?.length > 0 ? (
                    coordinator.tours.assigned_tours.map((tourId) => {
                      const tour = findTourById(tourId);

                      return tour ? (
                        <Grid item xs={12} md={6} key={tour.tourid}>
                          <Card sx={{ boxShadow: 3 }}>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                Tour: {tour.tourname} - {tour.location}
                              </Typography>

                              <Typography variant="body2">
                                <strong>Start Date:</strong>{" "}
                                {tour?.starting_date || "N/A"}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Start Time:</strong>{" "}
                                {tour?.starting_time || "N/A"}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Return Time:</strong>{" "}
                                {tour?.return_time || "N/A"}
                              </Typography>

                              <Carousel>
                                {tour.carousel.map((image, index) => (
                                  <CardMedia
                                    key={index}
                                    component="img"
                                    height="140"
                                    image={image}
                                    alt={`Tour image ${index + 1}`}
                                  />
                                ))}
                              </Carousel>

                              <Button
                                variant="contained"
                                color="primary"
                                sx={{ marginTop: 2 }}
                                onClick={() => handleTourClick(tour)}
                              >
                                View Details
                              </Button>

                              <Typography
                                variant="h6"
                                color="primary"
                                sx={{ marginTop: 2 }}
                              >
                                Traveler Bookings:
                              </Typography>

                              {findBookingsByTourId(tourId).length === 0 ? (
                                <Typography
                                  variant="body1"
                                  color="textSecondary"
                                >
                                  No bookings available.
                                </Typography>
                              ) : (
                                findBookingsByTourId(tourId).map(
                                  (booking, index) => (
                                    <Box key={index} sx={{ padding: 2 }}>
                                      <Typography variant="body1">
                                        Traveler: {booking.username} (
                                        {booking.email})
                                      </Typography>
                                      <Typography variant="body2">
                                        Phone: {booking.phone} | Total
                                        Travelers: {booking.count}
                                      </Typography>
                                    </Box>
                                  )
                                )
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ) : (
                        <Typography key={tourId} variant="body1" color="error">
                          No tour found for this ID.
                        </Typography>
                      );
                    })
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      No tours assigned.
                    </Typography>
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No coordinators found.
          </Typography>
        )}

        {/* Tour Details Modal */}
        <Dialog open={Boolean(selectedTour)} onClose={handleCloseModal}>
          <DialogTitle>
            Tour Details
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedTour && (
              <>
                <Typography variant="h6">
                  {selectedTour.tourname} - {selectedTour.location}
                </Typography>
                <Typography variant="body2">
                  <strong>Start Date:</strong> {selectedTour.starting_date}
                </Typography>
                <Typography variant="body2">
                  <strong>Return Time:</strong> {selectedTour.return_time}
                </Typography>
                <Carousel>
                  {selectedTour.carousel.map((image, index) => (
                    <CardMedia
                      key={index}
                      component="img"
                      height="140"
                      image={image}
                      alt={`Tour image ${index + 1}`}
                    />
                  ))}
                </Carousel>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Footer />
    </>
  );
};

export default CoordinatorPage;
