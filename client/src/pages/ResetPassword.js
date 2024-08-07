import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Frame, Button, Appear, Paragraph } from "arwes";
import Centered from "../components/Centered";
import { useParams } from "react-router-dom";
import { httpResetPassword } from "../hooks/requests";
import { useAuth } from '../context/authContext';

const ResetPassword = () => {
  const history = useHistory();
  const { token } = useParams();
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setMessage("Passwords do not match.");
      return;
    }

    const response = await httpResetPassword({token, password, passwordConfirm})

    if (response.status === "success") {
      setMessage("Your password has been reset successfully.");
      login(response.jwtToken)
      history.push("/");
    } else {
      setMessage(response.message);
    }
  };

  return (
    <Centered>
      <Frame animate level={3} corners={4} layer="primary">
        <Appear animate show>
          <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
            <form onSubmit={handleSubmit}>
              <Paragraph>Reset Password</Paragraph>
              <label htmlFor="password">New Password</label>
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
              <label htmlFor="confirm-password">Confirm New Password</label>
              <Frame animate level={1} corners={3} layer="secondary">
                <input
                  type="password"
                  id="confirm-password"
                  required
                  style={{ width: "100%", padding: "10px", border: "none", borderRadius: "5px", marginTop: "5px", marginBottom: "10px" }}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </Frame>
              <Button animate type="submit" layer="success">
                Reset Password
              </Button>
              {message && <Paragraph>{message}</Paragraph>}
            </form>
          </div>
        </Appear>
      </Frame>
    </Centered>
  );
};

export default ResetPassword;
