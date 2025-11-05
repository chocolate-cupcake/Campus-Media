import { useState } from "react";
import {
  Container,
  Form,
  Button,
  Alert,
  Image,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getStudents, addStudent } from "../mainPage/studentData.js";

function SignUpForm({ switchToLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "",
    department: "",
    password: "",
    confirmPassword: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, email, password, confirmPassword, university, department } =
      formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!profileImage) {
      setError("Please upload a profile picture");
      return;
    }
    const students = getStudents();
    if (students.find((s) => s.email === email)) {
      setError("User already exists with this email");
      return;
    }

    const newUser = {
      name,
      email,
      university,
      department,
      password,
      profileImage,
      posts: [],
      stories: [],
      friends: [],
      suggestions: [],
    };

    const created = addStudent(newUser);
    localStorage.setItem("currentUser", JSON.stringify(created));

    setSuccess("Account created successfully! Redirecting...");
    setTimeout(() => navigate("/main-page"), 1500);
  };

  return (
    <Container
      className="p-3 rounded shadow"
      style={{
        maxWidth: "400px",
        backgroundColor: "#fff",
        maxHeight: "90vh",
        overflowY: "auto",
        scrollbarWidth: "thin",
      }}
    >
      <h4 className="text-center mb-3 fw-semibold">Create Account</h4>

      {error && (
        <Alert variant="danger" className="py-1">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="py-1">
          {success}
        </Alert>
      )}

      <Form onSubmit={handleSignUp}>
        {/* 👤 Personal Info */}
        <Row className="mb-3">
          <Col sm={12}>
            <Form.Control
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={12}>
            <Form.Control
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Col>
        </Row>

        {/* 🎓 Academic Info */}
        <Row className="mb-3">
          <Col sm={12}>
            <Form.Select
              name="university"
              value={formData.university}
              onChange={handleChange}
              required
            >
              <option value="">Select University</option>
              <option value="EPOKA University">EPOKA University</option>
              <option value="Universiteti i Tiranës">
                Universiteti i Tiranës
              </option>
              <option value="Universiteti POLIS">Universiteti POLIS</option>
              <option value="Universiteti Europian i Tiranës (UET)">
                Universiteti Europian i Tiranës (UET)
              </option>
              <option value="Albanian University">Albanian University</option>
              <option value="Universiteti për Biznes dhe Teknologji (UBT)">
                Universiteti për Biznes dhe Teknologji (UBT)
              </option>
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={12}>
            <Form.Control
              type="text"
              name="department"
              placeholder="Department (e.g. Informatikë)"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </Col>
        </Row>

        {/* 🖼 Profile */}
        <div className="text-center mb-3">
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-2"
            style={{ fontSize: "0.9rem" }}
          />
          {profileImage && (
            <Image
              src={profileImage}
              roundedCircle
              width="70"
              height="70"
              style={{ objectFit: "cover" }}
            />
          )}
        </div>

        {/* 🔒 Passwords (side by side on larger screens) */}
        <Row className="mb-3">
          <Col sm={6}>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Col>
          <Col sm={6}>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </Col>
        </Row>

        <Button
          variant="success"
          type="submit"
          className="w-100 py-2 fw-semibold"
        >
          Sign Up
        </Button>
      </Form>

      <p className="mt-3 text-center small text-muted">
        Already have an account?{" "}
        <span
          onClick={switchToLogin}
          style={{ color: "#0d6efd", cursor: "pointer" }}
        >
          Log in
        </span>
      </p>
    </Container>
  );
}

export default SignUpForm;
