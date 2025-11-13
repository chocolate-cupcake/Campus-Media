import { useState, useEffect } from "react";
import NavBar from "./navBar.jsx";
import MainPageContainer from "./mainPageContainer.jsx";
import SideSuggestions from "./sideSuggestions.jsx";

function MainPage() {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  function openSuggestions() {
    setShowSuggestions(true);
  }

  function closeSuggestions() {
    setShowSuggestions(false);
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) setCurrentUser(user);
    // optionally redirect if not logged in
    // else navigate("/login");
  }, []);

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div className="d-flex flex-column vh-100">
      <header>
        <NavBar onOpenSuggestions={openSuggestions} currentUser={currentUser} />
      </header>

      <div className="d-flex flex-grow-1" style={{ minHeight: 0 }}>
        <SideSuggestions
          showOffcanvas={showSuggestions}
          closeOffcanvas={closeSuggestions}
          currentUser={currentUser}
        />
        <main className="flex-grow-1 overflow-auto">
          <MainPageContainer currentUser={currentUser} />
        </main>
      </div>
    </div>
  );
}

export default MainPage;
