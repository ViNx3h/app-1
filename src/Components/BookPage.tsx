import { generateClient } from 'aws-amplify/data';
import { FormEvent, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

function BookPage() {
    const [books, setBooks] = useState<Array<Schema["Book"]["type"]>>([]);
    const [authors, setAuthors] = useState<Array<Schema["Author"]["type"]>>([]);

    useEffect(() => {
        client.models.Book?.observeQuery()?.subscribe({
            next: (data) => setBooks([...data.items])
        })
    }, []);
    useEffect(() => {
        client.models.Author?.observeQuery()?.subscribe({
            next: (data) => setAuthors([...data.items])
        });
    }, []);

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
        <div className='container-fluid'>
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
    )
}

export default BookPage