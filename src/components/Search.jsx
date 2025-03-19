import React, { useState } from "react";

const Search = ({ searchTerm, setSearchTerm, onSearchTypeChange }) => {
  const [searchType, setSearchType] = useState("movie"); // "movie" or "actor"

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    onSearchTypeChange(type);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm border border-white/10">
          <button
            onClick={() => handleSearchTypeChange("movie")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              searchType === "movie"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                : "text-white hover:bg-white/10"
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => handleSearchTypeChange("actor")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              searchType === "actor"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                : "text-white hover:bg-white/10"
            }`}
          >
            Actors
          </button>
        </div>
      </div>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={
            searchType === "movie"
              ? "Search for movies..."
              : "Search for actors..."
          }
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg
            className="w-5 h-5 text-white/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Search;
