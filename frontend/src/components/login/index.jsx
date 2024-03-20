import { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../utils/networkUtils";
import ErrorModal from "../../shared/ErrorModal";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: cornsilk;
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
`;

const LoginInContainer = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 40%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: floralwhite;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-size: 1rem;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const LoginButton = styled.button`
  background-color: #4caf50;
  color: #fff;
  padding: 10px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: ${({ email, password }) =>
    email && password ? "pointer" : "not-allowed"};
`;

const SignUpContainer = styled.p``;

const SignUpLink = styled.span`
  color: #561fe7;
  cursor: pointer;
  font-weight: 600;
`;

export default function LoginComponent() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (email && password) {
      try {
        const res = await loginUser({ email, password });
        if (res && res.data && res.data.ok && res.data.data) {
          const token = res.data.data;
          localStorage.setItem("jwtToken", token);
          navigate("/crawler");
        } else {
          setError(res.data.err);
        }
      } catch (err) {
        console.error("Login failed", err);
        setError("Something went wrong");
      }
    }
  };

  const closeErrorModal = () => {
    setError("");
  };

  return (
    <MainContainer>
      <Title>Login and lets start Crawling!</Title>
      <LoginInContainer>
        <FormField>
          <Label>Email</Label>
          <Input
            value={email}
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormField>
        <FormField>
          <Label>Password</Label>
          <Input
            value={password}
            type="text"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormField>
        <LoginButton
          email={email}
          password={password}
          disabled={email && password ? false : true}
          onClick={handleLogin}
        >
          Login
        </LoginButton>
      </LoginInContainer>
      <SignUpContainer>
        Don't have an account?{" "}
        <Link to="/signup">
          <SignUpLink>Signup</SignUpLink>
        </Link>
      </SignUpContainer>
      {error && <ErrorModal text={error} customAction={closeErrorModal} />}
    </MainContainer>
  );
}
