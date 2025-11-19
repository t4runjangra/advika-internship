import { getGenreMap } from "./genre.js";
import { showErrorToast } from "./error.js";
import { renderMovies } from "./render-movie.js";
import { searchMovie } from "./search-movie.js";

document.addEventListener('DOMContentLoaded', () => {


  const trendingMoviesContainer = document.getElementById('trending-movies-container');
  const API_KEY = '4cee57298fba0f4818ead0de0d96dbae';
  const image = document.getElementById('background')



  let backgroundMoviePostures = []

  const MOVIES_PER_PAGE = 10;
  let trendingMoviesData = [];
  let currentShowCount = MOVIES_PER_PAGE;
  async function fetchTrendingMovies() {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
      const genreMap = await getGenreMap();
      if (!response.ok) throw new Error(showErrorToast('Network error while fetching Movies'));

      const data = await response.json();
      backgroundMoviePostures = data.results
      trendingMoviesData = data.results;
      currentShowCount = MOVIES_PER_PAGE;
      image.src = `https://image.tmdb.org/t/p/w1280${backgroundMoviePostures[0].backdrop_path}`
      backgroundPoster(backgroundMoviePostures)
      renderMovies(trendingMoviesContainer, trendingMoviesData.slice(0, currentShowCount), genreMap);
      addShowMoreButton(genreMap)
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      showErrorToast("Failed to fetch movie data. Please try again.")
    }
  }

  const showMoreBtn = document.getElementById('show-more-trending')
  function addShowMoreButton(genreMap) {
    showMoreBtn.addEventListener('click', () => {
      console.log('Show More button clicked');
      currentShowCount = trendingMoviesData.length;
      renderMovies(trendingMoviesContainer, trendingMoviesData.slice(0, currentShowCount), genreMap);
      showMoreBtn.style.display = 'none';
    });
  }


  fetchTrendingMovies();

  const hindiMoviesContainer = document.querySelector("#hindi-movies-container");
  let hindiMoviesData = [];
  let hindiCurrentShowCount = MOVIES_PER_PAGE;

  async function fetchHindiMovies() {
    try {
      const genreMap = await getGenreMap()
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=hi&sort_by=popularity.desc`);
      if (!response.ok) throw new Error('Network error while fetching Movies');
      const data = await response.json();
      hindiMoviesData = data.results
      hindiCurrentShowCount = MOVIES_PER_PAGE

      renderMovies(hindiMoviesContainer, hindiMoviesData.slice(0, hindiCurrentShowCount), genreMap);
      addShowMoreHindiButton(genreMap)
    } catch (error) {
      showErrorToast("Failed to fetch Hindi movies data. Please try again.");
      console.error(error);
    }
  }

  const showMoreHindiBtn = document.getElementById('show-more-hindi');

  function addShowMoreHindiButton(genreMap) {
    showMoreHindiBtn.addEventListener('click', () => {
      hindiCurrentShowCount = hindiMoviesData.length;
      renderMovies(hindiMoviesContainer, hindiMoviesData.slice(0, hindiCurrentShowCount), genreMap);
      showMoreHindiBtn.style.display = 'none';
    });
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
  const filterGenreBtn = document.querySelector('#search-results-view button');
  const pagination = document.querySelector('#search-results-view .pagination');
  const resultsSearchBtn = document.querySelector('#search-btn')
  const trendingSection = document.getElementById('Trending');
  const hindiSection = document.getElementById('hindi-recommendations');
  const homeViewContainer = document.querySelector('#home-search-container')
  const searchQueryDisplay = document.getElementById('search-query-display');
  const loadingIndicator = document.getElementById('loading-indicator');
  const backgroundPic = document.getElementById('background')


  const searchInputs = {
    home: document.getElementById('home-search-input'),
    results: document.getElementById('results-search-input')
  };




  let movies = [];
  let movieYear = [];
  let movieTitle = [];
  const searchButtons = document.querySelectorAll('.btn-search');

  searchButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const context = btn.dataset.context;
      const movie = (searchInputs[context]?.value || '').trim();
      if (!movie) return;
      searchResultsContainer.innerHTML = '';
      loadingIndicator.classList.remove('hidden');

      const searchPromise = new Promise(resolve => setTimeout(resolve, 1000));
      try {
        trendingSection.classList.add('hidden');
        homeViewContainer.classList.add('hidden');
        hindiSection.classList.add('hidden');
        searchResultContainer.classList.remove('hidden');

        const genreMap = await getGenreMap();
        const [_, data] = await Promise.all([searchPromise, searchMovie(movie)]);

        movies = data.results;
        movieYear = movies.map(m => m.release_date);
        movieTitle = movies.map(m => m.title);

        Array.from(searchBar).forEach(bar => bar.classList.remove('hidden'));
        searchQueryDisplay.innerHTML = movie;
        resultsSearchInput.value = movie;
        renderMovies(searchResultsContainer, movies, genreMap);
      } finally {
        loadingIndicator.classList.add('hidden');
      }
    });
  });

  const sortSelect = document.getElementById('sortSelect');
  sortSelect.addEventListener('change', async () => {
    const genreMap = await getGenreMap();
    const sortBy = sortSelect.value;
    sortMovies(sortBy, genreMap);
  });

  function sortMovies(criteria, genreMap) {
    let sortedMovies = [...movies];
    switch (criteria) {
      case 'rating':
        sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case 'release_year':
        sortedMovies.sort((a, b) => {
          const yearA = a.release_date ? parseInt(a.release_date.split('-')[0]) : 0;
          const yearB = b.release_date ? parseInt(b.release_date.split('-')[0]) : 0;
          return yearB - yearA;
        });
        break;
      case 'title':
        sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    renderMovies(searchResultsContainer, sortedMovies, genreMap);
  }


  // const searchbarInput = document.getElementById('search-bar')
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && (event.key === 'k' || event.key === 'K')) {
      event.preventDefault();
      searchBar.classList.toggle('hidden'); // Toggle search bar visibility
      searchInput.focus(); // Focus the input field inside the search bar
    }
  });


  
  let currentPosterIndex = 0;
  const baseUrl = "https://image.tmdb.org/t/p/w1280";

  function setPosterBackground(index) {
    const posterPath = backgroundMoviePostures[index].backdrop_path;
    if (!posterPath) return;
    const posterUrl = baseUrl + posterPath;
    image.src = posterUrl;
  }

  setPosterBackground(currentPosterIndex);

  async function backgroundPoster(data) {
    const localData = data
    setInterval(() => {
      currentPosterIndex = (currentPosterIndex + 1) % localData.length;
      setPosterBackground(currentPosterIndex);
    }, 5000);

  }



});
