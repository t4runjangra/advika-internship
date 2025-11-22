export function showMovieModal(movie) {
  const modal = document.getElementById('movie-modal');
  const content = modal.querySelector('.modal-content');

  const genres = (movie.genres && movie.genres.length) ? movie.genres.map(g => g.name).join(', ') : '';
  const runtime = movie.runtime ? `${movie.runtime} mins` : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  const trailer = (movie.videos && movie.videos.results)
    ? movie.videos.results.find(vid => vid.type === 'Trailer' && vid.site === 'YouTube')
    : null;

  // Always inject the trailer button and container
  const trailerBtn = `
    <button class="trailer-btn" data-video-key="${trailer ? trailer.key : ''}"
      style="display:inline-block;margin-bottom:1em;background:#e50914;color:#fff;padding:0.5em 1.2em;border-radius:6px;font-weight:bold;">
      Watch Trailer
    </button>
    <div id="modal-trailer-container" style="margin-top:1em;"></div>
  `;

  const homepage = movie.homepage
    ? `<a href="${movie.homepage}" target="_blank" style="color:#44aaff;">Official Website</a>`
    : 'N/A';

  content.innerHTML = `
    <img class="modal-poster" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
    <div class="modal-details">
      <span class="modal-close">&times;</span>
      <h2>${movie.title}</h2>
      <div class="modal-metadata">
        <span>${(movie.release_date || '').slice(0, 4)}</span>
        <span>• ${genres}</span>
        <span>• ${runtime}</span>
        <span>★ ${rating}</span>
      </div>
      <p>${movie.overview || 'No overview available.'}</p>
      ${trailerBtn}
      <div class="budget-data" style="margin-top:1em;">
        <div>Budget: $${movie.budget?.toLocaleString() || 'N/A'}</div>
        <div>Revenue: $${movie.revenue?.toLocaleString() || "0"}</div>
        <div>Language: ${movie.original_language?.toUpperCase() || ''}</div>
        <div>Status: ${movie.status || ''}</div>
        ${homepage}
      </div>
    </div>
  `;
  modal.classList.remove('hidden');

  // Trailer button logic
  const trailerButton = modal.querySelector('.trailer-btn');
  if (trailerButton) {
    trailerButton.addEventListener('click', function () {
      const key = trailerButton.getAttribute('data-video-key');
      const videoContainer = modal.querySelector('#modal-trailer-container');
      // Inject responsive iframe with a wrapper class (for proper aspect ratio)
      videoContainer.innerHTML = `
        <div class="modal-iframe-wrapper">
          <iframe src="https://www.youtube.com/embed/${key}?autoplay=1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      `;
      trailerButton.style.display = "none";
    });
  }
}

// --- Modal close handler: always remove the trailer iframe on close ---

document.getElementById('movie-modal').addEventListener('click', function (event) {
  // Close if clicking the backdrop or the close × button
  if (
    event.target.classList.contains('modal') ||
    event.target.classList.contains('modal-close')
  ) {
    this.classList.add('hidden');
    // Stop trailer if playing by destroying the iframe
    const videoContainer = document.getElementById('modal-trailer-container');
    if (videoContainer) videoContainer.innerHTML = '';
  }
});
