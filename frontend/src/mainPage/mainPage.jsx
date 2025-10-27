import Navbar from "./navBar.jsx";
import MainPageContainer from "./mainPageContainer.jsx";
function MainPage() {
  return (
    <div className="content">
      <nav className="main-page">
        <Navbar />
      </nav>
      <main className="main-page">
        <MainPageContainer />
      </main>
    </div>
  );
}
export default MainPage;
