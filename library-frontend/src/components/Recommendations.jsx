import { useQuery } from "@apollo/client";

import { ME } from "../queries.js";

import Books from "./Books.jsx";

const Recommendations = (props) => {
  const response = useQuery(ME, {
    skip: !props.show,
  });

  if (!props.show) {
    return null;
  }

  if (response.loading) {
    return <div>loading...</div>;
  }

  const me = response.data.me;

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books in your favorite genre <strong>{me.favoriteGenre}</strong>
      </div>
      <Books
        show={true}
        favoriteGenre={me.favoriteGenre}
        hideTitle={true}
        hideFilter={true}
      />
    </div>
  );
};

export default Recommendations;
