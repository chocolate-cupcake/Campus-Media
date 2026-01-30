import { useState, useEffect } from "react";
import { Container, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { login, getCurrentUser } from "../services/api.js";
import guestImg from "../assets/guest.png";
import { Eye, EyeSlash } from "react-bootstrap-icons";

function LoginForm({ switchToSignUp }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  //  Automatically redirect if user is already logged in (but not if they're a guest trying to sign up)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user && user.role !== "guest") {
          navigate("/main-page");
        }
      } catch {
        // Not logged in, stay on login page
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(email, password);
      if (response.user) {
        sessionStorage.setItem("currentUser", JSON.stringify(response.user));
        navigate("/main-page");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  //  Handle Guest Login
  const handleGuestLogin = () => {
    const guestUser = {
      id: -1,
      name: "guest",
      email: "guest@guest",
      password: "",
      university: "noInfo",
      department: "noInfo",
      profileImage: guestImg,
      posts: [],
      stories: [],
      friends: [],
      suggestions: [],
      role: "guest", // Mark as guest
    };

    // Don't save to localStorage for guest (pass via state instead)
    navigate("/dashboard", { state: { user: guestUser } });
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
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeSlash /> : <Eye />}
            </Button>
          </InputGroup>
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-100"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </Button>
      </Form>

      {/*  Sign in as Guest */}
      <Button
        variant="outline-secondary"
        onClick={handleGuestLogin}
        className="w-100 mt-3"
      >
        Continue as Guest
      </Button>

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
