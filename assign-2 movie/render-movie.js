    function renderMovies(container, movies, genreMap) {
        container.innerHTML = movies.map(movie => {
            const imageUrl = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/200x300?text=No+Image';
            const genreNames = movie.genre_ids.map(id => genreMap[id]).filter(Boolean).join(', ');
            const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
            return `
          
        <div class="movie-card">
          <img class="movie-poster" src="${imageUrl}" alt="${movie.title} Poster" />
          <div class="movie-info">
            <h3>${movie.title}</h3>
            <div class="movie-meta">
              <span>${year} • ${genreNames}</span>
              <span class="movie-rating">
                <span class="star-icon">★</span> ${(movie.vote_average).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      `;
        }).join('');
    }
export {renderMovies}