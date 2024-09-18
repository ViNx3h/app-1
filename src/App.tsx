import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from "aws-amplify/data";
import { FormEvent, useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [authors, setAuthors] = useState<Array<Schema["Author"]["type"]>>([]);
  const [books, setBooks] = useState<Array<Schema["Book"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  useEffect(() => {
    client.models.Author?.observeQuery()?.subscribe({
      next: (data) => setAuthors([...data.items])
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  interface CreateAuthorFormElements extends HTMLFormControlsCollection {
    authorName: HTMLInputElement;
    authorDes: HTMLInputElement;
  }

  interface CreateAuthorForm extends HTMLFormElement {
    readonly elements: CreateAuthorFormElements;
  }


  const handleCreate = async (event: FormEvent<CreateAuthorForm>) => {

    event.preventDefault();
    const form = event.currentTarget;
    const nameAuthor = form.elements.authorName.value;
    const desAuthor = form.elements.authorDes.value;
    console.log(nameAuthor);
    console.log(desAuthor);

    await client.models?.Author?.create({
      nameAuthor: nameAuthor,
      Description: desAuthor,
    })
    // console.log(isCreate);
  }

  return (

    <Authenticator>
      {({ signOut }) => (
        <main>
          <h1>My todos</h1>
          <button onClick={createTodo}>+ new</button>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>{todo.content}</li>
            ))}
          </ul>
          <button onClick={signOut}>Sign out</button>
          <div>
            Authors:
            <form onSubmit={handleCreate}>
              <label htmlFor="authorName">AuthorName: </label>
              <input type="text" id="authorName" name="authorName" />
              <label htmlFor="authorDes">Description: </label>
              <input type="text" id="authorDes" name="authorDes" />
              <input type="submit" value="Create" />
            </form>
            <br />
            <ul>
              {authors.map((author) => (
                <li key={author.id}>
                  <div>{author.nameAuthor}</div>
                  <br />
                  <div>{author.Description}</div>
                </li>
              ))

              }
            </ul>
          </div>
        </main>

      )}
    </Authenticator>
  );
}

export default App;
