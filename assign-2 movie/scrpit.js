import { getGenreMap } from "./genre.js";
import { showErrorToast } from "./error.js";
import { renderMovies } from "./render-movie.js";
import { searchMovie } from "./search-movie.js";

document.addEventListener('DOMContentLoaded', () => {

  const trendingMoviesContainer = document.getElementById('trending-movies-container');
  const API_KEY = '';

  async function fetchTrendingMovies() {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
      const genreMap = await getGenreMap();
      if (!response.ok) throw new Error(showErrorToast('Network error while fetching Movies'));
      const data = await response.json();
      renderMovies(trendingMoviesContainer, data.results, genreMap);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      showErrorToast("Failed to fetch movie data. Please try again.")
    }
  }



  fetchTrendingMovies();

  const hindiMoviesContainer = document.querySelector("#hindi-movies-container");

  async function fetchHindiMovies() {
    try {
      const genreMap = await getGenreMap()
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=hi&sort_by=popularity.desc`);
      if (!response.ok) throw new Error('Network error while fetching Movies');
      const data = await response.json();
      renderMovies(hindiMoviesContainer, data.results, genreMap);
    } catch (error) {
      showErrorToast("Failed to fetch Hindi movies data. Please try again.");
      console.error(error);
    }
  }
  fetchHindiMovies();

  // const hamburger = document.getElementById('hamburger');
  // const navMenu = document.getElementByclass('nav-menu');
  // const navList = document.getElementByclass('nav-list')

  // hamburger.addEventListener('click', () => {
  //     navList.classList.add('hidden')
  //     navMenu.classList.toggle('active');
  //     hamburger.classList.toggle('active');
  // });


  const searchBtn = document.querySelector('.btn-search');
  const searchInput = document.getElementById('home-search-input');
        const searchResultContainer = document.getElementById('search-results-view');

  const searchBar = document.getElementsByClassName('search-bar');
  const resultsSearchInput = document.getElementById('results-search-input');
  const searchResultsContainer = document.getElementById('search-results-container');
  const sortSelect = document.querySelector('#search-results-view select');
  const filterGenreBtn = document.querySelector('#search-results-view button');
  const pagination = document.querySelector('#search-results-view .pagination');
  const resultsSearchBtn = document.querySelector('#search-btn')

  const searchInputs = {
    home: document.getElementById('home-search-input'),
    results: document.getElementById('results-search-input')
  };



  const searchButtons = document.querySelectorAll('.btn-search');
  searchButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const context = btn.dataset.context;
      const movie = (searchInputs[context]?.value || '').trim();
      if (!movie) return;

      const genreMap = await getGenreMap();
      const data = await searchMovie(movie);
      resultsSearchInput.value = movie;
      renderMovies(searchResultsContainer, data.results, genreMap);
    });
  });

  

});
