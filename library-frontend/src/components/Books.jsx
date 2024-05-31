import { useState } from "react";
import { useQuery } from "@apollo/client";

import { ALL_BOOKS, ALL_GENRES } from "../queries";

const Books = (props) => {
  const [genre, setGenre] = useState(null);
  const response = useQuery(ALL_BOOKS, {
    skip: !props.show,
    variables: { genre: genre || props.favoriteGenre },
  });
  const allGenresRespons = useQuery(ALL_GENRES, {
    skip: !props.show,
  });

  if (!props.show) {
    return null;
  }

  if (response.loading) {
    return <div>loading...</div>;
  }

  const books = response.data.allBooks;
  const genres = allGenresRespons.data.allGenres;

  return (
    <div>
      {!props.hideTitle && <h2>books</h2>}
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
      {!props.hideFilter && (
        <div>
          {genres.map((g) => (
            <button key={g} onClick={() => setGenre(g)} disabled={genre === g}>
              {g}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;
