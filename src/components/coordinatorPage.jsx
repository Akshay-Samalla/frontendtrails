import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
  Button,
  Grid,
  CardMedia,
  Avatar,
  Chip,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";

const CoordinatorPage = () => {
  const navigate = useNavigate();
  const [coordinators, setCoordinators] = useState([]);
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const coordinatorResponse = await fetch(
          `http://localhost:3001/guide/guide/${user.username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const coordinatorsData = await coordinatorResponse.json();
        setCoordinators(coordinatorsData || []);

        const toursResponse = await fetch(
          `http://localhost:3001/guide/tour/${user.username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const toursData = await toursResponse.json();
        setTours(toursData?.map((tour) => tour.details) || []);

        const bookingsResponse = await fetch(
          `http://localhost:3001/guide/travellers/${user.username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
      console.log()
    };

    fetchData();
  }, []);

  const findTourById = (tourId) => {
    return tours.find((tour) => tour.tourId === tourId);
  };

  const findBookingsByTourId = (tourId) => {
    return bookings.filter((booking) => booking.tour_id === tourId);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center" color="primary">
        Coordinators & Their Tours
      </Typography>

      {coordinators.length > 0 ? (
        <Grid container spacing={4}>
          {coordinators.map((coordinator) => (
            <Grid item xs={12} md={6} lg={4} key={coordinator.guide_id}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 2 }}>{coordinator.username[0]}</Avatar>
                    <Typography variant="h5" color="primary">
                      {coordinator.username}
                    </Typography>
                  </Box>
                  <Typography variant="body1" gutterBottom>
                    Email: {coordinator.email}
                  </Typography>
                  <Divider />
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ marginTop: 2 }}
                  >
                    Assigned Tours:
                  </Typography>

                  {coordinator.tours?.assigned_tours?.length > 0 ? (
                    coordinator.tours.assigned_tours.map((tourId) => {
                      const tour = findTourById(tourId);

                      return tour ? (
                        <Box key={tour.tourId} sx={{ marginBottom: 4 }}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            color="textSecondary"
                          >
                            Tour: {tour.tourname} ({tour.location})
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
                          <Typography variant="body2" gutterBottom>
                            Rating: {tour.rating}/10 | Cost: ₹{tour.cost} |
                            Duration: {tour.timespent}
                          </Typography>
                          <Typography
                            variant="h6"
                            gutterBottom
                            color="textSecondary"
                          >
                            Start: ({tour.starting_date})
                          </Typography>
                          <Typography
                            variant="h6"
                            gutterBottom
                            color="textSecondary"
                          >
                            Time: ({tour.starting_time})
                          </Typography>
                          <Typography
                            variant="h6"
                            gutterBottom
                            color="textSecondary"
                          >
                            Return: ({tour.return_time})
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                              navigate(`/booking?tourid=${tour.tourId}`)
                            }
                          >
                            TourId: ({tour.tourId})
                          </Button>
                          <List>
                            {tour.included.map((item, index) => (
                              <ListItem key={index}>
                                <ListItemText primary={item} />
                              </ListItem>
                            ))}
                          </List>

                          <Typography
                            variant="h6"
                            color="primary"
                            sx={{ marginTop: 2 }}
                          >
                            Tour Stops:
                          </Typography>
                          {tour.stops.map((stopGroup, groupIndex) => (
                            <Box key={groupIndex} sx={{ marginBottom: 2 }}>
                              {stopGroup.map((stop, stopIndex) => (
                                <Card key={stopIndex} sx={{ marginBottom: 2 }}>
                                  <CardMedia
                                    component="img"
                                    height="140"
                                    image={stop.image}
                                    alt={stop.loc}
                                  />
                                  <CardContent>
                                    <Typography variant="h6">
                                      {stop.loc}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      {stop.notes}
                                    </Typography>
                                    <Typography variant="body2">
                                      Duration: {stop.duration}
                                    </Typography>
                                    <Box>
                                      {stop.pros.map((pro, proIndex) => (
                                        <Chip
                                          key={proIndex}
                                          label={pro}
                                          sx={{ marginRight: 1, marginTop: 1 }}
                                        />
                                      ))}
                                    </Box>
                                  </CardContent>
                                </Card>
                              ))}
                            </Box>
                          ))}

                          <Typography
                            variant="h6"
                            color="primary"
                            sx={{ marginTop: 2 }}
                          >
                            Traveler Bookings:
                          </Typography>
                          {findBookingsByTourId(tourId).length === 0 ? (
                            <Typography variant="body1" color="textSecondary">
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
                                    Phone: {booking.phone} | Total Travelers:{" "}
                                    {booking.count}
                                  </Typography>
                                </Box>
                              )
                            )
                          )}
                        </Box>
                      ) : (
                        <Typography key={tourId} variant="body1" color="error">
                          No tour found for this ID.
                        </Typography>
                      );
                    })
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      No assigned tours.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No coordinators available.
        </Typography>
      )}
    </Box>
  );
};

export default CoordinatorPage;
