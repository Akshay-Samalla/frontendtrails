import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import GradiousLogo from './gradious logo.png';
const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const isloggedin = user ? true : false
  const navigate = useNavigate()
  return (
    <AppBar
      position="sticky" // Make navbar fixed to the top
      sx={{
        backgroundColor: "rgba(211, 211, 211, 0.5)", // Semi-transparent white
        backdropFilter: "blur(10px)", // Blur effect for professional look
        boxShadow: "none", // Remove default shadow
        width: "100%",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Link to="/">
          <img
            src={GradiousLogo}
            alt="Gradious Travels Logo"
            style={{ height: "80px", width: "250px", marginRight: "20px" }}
          />
        </Link>

        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Navigation Links with hover effect */}
          <Button
            sx={{
              color: "white", // White inside
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)", // Black shadow effect
              fontWeight: "bold",
              transition: "color 0.3s, text-shadow 0.3s", // Smooth transition
              "&:hover": {
                background: "linear-gradient(90deg, #ff4b2b, #ff416c)",
                color: "black",
              },
            }}
            component={Link}
            to="/"
          >
            Home
          </Button>
          <Button
            sx={{
              color: "white",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
              fontWeight: "bold",
              transition: "color 0.3s, text-shadow 0.3s",
              "&:hover": {
                color: "black",
                background: "linear-gradient(90deg, #ff4b2b, #ff416c)",
              },
            }}
            component={Link}
            to="/about"
          >
            About
          </Button>
          <Button
            sx={{
              color: "white",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
              fontWeight: "bold",
              transition: "color 0.3s, text-shadow 0.3s",
              "&:hover": {
                color: "black",
                background: "linear-gradient(90deg, #ff4b2b, #ff416c)",
              },
            }}
            component={Link}
            to="/contact"
          >
            Contact
          </Button>
          {isloggedin ? (
            <>
              <Button
                sx={{
                  color: "white",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                  fontWeight: "bold",
                  transition: "color 0.3s, text-shadow 0.3s",
                  "&:hover": {
                    color: "black",
                    background: "linear-gradient(90deg, #ff4b2b, #ff416c)",
                  },
                }}
              >
                {user.username}
              </Button>
              <Button
                sx={{
                  color: "white",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                  fontWeight: "bold",
                  transition: "color 0.3s, text-shadow 0.3s",
                  "&:hover": {
                    color: "black",
                    background: "linear-gradient(90deg, #ff4b2b, #ff416c)",
                  },
                }}
                onClick={() => {
                  let user = JSON.parse(localStorage.getItem("user"));
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  if(user.usertype=== 'admin' || user.usertype === 'guide'){
                    navigate('/')
                  }
                  window.location.reload();
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              sx={{
                color: "white",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                fontWeight: "bold",
                transition: "color 0.3s, text-shadow 0.3s",
                "&:hover": {
                  color: "black",
                  background: "linear-gradient(90deg, #ff4b2b, #ff416c)",
                },
              }}
              component={Link}
              to="/login"
            >
              Login / Signup
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
