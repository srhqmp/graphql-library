import { useQuery } from "@apollo/client";

import AuthorForm from "./AuthorForm";

import { ALL_AUTHORS } from "../queries";

const Authors = (props) => {
  const response = useQuery(ALL_AUTHORS, { skip: !props.show });

  if (!props.show) {
    return null;
  }

  if (response.loading) {
    return <div>loading...</div>;
  }

  const authors = response.data.allAuthors;

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <AuthorForm setError={props.setError} />
    </div>
  );
};

export default Authors;
