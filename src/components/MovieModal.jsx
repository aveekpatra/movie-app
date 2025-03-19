import React from "react";
import MovieDetails from "./MovieDetails";

const MovieModal = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white/90 p-6 rounded-lg relative max-w-4xl w-full overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1 transition-colors"
        >
          X
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Movie Poster */}
          <div className="md:w-1/3">
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full rounded-lg shadow-lg"
              />
            )}
          </div>

          {/* Movie Info */}
          <div className="md:w-2/3">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              {movie.title}
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Release Date: {movie.release_date}
            </p>

            {/* Movie Details Component */}
            <MovieDetails movieId={movie.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
