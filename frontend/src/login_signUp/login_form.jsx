import { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getStudents } from "../mainPage/studentData.js";

function LoginForm({ switchToSignUp }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ Automatically redirect if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      navigate("/main-page");
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    const students = getStudents();
    const user = students.find(
      (s) => s.email === email && s.password === password
    );

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/main-page");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <Container
      className="login-form p-4 shadow rounded"
      style={{ maxWidth: "400px" }}
    >
      <h2 className="mb-4 text-center">Welcome Back</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleLogin}>
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Log In
        </Button>
      </Form>

      <p className="mt-3 text-center small text-muted">
        Don’t have an account?{" "}
        <span
          onClick={switchToSignUp}
          style={{ color: "#0d6efd", cursor: "pointer" }}
        >
          Sign up
        </span>
      </p>
    </Container>
  );
}

export default LoginForm;
