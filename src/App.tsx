import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from "aws-amplify/data";

import { FormEvent, useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import Popup from './Components/Popup';

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [authors, setAuthors] = useState<Array<Schema["Author"]["type"]>>([]);
  const [authorToUpdate, setAuthorToUpdate] = useState<string | null>(null); // Tracks the author to update
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

  useEffect(() => {
    client.models.Book?.observeQuery()?.subscribe({
      next: (data) => setBooks([...data.items])
    })
  }, [])

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function deleteAuthor(id: any) {
    client.models.Author.delete({ id: id })
  }

  interface CreateAuthorFormElements extends HTMLFormControlsCollection {
    authorName: HTMLInputElement;
    authorDes: HTMLInputElement;
  }

  interface CreateAuthorForm extends HTMLFormElement {
    readonly elements: CreateAuthorFormElements;
  }

  interface UpdateAuthorFormElements extends HTMLFormControlsCollection {
    authorNameUpdate: HTMLInputElement;
    authorDesUpdate: HTMLInputElement;
  }

  interface UpdateAuthorForm extends HTMLFormElement {
    readonly elements: UpdateAuthorFormElements;
  }

  interface CreateBookFormElements extends HTMLFormControlsCollection {
    bookName: HTMLInputElement,
    Price: HTMLInputElement["valueAsNumber"],
    authorBook: HTMLInputElement,
  }

  interface CreateBookForm extends HTMLFormElement {
    readonly elements: CreateBookFormElements;
  }

  const handleCreate = async (event: FormEvent<CreateAuthorForm>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nameAuthor = form.elements.authorName.value;
    const desAuthor = form.elements.authorDes.value;

    await client.models?.Author?.create({
      nameAuthor: nameAuthor,
      Description: desAuthor,
    });
  };

  const handleCreateBook = async (event: FormEvent<CreateBookForm>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nameBook = form.elements.bookName.value;
    const Price = form.elements.Price.valueOf();
    const authorBook = form.elements.authorBook.value;

    const isCreate = await client.models?.Book?.create({
      nameBook: nameBook,
      price: Price,
      author: authorBook,

    });

    console.log(isCreate)

  }


  const handleUpdate = async (event: FormEvent<UpdateAuthorForm>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nameAuthor = form.elements?.authorNameUpdate?.value;
    const desAuthor = form.elements?.authorDesUpdate?.value;
    const getId = form.id;

    await client.models?.Author?.update({
      id: getId,
      nameAuthor: nameAuthor,
      Description: desAuthor,
    });
    setAuthorToUpdate(null); // Close the popup after update
  };



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
                <div key={author.id}>
                  <li onClick={() => deleteAuthor(author.id)}>
                    <div>Author: {author.nameAuthor}</div>
                    <br />
                    <div>Description: {author.Description}</div>
                  </li>
                  <button onClick={() => setAuthorToUpdate(author.id)}>Update</button>

                  {/* Show Popup only for the selected author */}
                  {authorToUpdate === author.id && (
                    <Popup trigger={true} setTrigger={() => setAuthorToUpdate(null)}>
                      <form onSubmit={handleUpdate} id={author.id?.toString()}>
                        <label htmlFor="authorNameUpdate">AuthorName: </label>
                        <input type="text" id="authorNameUpdate" name="authorNameUpdate" />
                        <br />
                        <label htmlFor="authorDesUpdate">Description: </label>
                        <input type="text" id="authorDesUpdate" name="authorDesUpdate" />
                        <br />
                        <input type="submit" value="Update" />
                      </form>
                    </Popup>
                  )}
                </div>
              ))}
            </ul>
            <ul style={{ backgroundColor: "white" }}>
              <form onSubmit={handleCreateBook}>
                <label htmlFor="bookName">Book: </label>
                <input type="text" id='bookName' name='bookName' />
                <br />
                <label htmlFor="Price">Price: </label>
                <input type="number" id='Price' name='Price' />$
                <br />
                Author: <select name='authorBook' id='authorBook'>
                  {authors.map((authorBook) => (
                    <>
                      <option key={authorBook.id} value={authorBook.nameAuthor}>{authorBook.nameAuthor}</option>
                    </>
                  ))}
                </select>
                <br />
                <button type='submit'>Create book</button>
              </form>
              {books.map((book) => (
                <>
                  <li key={book.id}>Name: {book.nameBook}</li>
                  <li key={book.id}>Price: {book.price}$</li>
                  <li key={book.id}>Author: {book.author}</li>
                </>
              ))}
            </ul>
          </div>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
