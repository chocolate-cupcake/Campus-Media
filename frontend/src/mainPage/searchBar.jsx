import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function SearchBar() {
  return (
    <Form className="d-flex align-items-center">
      <Row>
        <Col xs="auto">
          <Form.Control
            type="text"
            placeholder="Search"
            className="mr-sm-2"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              color: "#ffffff",
              borderRadius: "20px",
              padding: "8px 15px",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => {
              e.target.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
              e.target.style.boxShadow = "0 0 8px rgba(74, 144, 226, 0.4)";
            }}
            onBlur={(e) => {
              e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
              e.target.style.boxShadow = "none";
            }}
          />
        </Col>
        <Col xs="auto">
          <Button
            type="submit"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              color: "#ffffff",
              fontWeight: "500",
              transition: "all 0.3s ease",
              borderRadius: "20px",
              padding: "6px 15px",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
            }}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default SearchBar;
