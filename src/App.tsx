import { Authenticator, Card } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from "aws-amplify/data";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormEvent, useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import type { Schema } from "../amplify/data/resource";
import "../src/App.css";
import Author from './Components/Author';
import BookPage from './Components/BookPage';

const client = generateClient<Schema>();

function App() {
  const [authors, setAuthors] = useState<Array<Schema["Author"]["type"]>>([]);
  const [authorToUpdate, setAuthorToUpdate] = useState<string | null>(null); // Tracks the author to update
  const [books, setBooks] = useState<Array<Schema["Book"]["type"]>>([]);
  const [authorBooks, setAuthorBooks] = useState<{ [key: string]: Array<Schema["Book"]["type"]> }>({});



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

  async function getBooksFromAuthor(name: string) {
    const result = await client.models.Book.list({
      filter: { author: { eq: name } }
    });

    // Access the list of books from the `data` field
    const booksByAuthor = result.data;

    // Updating the state for the specific author
    setAuthorBooks(prev => ({ ...prev, [name]: booksByAuthor }));
  }


  function deleteAuthor(id: any) {
    client.models.Author.delete({ id: id })
  }

  function deleteBook(id: any) {
    client.models.Book.delete({ id: id })
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
    Price: HTMLInputElement,
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
    const Price = form.elements.Price.value.valueOf();
    const authorBook = form.elements.authorBook.value;

    await client.models?.Book?.create({
      nameBook: nameBook,
      price: Price,
      author: authorBook,
    });
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

          <BrowserRouter> {/* Add BrowserRouter here */}
            <div className='nav-bar'>
              <ul>
                <li>
                  <Link to='/Book'>Book page</Link> {/* Use Link */}
                </li>
              </ul>
            </div>

            <Routes>
              {/* Define routes */}
              <Route path="/" element={
                <div className='container-fluid d-flex'>
                  <button onClick={signOut} className="btn btn-danger">Sign out</button>

                  <Author />

                  <Card className='book col-6 mt-3'>
                    <h3>Books</h3>
                    <form onSubmit={handleCreateBook}>
                      <label htmlFor="bookName">Book Name: </label>
                      <input type="text" id='bookName' name='bookName' />
                      <label htmlFor="Price">Price: </label>
                      <input type="number" id='Price' name='Price' />$
                      <label htmlFor="authorBook">Author: </label>
                      <select name='authorBook' id='authorBook'>
                        {authors.map((authorBook) => (
                          <option key={authorBook.id} value={authorBook.nameAuthor}>
                            {authorBook.nameAuthor}
                          </option>
                        ))}
                      </select>
                      <button type='submit' className="btn btn-primary">Create Book</button>
                    </form>

                    <ul className='card-map'>
                      {books.map((book) => (
                        <li onClick={() => deleteBook(book.id)} key={book.id}>
                          Name: {book.nameBook} <br />
                          Price: {book.price}$ <br />
                          Author: {book.author}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              } />

              {/* Route for Book Page */}
              <Route path="/Book" element={<BookPage />} />
            </Routes>
          </BrowserRouter>
        </main>

      )}
    </Authenticator>
  );

}


export default App;
