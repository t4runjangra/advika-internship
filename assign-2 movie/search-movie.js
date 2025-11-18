import { showErrorToast } from "./error";
const API_KEY = '';

const searchBar = document.getElementsByClassName('search-bar');
const trendingSection = document.getElementById('Trending');
const hindiSection = document.getElementById('hindi-recommendations');
const homeViewContainer = document.querySelector('#home-search-container')
const searchResultContainer = document.getElementById('search-results-view');
const searchQueryDisplay = document.getElementById('search-query-display');


async function searchMovie(movie) {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movie)}`
        );
        if (!response.ok) throw new Error('Network Error! While fetching the response');
        console.log(response);
        console.log(movie); 
        
        const data = await response.json();
        console.log(data); 


        trendingSection.classList.add('hidden');
        homeViewContainer.classList.add('hidden')
        hindiSection.classList.add('hidden');
        searchResultContainer.classList.remove('hidden');
        Array.from(searchBar).forEach(bar => bar.classList.remove('hidden'));
        searchQueryDisplay.innerHTML = `${movie}`;
        return data
    } catch (error) {
        showErrorToast('Could not find the movie');
        console.error(error);
        return { results: [] }
    }

}

export { searchMovie }