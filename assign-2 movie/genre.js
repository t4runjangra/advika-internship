const API_KEY = '';
const getGenreMap = async function () {
  const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`);
  if (!res.ok) {
    throw new Error('Failed to fetch genres');
  }
  const data = await res.json();
  const genreMap = {};
  data.genres.forEach(g => {
    genreMap[g.id] = g.name;
  });
  return genreMap;
};

export { getGenreMap };
