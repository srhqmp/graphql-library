import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";

import { ALL_AUTHORS, UPDATE_AUTHOR } from "../queries";

const AuthorForm = ({ setError, authors }) => {
  const [name, setName] = useState(authors[0].name);
  const [born, setBorn] = useState("");

  const [updateAuthor, result] = useMutation(UPDATE_AUTHOR, {
    update: (cache, response) => {
      if (response.data && response.data.editAuthor === null) {
        setError("author not found");
      } else {
        cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
          return { allAuthors: allAuthors.concat(response.data.editAuthor) };
        });
      }
    },
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      setError(messages || error.message);
    },
  });

  const submit = (event) => {
    event.preventDefault();

    if (!name || !born) {
      setError("Please complete all fields");
      return;
    }

    updateAuthor({ variables: { name, setBornTo: Number(born) } });
    setBorn("");
  };

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      setError("author not found");
    }
  }, [result.data, setError]);

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          <select
            name="name"
            id="name"
            onChange={({ target }) => setName(target.value)}
            defaultValue={authors[0].name}
          >
            {authors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born{" "}
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default AuthorForm;
