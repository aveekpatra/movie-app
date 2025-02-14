import React from "react";

const MovieModal = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="bg-white/60 p-6 rounded-lg relative max-w-lg w-full overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-200 rounded-full px-3 py-1"
        >
          X
        </button>
        {movie.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full rounded mb-4"
          />
        )}
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{movie.title}</h2>
        <p className="text-sm text-gray-600 mb-2">
          Release Date: {movie.release_date}
        </p>
        <p className="mb-4">{movie.overview}</p>
        <p>
          <strong>Rating:</strong> {movie.vote_average}
        </p>
        {/* Add more movie details here as needed */}
      </div>
    </div>
  );
};

export default MovieModal;
