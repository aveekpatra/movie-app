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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                  <p className="font-semibold">{actor.name}</p>
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
    </div>
  );
};

export default MovieDetails;
