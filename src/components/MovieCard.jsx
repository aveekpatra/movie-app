import React from "react";

function MovieCard({
  movie: { title, vote_average, poster_path, release_date, original_language },
}) {
  return (
    <div className="movie-card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "no-movie.png"
        }
        alt={title}
      />

      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star icon" />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>
          <span>&#8226;</span>
          <span className="font-bold uppercase">{original_language}</span>
          <span>&#8226;</span>
          <span className="font-bold uppercase">
            {release_date ? release_date.split("-").reverse().join("/") : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
