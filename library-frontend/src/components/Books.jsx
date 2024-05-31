import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState(null);
  const response = useQuery(ALL_BOOKS, {
    skip: !props.show,
  });

  useEffect(() => {
    if (response.data?.allBooks) {
      const books = response.data.allBooks;
      const arr = books.flatMap((b) => {
        return b.genres.flatMap((g) => g);
      });
      setGenres([...new Set(arr)]);
    }
  }, [response.data]);

  if (!props.show) {
    return null;
  }

  if (response.loading) {
    return <div>loading...</div>;
  }

  const books = genre
    ? response.data.allBooks.filter((b) => b.genres.includes(genre))
    : response.data.allBooks;

  return (
    <div>
      <h2>books</h2>
      {genre && (
        <div>
          in genre <strong>{genre}</strong>{" "}
          <button onClick={() => setGenre(null)}>clear</button>
        </div>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g)} disabled={genre === g}>
            {g}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
