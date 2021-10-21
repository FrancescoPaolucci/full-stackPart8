/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import View from "./components/homelist";
import "./App.css";
import BookForm from "./components/bookform";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import BirthyearForm from "./components/setBirthday";
import LoginForm from "./components/loginForm";
import Select from "react-select";

const ALL_AUTHORS = gql`
  query {
    allauthors {
      name
      born
      bookCount
    }
  }
`;
const ALL_BOOKS = gql`
  query {
    allbooks {
      title
      published
      genres
      author {
        name
      }
      id
    }
  }
`;
const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;
const BOOKS_PAR = gql`
  query allbooksPar($author: String, $genre: String) {
    allbooksPar(author: $author, genre: $genre) {
      title
      published
      genres
      author {
        name
      }
      id
    }
  }
`;

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }
  return <div style={{ color: "red" }}>{errorMessage}</div>;
};

const App = () => {
  const me = useQuery(ME);
  const [token, setToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const Authors1 = () => {
    const result = useQuery(ALL_AUTHORS);

    if (result.loading || me.loading) {
      return <div>Loading....</div>;
    }
    return (
      <div>
        <h2>Authors</h2>
        <h3>Born____BOOKS</h3>
        {result.data.allauthors.map((a) => (
          <div key={a.name}>
            <h2> {a.name}</h2>
            <h4>
              {a.born} _____________ {a.bookCount}
              {a.bookCount}
            </h4>
          </div>
        ))}
      </div>
    );
  };
  const Books1 = () => {
    const result = useQuery(ALL_BOOKS, { pollInterval: 2000 });
    const [selected, setSelected] = useState("");
    const [filterGener, setFilterGener] = useState("");
    const userGenre = me.data.me.favoriteGenre;
    if (result.loading || me.loading) {
      return <div>Loading....</div>;
    }
    const genresArray = result.data.allbooks.map((b) => b.genres);
    let genres = [].concat.apply([], genresArray);
    genres = [...new Set(genres)];
    console.log(genres);
    const options = genres.map((a) => ({
      value: a,
      label: a,
    }));

    const handleChange = (selected) => {
      setSelected(selected.label);
      console.log(selected);
      setFilterGener(selected.value);
    };
    return (
      <div>
        <h2>Books</h2>
        <h3>Filter by genres</h3>
        <Select
          value={selected.label}
          onChange={handleChange}
          options={options}
        />
        <button onClick={() => setFilterGener(userGenre)}>
          filter by favoriteGenre of user-> {userGenre}
        </button>
        <h3>author_____ published</h3>
        {result.data.allbooks
          .filter((f) => f.genres.includes(filterGener))
          .map((b) => (
            <div key={b.id}>
              {" "}
              <h2>{b.title}:</h2>
              <h4>
                {b.author.name}________ {b.published}
              </h4>
            </div>
          ))}
      </div>
    );
  };

  const padding = {
    padding: 5,
  };

  const [Authors, setAuthors] = useState(null);
  const [Books, setBooks] = useState(null);
  const [Fbooks, setFbooks] = useState(null);
  const [getAuthor, Authresult] = useLazyQuery(ALL_AUTHORS, {
    pollInterval: 2000,
  });
  const [getBook, Bookresult] = useLazyQuery(ALL_BOOKS, { pollInterval: 2000 });
  const [authorz, setAuthorz] = useState(null);
  const [genre, setGenre] = useState(null);
  const [getFbook, Fbookresult] = useLazyQuery(BOOKS_PAR, {
    variables: { genre, authorz },
    pollInterval: 2000,
  });

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  const filterBooks = async (e) => {
    await getFbook();
    e.preventDefault();
    if (Fbookresult.data) {
      setFbooks(Fbookresult.data.allbooksPar);
      console.log("@#", Fbookresult);
    }
  };

  const showAuthor = async () => {
    await getAuthor();
    setBooks(null);
    setFbooks(null);
    if (Authresult.data) {
      setAuthors(Authresult.data.allauthors);
    }
  };
  const showBook = async () => {
    await getBook();
    setAuthors(null);
    setFbooks(null);
    if (Bookresult.data) {
      setBooks(Bookresult.data.allbooks);
    }
  };
  useEffect(() => {
    if (Authresult.data) {
      setAuthors(Authresult.data.allauthors);
    }
  }, [Authresult.data]);

  useEffect(() => {
    if (Bookresult.data) {
      setBooks(Bookresult.data.allbooks);
    }
  }, [Bookresult.data]);

  useEffect(() => {
    if (Fbookresult.data) {
      setBooks(Bookresult.data.allbooks);
    }
  }, [Fbookresult.data]);

  return (
    <Router>
      <div>
        <Link style={padding} to="/home">
          <button>home</button>
        </Link>
        <Link style={padding} to="/Books">
          <button>Books</button>
        </Link>
        <Link style={padding} to="/Authors">
          <button>Authors</button>
        </Link>
        <Link style={padding} to="/addbook">
          <button>Add Book</button>
        </Link>
        <Link href="#" as="span">
          {token ? (
            <em style={padding}> {me.data.me.username} logged in</em>
          ) : (
            <Link style={padding} to="/login">
              login
            </Link>
          )}
        </Link>
        <button
          variant="primary"
          onClick={() => {
            window.localStorage.clear();
            setToken(null);
          }}
        >
          Log out
        </button>
      </div>

      <Switch>
        <Route path="/home">
          <div>
            <button
              onClick={() => {
                showAuthor();
              }}
            >
              Authors
            </button>
            <button onClick={() => showBook()}>Books</button>
            <div>
              <View
                Authors={Authors}
                Books={Books}
                close={() => {
                  setAuthors(null);
                  setBooks(null);
                }}
              />
            </div>
            <h2>FILTERED BOOKS WITH GraphQL query to the server. </h2>
            <View Books={Fbooks} />
            <div>
              {Books ? (
                <form onSubmit={filterBooks}>
                  <div>
                    author{" "}
                    <input
                      value={authorz}
                      onChange={({ target }) => setAuthorz(target.value)}
                      close={() => {
                        setFbooks(null);
                        setAuthors(null);
                      }}
                    />
                  </div>
                  <div>
                    genre{" "}
                    <input
                      type="string"
                      value={genre}
                      onChange={({ target }) => setGenre(target.value)}
                    />
                  </div>
                  <button type="submit">Search</button>
                </form>
              ) : (
                <h3>...</h3>
              )}
            </div>
          </div>
        </Route>
        <Route path="/authors">
          <Authors1 />
          <BirthyearForm />
        </Route>
        <Route path="/Books">
          <Books1 />
        </Route>
        <Route path="/addbook">
          {token ? (
            <div>
              <p>Roby</p>
              <BookForm />
            </div>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/Login">
          <div>
            <Notify errorMessage={errorMessage} />
            <h2>Login</h2>
            <LoginForm setToken={setToken} setError={notify} />
          </div>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
