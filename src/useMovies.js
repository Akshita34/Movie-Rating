import { useEffect, useState } from "react";

const key = "a7251cfc";

export default function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${query}`
          );
          // console.log(res);
          if (!res.ok)
            throw new Error("Oops...There is some error in fetching data");

          const data = await res.json();
          console.log(data);
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
          setIsLoading(false);
        } catch (err) {
          if (err.name !== "AbortError")
            setError(err.message || "Movie not found");
          // console.log(err.message);
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setError("");
        setMovies([]);
        return;
      }

      //   handleCloseMovie();
      //   callBack?.();
      fetchMovies();
    },
    [query]
  );

  return { movies, isLoading, error };
}
