export function setupSuggestionBox(inputId, suggestBoxId, apiKey, onSelect) {
  const input = document.getElementById(inputId);
  const suggestBox = document.getElementById(suggestBoxId);
  let abortController = null;

  if (!input || !suggestBox) return;

  input.addEventListener('input', async function () {
    const query = input.value.trim();
    if (!query) {
      suggestBox.innerHTML = '';
      suggestBox.style.display = 'none';
      return;
    }
    if (abortController) abortController.abort();
    abortController = new AbortController();

    try {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1`;
      const res = await fetch(url, { signal: abortController.signal });
      if (!res.ok) throw new Error("Suggest fetch failed");
      const data = await res.json();
      const movies = data.results.slice(0, 6) || [];
      suggestBox.innerHTML = movies.map(movie =>
        `<div class="suggestion-item" data-movie-title="${movie.title}">
          ${movie.title} ${movie.release_date ? `(${movie.release_date.slice(0,4)})` : ''}
        </div>`
      ).join('');
      suggestBox.style.display = movies.length ? 'block' : 'none';
    } catch (e) {
      if (e.name !== 'AbortError') {
        suggestBox.innerHTML = '';
        suggestBox.style.display = 'none';
      }
    }
  });

  suggestBox.addEventListener('click', e => {
    const item = e.target.closest('.suggestion-item');
    if (item) {
      input.value = item.dataset.movieTitle;
      suggestBox.innerHTML = '';
      suggestBox.style.display = 'none';
      if (typeof onSelect === 'function') {
        onSelect(item.dataset.movieTitle);
      }
    }
  });

  input.addEventListener('blur', () => {
    setTimeout(() => {
      suggestBox.innerHTML = '';
      suggestBox.style.display = 'none';
    }, 130);
  });
}
