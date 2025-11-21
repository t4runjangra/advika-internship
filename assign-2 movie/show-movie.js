import { showMovieModal } from "./movie-modal.js";

export async function fetchAndShowMovieModal(movieId) {

    const API_KEY = '4cee57298fba0f4818ead0de0d96dbae';
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos`);
      if (!response.ok) throw new Error('Movie details not found');
      const movie = await response.json();
      console.log(movie);

      showMovieModal(movie);
    } catch (err) {
      showErrorToast('Failed to fetch movie details.');
      console.error(err);
    }
  }
