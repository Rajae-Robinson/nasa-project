import React, { useState } from "react";
import { Frame, Button, Appear, Paragraph } from "arwes";
import Centered from "../components/Centered";
import { httpForgotPassword } from "../hooks/requests";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await httpForgotPassword({email})

    if (response.ok) {
      setMessage("A reset link has been sent to your email address.");
    } else {
      setMessage("There was an error sending the reset link. Please try again.");
    }
  };

  return (
    <Centered>
      <Frame animate level={3} corners={4} layer="primary">
        <Appear animate show>
          <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
            <form onSubmit={handleSubmit}>
              <Paragraph>Forgot Password</Paragraph>
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
              <Button animate type="submit" layer="success">
                Send Reset Link
              </Button>
              {message && <Paragraph>{message}</Paragraph>}
            </form>
          </div>
        </Appear>
      </Frame>
    </Centered>
  );
};

export default ForgotPassword;
