import { useEffect, useState } from "react";
import "./App.css";
import Search from "./components/search";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const API_BASE_URL = " https://api.themoviedb.org/3/discover/movie";
  const API_KEY = "import.meta.env.VITE_API_KEY";
  const API_OPTIONS = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    Authorization: `Bearer ${API_KEY}`,
  };

  const fetchMovies = async () => { 
    try {
      const response = await fetch(`${API_BASE_URL}?api_key=${API_KEY}`, API_OPTIONS);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {

  }, []);

  return (
    <>
      <div className="pattern"></div>

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>


      </div>
    </>
  );
}

export default App;
