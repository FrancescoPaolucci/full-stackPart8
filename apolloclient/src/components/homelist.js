import React from "react";

const View = ({ Authors, Books, close }) => {
  if (Authors) {
    return (
      <div>
        {Authors.map((a) => (
          <div key={a.name}>
            {a.name} {a.born}
          </div>
        ))}
        <button onClick={close}>close</button>
      </div>
    );
  } else if (Books) {
    return (
      <div>
        {Books.map((b) => (
          <div key={b.id}>
            {b.title}. By: {b.author.name}
          </div>
        ))}
        <button onClick={close}>close</button>
      </div>
    );
  }
  return null;
};

export default View;
