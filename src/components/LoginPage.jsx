import React, { useEffect, useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaUserTie } from "react-icons/fa"; // Importing icons
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false); // State for terms checkbox
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usertype, setUsertype] = useState("user");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const termsAcceptedfromStorage = localStorage.getItem("acceptedTerms");
    if (termsAcceptedfromStorage === "true") {
      setTermsAccepted(true);
    }
  }, []);

  const toggleForm = () => {
    setIsSignup(!isSignup);
  };

  const handleCheckboxChange = (e) => {
    setTermsAccepted(e.target.checked);
    localStorage.setItem("acceptedTerms", e.target.checked ? "true" : "false");
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents form submission
    if (!termsAccepted) {
      alert("Please accept the terms and conditions to proceed.");
      return;
    }
    // Proceed with form submission if checkbox is checked
    console.log({
      username,
      email,
      password,
      usertype,
    });
    alert(isSignup ? "Sign Up Successful" : "Sign In Successful");

    if (isSignup) {
      fetch("http://localhost:3001/login/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      }).then((res) => {
        if (res.ok) {
          alert("Sign Up Successful");
          setIsSignup(false);
        }
      });
    } else if (!isSignup) {
      console.log("login");
      fetch("http://localhost:3001/login/", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
          usertype: usertype,
          email: email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          const user = JSON.stringify(data.user);
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", user);
          if (usertype === "user") {
            navigate("/");
          } else if (usertype === "guide") {
            navigate("/coordinator");
          } else if (usertype === "admin") {
            navigate("/admin");
          }
        });
    }
  };

  return (
    <div className="login-signup-container">
      <video autoPlay loop muted className="background-video">
        <source
          src="https://videos.pexels.com/video-files/8318649/8318649-uhd_2560_1440_25fps.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className={`form-container ${isSignup ? "signup-mode" : ""}`}>
        <div className="left-content">
          {isSignup ? (
            <div>
              <img
                src="https://tse4.mm.bing.net/th?id=OIP.0f0cne9SBE_xoOC3cO2M3QHaHa&pid=Api&P=0&h=180"
                alt="Gradious Travels Logo"
                className="logo"
              />
              <h2>Join Gradious Travels</h2>
              <p>Welcome! Let's get started on your adventure.</p>
            </div>
          ) : (
            <div>
              <img
                src="https://tse4.mm.bing.net/th?id=OIP.0f0cne9SBE_xoOC3cO2M3QHaHa&pid=Api&P=0&h=180"
                alt="Gradious Travels Logo"
                className="logo"
              />
              <h2>Welcome Back to Gradious Travels</h2>
              <p>
                Let's continue exploring the world! Login to your account and
                resume your journey.
              </p>
            </div>
          )}
        </div>

        <div className="right-form">
          <form onSubmit={handleSubmit}>
            <h2>{isSignup ? "Sign Up" : "Sign In"}</h2>

            {/* Username input only for Sign Up */}
            {isSignup && (
              <div className="input-group">
                <FaUser className="icon" />
                <input
                  type="text"
                  name="username"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required={isSignup}
                  className="input-field"
                />
              </div>
            )}

            <div className="input-group">
              <FaEnvelope className="icon" />
              <input
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="input-field"
              />
            </div>

            <div className="input-group">
              <FaLock className="icon" />
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
                placeholder="Password"
                required
                className="input-field"
              />
            </div>

            {!isSignup && (
              <div className="input-group">
                <FaUserTie className="icon" />
                <select
                  name="usertype"
                  onChange={(e) => {
                    setUsertype(e.target.value);
                  }}
                  className="input-field select-field"
                  required
                  defaultValue="user"
                >
                  <option value="admin">Admin</option>
                  <option value="guide">Guide</option>
                  <option value="user">User</option>
                </select>
              </div>
            )}

            {isSignup && (
              <div className="input-group">
                <FaLock className="icon" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
            )}

            {/* Terms and Conditions Checkbox */}
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                onChange={handleCheckboxChange}
                checked={termsAccepted}
              />
              <label htmlFor="terms">
                I accept the <a href="/terms">Terms and Conditions</a>
              </label>
            </div>

            <button type="submit" className="submit-btn">
              {isSignup ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <div className="switch-link">
            {isSignup ? (
              <p>
                Already have an account?{" "}
                <span onClick={toggleForm}>Sign In</span>
              </p>
            ) : (
              <p>
                New to Gradious Travels?{" "}
                <span onClick={toggleForm}>Sign Up</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx="true">{`
        /* Background video styling */
        .background-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -1;
        }

        /* Container for login/signup */
        .login-signup-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          position: relative;
        }

        /* Form container */
        .form-container {
          width: 70%;
          height: 580px;
          display: flex;
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          position: relative;
          transition: all 0.5s ease;
        }

        /* Left content (image, text) */
        .left-content {
          width: 50%;
          padding: 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(to right, #3a7bd5, #3a6073);
          color: #fff;
          text-align: center;
        }

        .left-content h2 {
          margin: 20px 0;
        }

        .left-content p {
          font-size: 16px;
        }

        .logo {
          max-width: 100px;
          margin-bottom: 20px;
        }

        /* Right form */
        .right-form {
          width: 50%;
          padding: 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .right-form h2 {
          margin-bottom: 30px;
        }

        .input-group {
          position: relative;
          margin-bottom: 20px;
          width: 90%; /* Reduced width to avoid overflow */
        }

        .icon {
          position: absolute;
          top: 35%; /* Moved icon slightly upward to better align with field */
          transform: translateY(-50%);
          left: 10px;
          font-size: 1.2em;
          color: #888;
        }

        .input-field {
          width: 100%;
          padding: 10px 10px 10px 40px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 15px; /* Increased border radius */
          font-size: 1em;
          box-sizing: border-box;
        }

        .select-field {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }

        .checkbox-group {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
        }

        .checkbox-group label {
          margin-left: 8px;
        }

        .right-form button {
          width: 90%; /* Adjusted width to prevent overflow */
          padding: 10px;
          background-color: #3a7bd5;
          border: none;
          color: white;
          cursor: pointer;
          border-radius: 15px; /* Increased border radius */
          font-size: 1em;
          margin-top: 10px;
        }

        .right-form button:hover {
          background-color: #3a6073;
        }

        .switch-link {
          margin-top: 20px;
          text-align: center;
        }

        .switch-link p {
          cursor: pointer;
          color: #2832c2;
        }

        .switch-link p span:hover {
          color: #3a6073;
        }

        /* Signup Mode */
        .signup-mode .left-content {
          order: 2;
        }

        .signup-mode .right-form {
          order: 1;
        }

        /* Responsiveness for smaller screens */
        @media screen and (max-width: 768px) {
          .form-container {
            flex-direction: column;
            height: auto;
            width: 95%;
            max-height: 90vh;
            overflow: auto;
            margin: auto;
          }

          .left-content {
            width: 100%;
            padding: 20px;
          }

          .right-form {
            width: 100%;
            padding: 20px;
          }

          .input-field,
          .submit-btn {
            width: 100%;
          }

          /* Additional styles to maintain focus on content */
          .login-signup-container {
            justify-content: center;
            align-items: center;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
