import { useState, useEffect } from "react";
import { useApolloClient } from "@apollo/client";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Notify from "./components/Notify";
import LoginForm from "./components/LoginForm";

const App = () => {
  const client = useApolloClient();
  const [token, setToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [page, setPage] = useState("authors");

  useEffect(() => {
    const storage_token = localStorage.getItem("library-app-user-token");
    if (storage_token) {
      setToken(JSON.parse(storage_token));
    }
  }, []);

  const notify = (message) => {
    console.log({ message });
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  const logout = () => {
    client.resetStore();
    setToken(null);
    localStorage.clear();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token ? (
          <button onClick={logout}>logout</button>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>
      <Notify errorMessage={errorMessage} />
      <Authors token={token} show={page === "authors"} setError={notify} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} setError={notify} setPage={setPage} />
      <LoginForm
        show={page === "login"}
        setError={notify}
        setToken={setToken}
      />
    </div>
  );
};

export default App;
