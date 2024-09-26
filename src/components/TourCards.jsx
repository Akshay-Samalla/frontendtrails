// src/components/TourCards.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Chip, Box, Container } from "@mui/material";
import Carousel from "react-material-ui-carousel";
// import tour from "./tours.json";

const TourCards = () => {
  const [tours, setTours] = useState([]);
  const [rtours , setRtours] = useState([]);
  const [ptours , setPtours] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/user/tours' , {method: 'GET'} , {headers: {'Content-Type': 'application/json'}}).then(res => res.json()).then(data=>{
      console.log(data)
      const tour = data.map((tour)=> { 
        return tour.details
        
    })
    setTours(tour);
    })
    fetch('http://localhost:3001/user/tours/highlyrecommended', {method: 'GET'} , {headers: {'Content-Type': 'application/json'}}).then(res => res.json()).then(data=>{
      console.log(data)
      const tour = data.map((tour)=> {
        return tour.details
    })
    setRtours(tour);
    })
    fetch('http://localhost:3001/user/tours/popular', {method: 'GET'} , {headers: {'Content-Type': 'application/json'}}).then(res => res.json()).then(data=>{
      console.log(data)
      const tour = data.map((tour)=> {
        return tour.details
    })
    setPtours(tour);
    })



     // Use the same data for all cards for now
  }, []);

  const handleCardClick = (tourid) => {
    navigate(`/booking?tourid=${tourid}`);
  };

  const renderCarouselCards = (wtours) => (
    wtours.map((tour) => (
      <Card key={tour.tourid} onClick={() => handleCardClick(tour.tourid)} sx={{ cursor: "pointer", width: "100%", mx: 1 }}>
        <CardContent>
          <Typography variant="h5">{tour.tourname}</Typography>
          <Typography variant="body2" color="text.secondary">
            Duration: {tour.timespent}
          </Typography>
          <Box mt={2}>
            <Chip label={`Price: ₹${tour.cost}`} color="primary" />
          </Box>
          <Box
            mt={2}
            sx={{
              overflow: "hidden",
              height: 200,
              width: "300px",
            }}
          >
            <img
              src={tour.carousel[0]}
              alt={tour.tourname}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </Box>
        </CardContent>
      </Card>
    ))
  );

  const carouselSettings = {
    autoPlay: true,
    infinite:true,
    animation: "slide",
    indicators: false,
    interval: 2000,
    cycleNavigation: true,
    navButtonsAlwaysVisible: true,
    slidesToshow:3,
    navButtonsProps: {
      style: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "white",
      },
    },
  };

  return (
    <Container>
      {/* Highly Recommended Section */}
      <Box sx={{ my: 5 }}>
        <Typography variant="h4" gutterBottom>Highly Recommended</Typography>
        <Carousel {...carouselSettings}>
          {Array.from({ length: 2 }, (_, i) => (
            <Box key={i} sx={{ display: "flex", justifyContent: "space-around" }}>
              {renderCarouselCards(rtours).slice(i * 3, i * 3 + 3)}
            </Box>
          ))}
        </Carousel>
      </Box>

      {/* Popular Destinations Section */}
      <Box sx={{ my: 5 }}>
        <Typography variant="h4" gutterBottom>Popular Destinations</Typography>
        <Carousel {...carouselSettings}>
          {Array.from({ length: 2 }, (_, i) => (
            <Box key={i} sx={{ display: "flex", justifyContent: "space-around" }}>
              {renderCarouselCards(ptours).slice(i * 3, i * 3 + 3)}
            </Box>
          ))}
        </Carousel>
      </Box>

      {/* All Trips Section */}
      <Box sx={{ my: 5 }}>
        <Typography variant="h4" gutterBottom>All Trips</Typography>
        <Carousel {...carouselSettings}>
          {Array.from({ length: parseInt(tours.length / 3)+1  }, (_, i) => (
            <Box key={i} sx={{ display: "flex", justifyContent: "space-around" }}>
              {renderCarouselCards(tours).slice(i * 3, i * 3 + 3)}
            </Box>
          ))}
        </Carousel>
      </Box>
    </Container>
  );
};

export default TourCards;