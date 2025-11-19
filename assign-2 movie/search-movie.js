import { showErrorToast } from "./error.js";

const API_KEY = '4cee57298fba0f4818ead0de0d96dbae';

export async function searchMovie(movie) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movie)}`
    );
    if (!response.ok) throw new Error('Network Error! While fetching the response');
    const data = await response.json();

    return data;
  } catch (error) {
    showErrorToast('Could not find the movie');
    console.error(error);
    return { results: [] };
  }
}
