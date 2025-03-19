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

const MovieDetails = ({ movieId }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [externalIds, setExternalIds] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        // Fetch movie details
        const detailsResponse = await fetch(
          `${API_BASE_URL}/movie/${movieId}`,
          API_OPTIONS
        );
        const detailsData = await detailsResponse.json();
        setMovieDetails(detailsData);

        // Fetch credits
        const creditsResponse = await fetch(
          `${API_BASE_URL}/movie/${movieId}/credits`,
          API_OPTIONS
        );
        const creditsData = await creditsResponse.json();
        setCredits(creditsData);

        // Fetch videos
        const videosResponse = await fetch(
          `${API_BASE_URL}/movie/${movieId}/videos`,
          API_OPTIONS
        );
        const videosData = await videosResponse.json();
        setVideos(videosData.results);

        // Fetch similar movies
        const similarResponse = await fetch(
          `${API_BASE_URL}/movie/${movieId}/similar`,
          API_OPTIONS
        );
        const similarData = await similarResponse.json();
        setSimilarMovies(similarData.results);

        // Fetch external IDs (IMDb, etc.)
        const externalResponse = await fetch(
          `${API_BASE_URL}/movie/${movieId}/external_ids`,
          API_OPTIONS
        );
        const externalData = await externalResponse.json();
        setExternalIds(externalData);

        // Fetch images
        const imagesResponse = await fetch(
          `${API_BASE_URL}/movie/${movieId}/images`,
          API_OPTIONS
        );
        const imagesData = await imagesResponse.json();
        setImages(imagesData.backdrops || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-4">{error}</div>;
  if (!movieDetails) return null;

  return (
    <div className="space-y-6">
      {/* Movie Overview */}
      <div className="bg-white/80 p-4 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Overview</h3>
        <p>{movieDetails.overview}</p>
        <div className="mt-2 flex gap-4">
          <span>Runtime: {movieDetails.runtime} minutes</span>
          <span>Budget: ${movieDetails.budget?.toLocaleString()}</span>
          <span>Revenue: ${movieDetails.revenue?.toLocaleString()}</span>
        </div>
      </div>

      {/* Ratings */}
      <div className="bg-white/80 p-4 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Ratings</h3>
        <div className="flex gap-4">
          <span>TMDB Rating: {movieDetails.vote_average}/10</span>
          {externalIds?.imdb_id && (
            <a
              href={`https://www.imdb.com/title/${externalIds.imdb_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on IMDb
            </a>
          )}
        </div>
      </div>

      {/* Screenshots Gallery */}
      {images.length > 0 && (
        <div className="bg-white/80 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Screenshots</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.slice(0, 8).map((image, index) => (
              <div
                key={index}
                className="relative group cursor-pointer overflow-hidden rounded-lg"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
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
            ))}
          </div>
        </div>
      )}

      {/* Cast & Crew */}
      {credits && (
        <div className="bg-white/80 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Cast & Crew</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {credits.cast.slice(0, 6).map((actor) => (
              <div key={actor.id} className="flex items-center gap-2">
                {actor.profile_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                    alt={actor.name}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <button
                    onClick={() =>
                      (window.location.href = `/?searchType=actor&query=${encodeURIComponent(
                        actor.name
                      )}`)
                    }
                    className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    {actor.name}
                  </button>
                  <p className="text-sm text-gray-600">{actor.character}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <div className="bg-white/80 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Videos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.slice(0, 2).map((video) => (
              <div key={video.id} className="relative pt-[56.25%]">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.key}`}
                  title={video.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <div className="bg-white/80 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Similar Movies</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similarMovies.slice(0, 4).map((movie) => (
              <div key={movie.id} className="text-center">
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full rounded mb-2"
                  />
                )}
                <p className="text-sm font-semibold">{movie.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <img
              src={`https://image.tmdb.org/t/p/original${selectedImage.file_path}`}
              alt="Movie Screenshot"
              className="w-full rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
