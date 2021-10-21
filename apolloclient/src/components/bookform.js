import React, { useState } from "react";
import {
  gql,
  useMutation,
  useSubscription,
  useApolloClient,
  useQuery,
} from "@apollo/client";
const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      title
      published
      author {
        id
        name
      }
      genres
      id
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
export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      published
      author {
        id
        name
      }
      genres
      id
    }
  }
`;

const BookForm = () => {
  const [title, setTitle] = useState("");
  const [published, setPublished] = useState("");
  const [author, setAuthor] = useState("");
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState("");
  const [createBook] = useMutation(ADD_BOOK);
  const client = useApolloClient();
  const books = useQuery(ALL_BOOKS, { pollInterval: 2000 });

  const updateCacheWith = (createBook) => {
    const includedIn = (set, object) =>
      set.map((p) => p.id).includes(object.id);

    const dataInStore = client.readQuery({ query: ALL_BOOKS });
    if (!includedIn(dataInStore.allbooks, createBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allbooks: dataInStore.allbooks.concat(createBook) },
      });
    }
  };

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const createBook = subscriptionData.data.bookAdded;
      console.log(subscriptionData);
      updateCacheWith(createBook);
      window.alert(subscriptionData.data.bookAdded.title);
    },
  });

  const submit = (event) => {
    event.preventDefault();
    createBook({ variables: { title, published, author, genres } });
    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres("");
  };
  const addGenre = () => {
    setGenres(genres.concat(genre));
    console.log(genres);
  };
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>
          title{" "}
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Published:{" "}
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
          />
        </div>
        <div>
          Author{" "}
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          Genres{" "}
          <input
            value={genre}
            onChange={({ target }) => {
              setGenre(target.value);
            }}
          />
          <button onClick={addGenre} type="button">
            +
          </button>
        </div>
        <div>genres: {genres}</div>
        <button type="submit">add book </button>
      </form>
    </div>
  );
};

export default BookForm;
