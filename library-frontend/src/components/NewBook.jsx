import { useState } from "react";
import { useMutation } from "@apollo/client";

import { ALL_AUTHORS, ALL_BOOKS, ALL_GENRES, CREATE_BOOK } from "../queries";
import { updateCache } from "../helpers";

const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const resetFields = () => {
    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const [createBook] = useMutation(CREATE_BOOK, {
    update: (cache, response) => {
      props.setPage("books");
      resetFields();

      const newBook = response.data.addBook;

      updateCache(cache, { query: ALL_BOOKS }, response.data.addBook);

      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        return { allAuthors: allAuthors.concat(newBook.author) };
      });
      cache.updateQuery({ query: ALL_GENRES }, ({ allGenres }) => {
        return {
          allGenres: [...new Set(allGenres.concat(...newBook.genres))],
        };
      });
    },
    refetchQueries: [{ query: ALL_BOOKS }],
    awaitRefetchQueries: true,
    onError: (error) => {
      if (error) {
        console.error(error.graphQLErrors);
        props.setError(error.graphQLErrors[0].message);
      }
    },
  });

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    console.log("add book...");
    createBook({
      variables: { title, author, published: Number(published), genres },
    });
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
