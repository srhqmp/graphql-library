import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";

import { LOGIN } from "../queries.js";

const LoginForm = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.error(error);
      props.setError(error.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    console.log(result);
    if (result.data?.login?.value) {
      const token = result.data.login.value;
      localStorage.setItem("library-app-user-token", JSON.stringify(token));
      props.setToken(token);
    }
  }, [props, result, result.data]);

  if (!props.show) {
    return null;
  }

  const submit = (event) => {
    event.preventDefault();

    if (!username || !password) {
      props.setError("Please complete all fields");
      return;
    }

    login({ variables: { username, password } });
    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          username:{" "}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password:{" "}
          <input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
