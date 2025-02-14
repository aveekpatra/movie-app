import { useEffect, useState } from "react";
import "./App.css";
import { useDebounce } from "react-use";
import Search from "./components/Search"; // Ensure the case matches the filename
import MovieCard from "./components/MovieCard";
import { updateSearchCount, getTrendingMovies } from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [trendingMovies, setTrendingMovies] = useState([]);

  // This function debounces the search term and wait for 500ms after the user stops typing
  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm]
  );

  const fetchMovies = async (query = "") => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("An error occurred while fetching movies.");
      }

      const data = await response.json();
      // console.log(data);

      if (data.Response === "False") {
        setErrorMessage(
          data.Error || "An error occurred while fetching movies."
        );
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

      // throw new Error("An error occurred while fetching movies.");
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage(
        "An error occurred while fetching movies. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <>
      <div class="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
        {/* <div className="pattern"></div> */}

        <div className="wrapper">
          <header>
            <a href="https://aveekpatra.info" target="_blank" rel="noreferrer">
              <img
                src="./logo.svg"
                alt="Site logo"
                className="w-20 -translate-y-10"
              />
            </a>
            <h1>
              Seamlessly Find <span className="text-gradient">Movies</span> That
              Match Your vibes
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          <section className="all-movies mt-5">
            <h2>All Movies</h2>

            {isLoading ? (
              <p className="text-white animate-pulse text-xl text-center">
                Loading...
              </p>
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}

            {trendingMovies.length > 0 && (
              <section className="trending">
                <h2>Most Searched</h2>

                <ul>
                  {trendingMovies.map((movie, index) => (
                    <li key={movie.$id}>
                      <p>{index + 1}</p>
                      <img src={movie.poster_url} alt={movie.title} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </section>

          <footer>
            <p className="text-white text-center mt-10 text-xl font-semibold">
              Made with 🩷 by <br />{" "}
              <a className="text-gradient" href="https://aveekpatra.info">
                Aveek Patra
              </a>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
