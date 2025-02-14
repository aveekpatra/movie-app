import { useEffect, useState } from "react";
import "./App.css";
import { useDebounce } from "react-use";
import Search from "./components/Search"; // Ensure the case matches the filename
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal"; // Import the modal component
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

  const [sortBy, setSortBy] = useState("popularity.desc");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null); // State for modal

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
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
            query
          )}&page=${page}`
        : `${API_BASE_URL}/discover/movie?sort_by=${sortBy}&page=${page}`;
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
  }, [debouncedSearchTerm, sortBy, page]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  useEffect(() => {
    // Reset page to 1 on new search
    setPage(1);
  }, [debouncedSearchTerm]);

  // Modal handler: open modal when a movie card is clicked
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  // Modal handler: close modal
  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <div class="inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_90%,#000_50%,#63e_100%)]">
        {/* <div className="pattern"></div> */}

        <div className="wrapper">
          <header>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.location.reload();
              }}
              rel="noreferrer"
            >
              <img
                src="./logo.svg"
                alt="Site logo"
                className="w-20 -translate-y-10"
              />
            </a>
            <h1>
              Seamlessly Find <span className="text-gradient">Movies</span> That
              Match Your Vibes
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          <section className="all-movies">
            <div className="flex justify-between items-center mt-10">
              <h2>All Movies</h2>

              <span className="flex space-x-2">
                {!debouncedSearchTerm && (
                  <select
                    className="action-btn"
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                    }}
                  >
                    <option value="popularity.desc">Popularity</option>
                    <option value="vote_average.desc">Rating</option>
                    <option value="primary_release_date.desc">
                      Release Date
                    </option>
                  </select>
                )}

                <button
                  className="action-btn ml-5"
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                >
                  Previous Page
                </button>
                <button
                  className="action-btn"
                  onClick={() => setPage(page + 1)}
                >
                  Next Page
                </button>
              </span>
            </div>

            {isLoading ? (
              <p className="text-white animate-pulse text-xl text-center">
                Loading...
              </p>
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={handleMovieClick} // Pass handler to open modal
                  />
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
                      <img
                        src={
                          movie.poster_url ? movie.poster_url : "no-movie.png"
                        }
                        alt={movie.title}
                      />
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

        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={closeModal} />
        )}
      </div>
    </>
  );
}

export default App;
