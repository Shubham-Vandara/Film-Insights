// SELECT THE ELEMETS
const searchForm = document.querySelector("form");
const movieContainer = document.querySelector(".movie-container");
const inputBox = document.querySelector(".inputBox");
const moviePoster = document.querySelector(".movie-poster");
const movieDetails = document.querySelector(".movie-details");

// FUNCTION TO GET MOVIE INFORMATION FROM OMDB API USING THE PROVIDED API KEY
const API_KEY = "";

// ASYNCHRONOUS FUNCTION TO FETCH MOVIE INFORMATION
const getMovieInfo = async (movie) => {
  try {
    // CONSTRUCT URL FOR API CALL
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&t=${movie}`;
    // SEND REQUEST TO API
    const response = await axios.get(url);
    // EXTRACT DATA FROM RESPONSE
    const data = response.data;
    // DISPLAY MOVIE DATA
    showMovieData(data);

    // STORE MOVIE DATA IN LOCAL STORAGE
    localStorage.setItem("movieData", JSON.stringify(data));
  } catch (e) {
    // CLEAR LOCAL STORAGE ON ERROR
    localStorage.clear();
    // SHOW ERROR MESSAGE
    showErrorMessage("Ohho, No Movie Found!!!");
  }
};

// FUNCTION TO DISPLAY MOVIE DATA ON WEBPAGE
const showMovieData = (data) => {
  // CLEAR PREVIOUS MOVIE INFORMATION
  movieContainer.innerHTML = "";
  movieContainer.classList.remove("noBackground");
  movieContainer.style.padding = "0";

  // EXTRACT NECESSARY MOVIE DATA
  const {
    Title,
    imdbRating,
    Runtime,
    Released,
    Poster,
    Genre,
    Director,
    BoxOffice,
    Actors,
    Plot,
  } = data;

  // CREATE ELEMENT TO DISPLAY MOVIE INFORMATION
  const movieElement = document.createElement("div");
  movieElement.classList.add("movie-info");
  movieElement.innerHTML = ` <h2>${Title}</h2>
                            <p> <strong> IMDB Rating </strong> &#11088; ${imdbRating} </p>`;
  movieContainer.append(movieElement);

  // CREATE ELEMENT TO DISPLAY MOVIE GENRE
  const movieGenreElement = document.createElement("div");
  movieGenreElement.classList.add("movie-genre");

  // ITERATE THROUGH GENRES AND ADD THEM TO THE ELEMENT
  Genre.split(",").forEach((element) => {
    const p = document.createElement("p");
    p.innerText = element;
    movieGenreElement.append(p);
  });
  movieElement.append(movieGenreElement);

  // APPEND ADDITIONAL MOVIE INFORMATION
  movieElement.innerHTML += `<p> <strong> Released Date: </strong> ${Released} </p>
                            <p> <strong> Duration: </strong> ${Runtime} </p>
                            <p> <strong> Box Office Collection: </strong> ${BoxOffice} </p>
                            <p> <strong> Director: </strong> ${Director} </p>
                            <p> <strong> Cast: </strong> ${Actors} </p>
                            <p> <strong> Plot: </strong> ${Plot} </p>`;

  // DISPLAY MOVIE POSTER
  const moviePoster = document.createElement("div");
  moviePoster.classList.add("movie-poster");
  moviePoster.innerHTML = `<img src=${Poster} alt="movie-poster">`;

  movieContainer.append(moviePoster);
  movieContainer.append(movieElement);
};

// FUNCTION TO SHOW ERROR MESSAGE
const showErrorMessage = (message) => {
  movieContainer.innerHTML = `<h2>${message}</h2>`;
  movieContainer.classList.add("noBackground");
};

// FUNCTION TO HANDLE FORM SUBMISSION
const handleFormSubmission = (e) => {
  e.preventDefault();
  const movieName = inputBox.value.trim();
  localStorage.setItem("movieName", movieName);
  if (movieName) {
    getMovieInfo(movieName);
    movieContainer.style.padding = "0";
  } else {
    localStorage.clear();
    showErrorMessage("Enter movie name to get movie information");
  }
};

// ADD EVENT LISTENER TO FORM SUBMISSION
searchForm.addEventListener("submit", handleFormSubmission);

// FUNCTION TO RETRIEVE MOVIE DATA FROM LOCAL STORAGE ON PAGE LOAD
const retrieveMovieData = () => {
  const storedData = localStorage.getItem("movieData");
  const storedMovieName = localStorage.getItem("movieName");
  inputBox.value = storedMovieName;
  if (storedData) {
    const data = JSON.parse(storedData);
    showMovieData(data);
  } else if (!inputBox.value) {
    localStorage.clear();
    showErrorMessage("Enter movie name to get movie information");
  }
};

// CALL retrieveMovieData FUNCTION ON PAGE LOAD
retrieveMovieData();
