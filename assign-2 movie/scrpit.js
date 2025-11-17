document.addEventListener('DOMContentLoaded', () => {

    const homeView = document.getElementById('home-view');
    const homeSearchInput = document.getElementById('home-search-input');
    const trendingMoviesContainer = document.getElementById('trending-movies-container');
    const hindiRecommendations = document.getElementById('hindi-recommendations');
    const hindiMoviesContainer = document.getElementById('hindi-movies-container');
    const searchResultsView = document.getElementById('search-results-view');
    const searchQueryDisplay = document.getElementById('search-query-display');
    const resultsSearchInput = document.getElementById('results-search-input');
    const searchResultsContainer = document.getElementById('search-results-container');
    const movieDetailView = document.getElementById('movie-detail-view');
    const searchBtn = document.querySelector('.btn-search')



    const trendingMovies = [
        {
            title: "Oppenheimer",
            year: 2023,
            genre: "Biography, Drama",
            rating: 8.5,
            image: "https://image.tmdb.org/t/p/w500/qmWTT2C9Inx5Bajc8lEyQpi0RU0.jpg"
        },
        {
            title: "Barbie",
            year: 2023,
            genre: "Adventure, Comedy",
            rating: 7.1,
            image: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg"
        },
        {
            title: "Jawan",
            year: 2023,
            genre: "Action, Thriller",
            rating: 7.8,
            image: "https://image.tmdb.org/t/p/w500/ppAoqAbt9Oy1pT0vTwMiHEe22kw.jpg"
        },
        {
            title: "Animal",
            year: 2023,
            genre: "Action, Crime",
            rating: 7.1,
            image: "https://image.tmdb.org/t/p/w500/kOZ3h5mEBPn9JgknibfkRT5kNf2.jpg"
        },
        {
            title: "Pathaan",
            year: 2023,
            genre: "Action, Thriller",
            rating: 6.1,
            image: "https://image.tmdb.org/t/p/w500/1rO4xoCo4Z5WubK0OwdVll3DPYo.jpg"
        },
        {
            title: "Guardians of the Galaxy Vol. 3",
            year: 2023,
            genre: "Sci-Fi, Adventure",
            rating: 8.2,
            image: "https://image.tmdb.org/t/p/w500/fqv8v6Aq8Du6hSyeGQuBXzga3Rk.jpg"
        }
    ];

    const hindiMovies = [
        {
            title: "3 Idiots",
            year: 2009,
            genre: "Comedy, Drama",
            rating: 8.4,
            image: "https://image.tmdb.org/t/p/w500/66R2MZ0a4bdu4rBBjG3UnPs7tL0.jpg"
        },
        {
            title: "Gully Boy",
            year: 2019,
            genre: "Drama, Music",
            rating: 8.0,
            image: "https://image.tmdb.org/t/p/w500/6nBCXR9BZjlhqmf9C0u5wBNVwRA.jpg"
        },
        {
            title: "Andhadhun",
            year: 2018,
            genre: "Crime, Thriller",
            rating: 8.3,
            image: "https://image.tmdb.org/t/p/w500/c0lGxQjHFhG8FMiaPVuaIyt4yF4.jpg"
        },
        {
            title: "Taare Zameen Par",
            year: 2007,
            genre: "Drama, Family",
            rating: 8.3,
            image: "https://image.tmdb.org/t/p/w500/wEGuz8zL8R7uU8T3BfOr5kFhd1O.jpg"
        }
    ];

    function renderMovies(container, movies) {
        container.innerHTML = movies.map(movie => `
    <div class="movie-card">
      <img class="movie-poster" src="${movie.image || 'https://via.placeholder.com/200x300?text=No+Image'}" alt="${movie.title} Poster" />
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <div class="movie-meta">
          <span>${movie.year} • ${movie.genre}</span>
          <span class="movie-rating">
            <span class="star-icon">★</span> ${movie.rating}
          </span>
        </div>
      </div>
    </div>
  `).join('');
    }


    renderMovies(trendingMoviesContainer, trendingMovies);
    renderMovies(hindiMoviesContainer, hindiMovies);


    const API_KEY = '' ;
    //

    searchBtn.addEventListener('click', async () => {
        const movieInput = sea
        
        
    })
    console.log("hello");
    
})