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

  const [books, setBooks] = useState<Array<Schema["Book"]["type"]>>([]);




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




  function deleteBook(id: any) {
    client.models.Book.delete({ id: id })
  }


  interface CreateBookFormElements extends HTMLFormControlsCollection {
    bookName: HTMLInputElement,
    Price: HTMLInputElement,
    authorBook: HTMLInputElement,
  }

  interface CreateBookForm extends HTMLFormElement {
    readonly elements: CreateBookFormElements;
  }



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



  return (

    <Authenticator>
      {({ signOut }) => (

        <main className='max-w-full '>

          <BrowserRouter> {/* Add BrowserRouter here */}
            <div className='bg-yellow-800 mt-3 h-15 rounded-xl flex justify-between'>
              <ul className='text-wrap flex'>
                <li className='mt-3'>
                  <Link to='/Book' className='no-underline text-orange-400'>Book page</Link> {/* Use Link */}
                </li>

              </ul>
              <button onClick={signOut} className="btn btn-danger mr-5 p-2 m-2">Sign out</button>
            </div>

            <Routes>
              {/* Define routes */}
              <Route path="/" element={
                <div className='max-w-full flex-col'>


                  <Author />

                  <Card className='m-3 flex-col '>
                    <h3>Books</h3>
                    <form onSubmit={handleCreateBook}>
                      <label htmlFor="bookName">Book Name: </label>
                      <input type="text" id='bookName' name='bookName' className='bg-slate-200 rounded-lg'/>
                      <br />
                      <label htmlFor="Price">Price: </label>
                      <input type="number" id='Price' name='Price' className='bg-slate-200 rounded-lg'/>$
                      <br />
                      <label htmlFor="authorBook">Author: </label>
                      <select name='authorBook' id='authorBook' className='bg-slate-200 rounded-lg'>
                        {authors.map((authorBook) => (
                          <option key={authorBook.id} value={authorBook.nameAuthor}>
                            {authorBook.nameAuthor}
                          </option>
                        ))}
                      </select>
                      <br />
                      <button type='submit' className="btn btn-primary">Create Book</button>
                    </form>

                    <ul className='bg-slate-400 text-white'>
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
