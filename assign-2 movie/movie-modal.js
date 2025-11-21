export function showMovieModal(movie) {
    const modal = document.getElementById('movie-modal');
    const content = modal.querySelector('.modal-content');

    const genres = (movie.genres && movie.genres.length) ? movie.genres.map(g => g.name).join(', ') : '';

    const runtime = movie.runtime ? `${movie.runtime} mins` : 'N/A';

    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

    const trailer = (movie.videos && movie.videos.results) ? movie.videos.results.find(vid => vid.type === 'Trailer' && vid.site === 'YouTube') : null;
    const trailerBtn = trailer
        ? `<button class="trailer-btn" data-video-key="${trailer ? trailer.key : ''}" style="display:inline-block;margin-bottom:1em;background:#e50914;color:#fff;padding:0.5em 1.2em;border-radius:6px;font-weight:bold;text-decoration:none;"> Watch Trailer</button>
        <div id="modal-trailer-container" style="margin-top:1em;"></div>
        `
        : '';

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
      <div style="margin-top:1em;">
        <div>Budget: $${movie.budget?.toLocaleString() || 'N/A'}</div>
        <div>Revenue: $${movie.revenue?.toLocaleString() || "0"}</div>
        <div>Language: ${movie.original_language?.toUpperCase() || ''}</div>
        <div>Status: ${movie.status || ''}</div>
        ${homepage}
      </div>
    </div>
  `;
    modal.classList.remove('hidden');

    const trailerButton = modal.querySelector('.trailer-btn');
    if (trailerButton) {
        trailerButton.addEventListener('click', function () {
            const key = trailerButton.getAttribute('data-video-key');
            const videoContainer = modal.querySelector('#modal-trailer-container');
            videoContainer.innerHTML = `
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
          <iframe src="https://www.youtube.com/embed/${key}?autoplay=1"
            frameborder="0" allowfullscreen
            style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:11px;">
          </iframe>
        </div>`;
            trailerButton.style.display = "none";
        });
    }
}
