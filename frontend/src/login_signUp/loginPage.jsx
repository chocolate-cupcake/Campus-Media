import Carousel from "react-bootstrap/Carousel";
import epokaUni from "../assets/universities/epokaUni1.png";
import fshn from "../assets/universities/fshn.jpg";
import ekonomiku from "../assets/universities/ekonomiku.jpg";
import politekniku from "../assets/universities/politekniku.png";
import LoginForm from "./login_form";



function LogIn() {

  
  return (
    <div className="login-page">
      {/* Left side: Carousel */}
      <div className="login-carousel-container">
        <Carousel interval={3000} pause={false} fade>
          <Carousel.Item>
            <img className="d-block w-100" src={epokaUni} alt="EPOKA University" />
            <Carousel.Caption>
              <h2>EPOKA</h2>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img className="d-block w-100" src={ekonomiku} alt="Fakulteti Ekonomik" />
            <Carousel.Caption>
              <h2>Fakulteti Ekonomik</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img className="d-block w-100" src={fshn} alt="Fakulteti i Shkencave te Natyres" />
            <Carousel.Caption>
              <h2>Fakulteti i Shkencave te Natyres</h2>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img className="d-block w-100" src={politekniku} alt="Universiteti Politeknik" />
            <Carousel.Caption>
              <h2>Universiteti Politeknik</h2>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>

      {/* Right side: blank for now (form can go here later) */}
      <div className="login-form-side">
        <LoginForm/>
        {/* You can add your form here later */}
      </div>
    </div>
  );
}

export default LogIn;
