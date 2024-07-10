import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Frame, Button, Appear, Paragraph } from "arwes";
import Centered from "../components/Centered";

const SignupLogin = () => {
  const history = useHistory();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggleSignup = () => setIsSignup(!isSignup);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    if (isSignup) {
      // Signup logic
    } else {
      // Login logic
    }
  };

  const handleForgotPassword = () => {
    // Forgot password logic
  };

  return (
    <Centered>
      <Frame animate level={3} corners={4} layer="primary">
        <Appear animate show>
          <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
            <form onSubmit={handleSubmit}>
              <Paragraph>{isSignup ? "Sign Up" : "Login"}</Paragraph>
              <label htmlFor="email">Email</label>
              <Frame animate level={1} corners={3} layer="secondary">
                <input
                  type="email"
                  id="email"
                  required
                  style={{ width: "100%", padding: "10px", border: "none", borderRadius: "5px", marginTop: "5px", marginBottom: "10px" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Frame>
              <label htmlFor="password">Password</label>
              <Frame animate level={1} corners={3} layer="secondary">
                <input
                  type="password"
                  id="password"
                  required
                  style={{ width: "100%", padding: "10px", border: "none", borderRadius: "5px", marginTop: "5px", marginBottom: "10px" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Frame>
              {isSignup && (
                <>
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <Frame animate level={1} corners={3} layer="secondary">
                    <input
                      type="password"
                      id="confirm-password"
                      required
                      style={{ width: "100%", padding: "10px", border: "none", borderRadius: "5px", marginTop: "5px", marginBottom: "10px" }}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Frame>
                </>
              )}
              <Button animate type="submit" layer="success">
                {isSignup ? "Sign Up" : "Login"}
              </Button>
              {!isSignup && (
                <Button
                  animate
                  type="button"
                  layer="alert"
                  onClick={handleForgotPassword}
                  style={{ marginLeft: "10px" }}
                >
                  Forgot Password?
                </Button>
              )}
              <Button
                animate
                type="button"
                layer="secondary"
                onClick={toggleSignup}
              >
                {isSignup ? "Have an account? Login" : "Need an account? Sign Up"}
              </Button>
            </form>
          </div>
        </Appear>
      </Frame>
    </Centered>
  );
};

export default SignupLogin;
