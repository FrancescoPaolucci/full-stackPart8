import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import Select from "react-select";
const ADD_BIRTHDAY = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`;
const ALL_AUTHORS = gql`
  query {
    allauthors {
      name
      born
      bookCount
    }
  }
`;
const BirthyearForm = () => {
  const [name, setName] = useState("");
  const [setBornTo, SetsetBornTo] = useState("");
  const [birthyearMutation] = useMutation(ADD_BIRTHDAY);
  const result = useQuery(ALL_AUTHORS, {
    pollInterval: 2000,
  });
  const [selected, setSelected] = useState("");

  let names = [];
  result.loading
    ? console.log("...Loading")
    : (names = result.data.allauthors.map((a) => ({
        value: a.name,
        label: a.name,
      })));

  const options = names;

  const handleChange = (selected) => {
    setSelected(selected.label);
    console.log(selected);
    setName(selected.value);
  };

  const submit = (event) => {
    event.preventDefault();
    birthyearMutation({ variables: { name, setBornTo } });
    setName("");
    SetsetBornTo("");
  };
  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          Name:
          <Select
            value={selected.label}
            onChange={handleChange}
            options={options}
          />
        </div>
        <div>
          birthyear:
          <input
            type="number"
            id="input988744"
            value={setBornTo}
            onChange={({ target }) => SetsetBornTo(Number(target.value))}
          />
        </div>
        <button type="submit">add birthyear </button>
      </form>
    </div>
  );
};
export default BirthyearForm;
