import React, { useState, useEffect } from "react";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const AdvancedFilters = ({ onFilterChange, savedPreferences }) => {
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [filters, setFilters] = useState({
    genres: savedPreferences?.genres || [],
    year: savedPreferences?.year || "",
    language: savedPreferences?.language || "",
    sortBy: savedPreferences?.sortBy || "popularity.desc",
    includeAdult: savedPreferences?.includeAdult || false,
  });

  // Fetch genres and languages on component mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch genres
        const genresResponse = await fetch(
          `${API_BASE_URL}/genre/movie/list`,
          API_OPTIONS
        );
        const genresData = await genresResponse.json();
        setGenres(genresData.genres);

        // Fetch languages
        const languagesResponse = await fetch(
          `${API_BASE_URL}/configuration/languages`,
          API_OPTIONS
        );
        const languagesData = await languagesResponse.json();
        setLanguages(languagesData);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  // Handle filter changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilters = {
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle genre selection
  const handleGenreChange = (genreId) => {
    const newGenres = filters.genres.includes(genreId)
      ? filters.genres.filter((id) => id !== genreId)
      : [...filters.genres, genreId];

    const newFilters = { ...filters, genres: newGenres };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-black/30 backdrop-blur-lg p-6 rounded-lg space-y-6 border border-white/10">
      <h3 className="text-2xl font-bold mb-6 text-white">Advanced Filters</h3>

      {/* Genres */}
      <div>
        <h4 className="font-semibold mb-3 text-white">Genres</h4>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreChange(genre.id)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                filters.genres.includes(genre.id)
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/20"
                  : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Year */}
      <div>
        <h4 className="font-semibold mb-3 text-white">Release Year</h4>
        <input
          type="number"
          name="year"
          value={filters.year}
          onChange={handleChange}
          min="1900"
          max={new Date().getFullYear()}
          placeholder="Enter year"
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm"
        />
      </div>

      {/* Language */}
      <div>
        <h4 className="font-semibold mb-3 text-white">Language</h4>
        <select
          name="language"
          value={filters.language}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm"
        >
          <option value="">All Languages</option>
          {languages.map((lang) => (
            <option
              key={lang.iso_639_1}
              value={lang.iso_639_1}
              className="bg-gray-800"
            >
              {lang.english_name}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div>
        <h4 className="font-semibold mb-3 text-white">Sort By</h4>
        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm"
        >
          <option value="popularity.desc">Popularity (High to Low)</option>
          <option value="popularity.asc">Popularity (Low to High)</option>
          <option value="vote_average.desc">Rating (High to Low)</option>
          <option value="vote_average.asc">Rating (Low to High)</option>
          <option value="release_date.desc">Release Date (Newest)</option>
          <option value="release_date.asc">Release Date (Oldest)</option>
        </select>
      </div>

      {/* Include Adult Content */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="includeAdult"
          checked={filters.includeAdult}
          onChange={handleChange}
          className="w-4 h-4 rounded border-white/20 bg-white/10 text-pink-500 focus:ring-pink-500 focus:ring-offset-gray-900"
        />
        <label className="text-white">Include Adult Content</label>
      </div>
    </div>
  );
};

export default AdvancedFilters;
