import { useEffect, useState } from "react";
import "./App.css";
import { useDebounce } from "react-use";
import Search from "./components/Search"; // Ensure the case matches the filename
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal"; // Import the modal component
import AdvancedFilters from "./components/AdvancedFilters";
import SearchHistory from "./components/SearchHistory";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

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

  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null); // State for modal
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    genres: [],
    year: "",
    language: "",
    sortBy: "popularity.desc",
    includeAdult: false,
  });
  const [searchHistory, setSearchHistory] = useState([]);

  // Load saved preferences and search history from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem("movieAppPreferences");
    const savedHistory = localStorage.getItem("movieAppSearchHistory");

    if (savedPreferences) {
      setFilters(JSON.parse(savedPreferences));
    }
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem("movieAppPreferences", JSON.stringify(filters));
  }, [filters]);

  // This function debounces the search term and wait for 500ms after the user stops typing
  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm]
  );

  const fetchMovies = async (query = "", currentFilters = filters) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        sort_by: currentFilters.sortBy,
        include_adult: currentFilters.includeAdult.toString(),
      });

      if (currentFilters.genres.length > 0) {
        params.append("with_genres", currentFilters.genres.join(","));
      }
      if (currentFilters.year) {
        params.append("primary_release_year", currentFilters.year);
      }
      if (currentFilters.language) {
        params.append("with_original_language", currentFilters.language);
      }

      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
            query
          )}&${params}`
        : `${API_BASE_URL}/discover/movie?${params}`;

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

      // Update search history if this is a search query
      if (query && data.results.length > 0) {
        const newHistoryItem = {
          query,
          filters: currentFilters,
          timestamp: new Date().toISOString(),
        };
        const updatedHistory = [newHistoryItem, ...searchHistory].slice(0, 10);
        setSearchHistory(updatedHistory);
        localStorage.setItem(
          "movieAppSearchHistory",
          JSON.stringify(updatedHistory)
        );
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
  }, [debouncedSearchTerm, filters, page]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  useEffect(() => {
    // Reset page to 1 on new search
    setPage(1);
  }, [debouncedSearchTerm, filters]);

  // Modal handler: open modal when a movie card is clicked
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  // Modal handler: close modal
  const closeModal = () => {
    setSelectedMovie(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearchHistorySelect = (historyItem) => {
    setSearchTerm(historyItem.query);
    setFilters(historyItem.filters);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("movieAppSearchHistory");
  };

  return (
    <>
      <div>
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
            <div className="w-full max-w-2xl mx-auto">
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="mt-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 backdrop-blur-sm border border-white/10 flex items-center justify-center gap-2"
              >
                <span>
                  {showAdvancedFilters
                    ? "Hide Filters"
                    : "Show Advanced Filters"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showAdvancedFilters ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </header>

          <section className="all-movies">
            <div className="flex flex-col md:flex-row justify-between items-center mt-10">
              <h2 className="mb-5">All Movies</h2>

              <div className="flex space-x-2">
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
              </div>
            </div>

            {showAdvancedFilters && (
              <div className="mb-6">
                <AdvancedFilters
                  onFilterChange={handleFilterChange}
                  savedPreferences={filters}
                />
              </div>
            )}

            {searchHistory.length > 0 && !debouncedSearchTerm && (
              <div className="mb-6">
                <SearchHistory
                  history={searchHistory}
                  onSelectSearch={handleSearchHistorySelect}
                  onClearHistory={clearSearchHistory}
                />
              </div>
            )}

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
