import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { wait } from "@testing-library/user-event/dist/utils";
import useMovies from "./useMovies";
import useLocalStorage from "./useLocalStorage";
import useKey from "./useKey";

const key = "a7251cfc";

export default function App() {
  const [query, setQuery] = useState("interstellar");
  const [selectedID, setSelectedID] = useState("");

  const { movies, isLoading, error } = useMovies(query);
  const { watched, setWatched } = useLocalStorage([]);

  function handleSetSelectedID(id) {
    setSelectedID((selectedID) => (id === selectedID ? null : id));
  }

  function handleCloseMovie() {
    setSelectedID(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    // localStorage.setItem("watched", [...watched, movie]);
  }

  function handleOnDelete(id) {
    setWatched(watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              handleSetSelectedID={handleSetSelectedID}
            />
          )}
          {error && <Error message={error} />}
          {isLoading && <Loader />}
        </Box>

        <Box>
          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              handleCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedMovieList watched={watched} onDelete={handleOnDelete} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Error({ message }) {
  return <p className="error">🚫{message}</p>;
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span>🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inplutEl = useRef(null);
  useKey("Enter", inplutEl, setQuery);
  return (
    <input
      className="search"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inplutEl}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <div className="main">{children}</div>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  function handleClick() {
    setIsOpen(() => !isOpen);
  }
  return (
    <div className="box">
      <button className="btn-toggle" onClick={handleClick}>
        {isOpen ? "-" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, handleSetSelectedID }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handleSetSelectedID={handleSetSelectedID}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handleSetSelectedID }) {
  return (
    <li onClick={() => handleSetSelectedID(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedID, handleCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);

  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating > 0) countRef.current = countRef.current + 1;
    },
    [userRating]
  );

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedID);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedID
  )?.userRating;
  // console.log(isWatched);
  const {
    Title: title,
    Year: year,
    imdbRating,
    Runtime: runtime,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    Poster: poster,
    Plot: plot,
  } = movie;

  function handleOnAdd() {
    const newmovie = {
      imdbID: selectedID,
      title,
      year,
      poster,
      runtime: Number(runtime.split(" ")[0]),
      imdbRating: Number(imdbRating),
      userRating,
      cntRatingDecisions: countRef.current,
    };
    onAddWatched(newmovie);
    handleCloseMovie();
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selectedID}`
        );
        const data = await res.json();
        // console.log(data);
        setMovie(data);
        console.log(movie);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedID]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `MOVIE | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`${title} Poster`} />
            <div className="details-overview">
              <h3>{title}</h3>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB Rating
              </p>
            </div>
          </header>

          <section>
            {!isWatched ? (
              <>
                <div className="rating">
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                </div>
                {userRating > 0 && (
                  <button className="btn-add" onClick={handleOnAdd}>
                    Add to List
                  </button>
                )}
              </>
            ) : (
              <p>It's already rated {watchedUserRating}🌟</p>
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>
              <em>Starring: {actors}</em>
            </p>
            <p>
              <em>Directed by: {director}</em>
            </p>
          </section>
        </>
      )}
    </div>
  );
}

function Summary({ watched }) {
  const n = watched.length;
  const avgImdbRating =
    watched.reduce((sum, movie) => sum + movie.imdbRating, 0) / n;
  const avgUserRating =
    watched.reduce((sum, movie) => sum + movie.userRating, 0) / n;
  const avgTime = watched.reduce((sum, movie) => sum + movie.runtime, 0) / n;
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{n} movies</span>
        </p>
        <p>
          <span>⭐</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgTime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched?.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDelete={onDelete} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDelete }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <p>
          <button onClick={() => onDelete(movie.imdbID)} className="btn-delete">
            ❌
          </button>
        </p>
      </div>
    </li>
  );
}
