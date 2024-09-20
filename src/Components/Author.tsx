import { Card } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/data';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormEvent, useEffect, useState } from 'react';
import { Schema } from '../../amplify/data/resource';
import "../App.css";
import Popup from './Popup';


const client = generateClient<Schema>();
function Author() {

    const [authors, setAuthors] = useState<Array<Schema["Author"]["type"]>>([]);
    const [authorToUpdate, setAuthorToUpdate] = useState<string | null>(null); // Tracks the author to update
    const [authorBooks, setAuthorBooks] = useState<{ [key: string]: Array<Schema["Book"]["type"]> }>({});

    useEffect(() => {
        client.models.Author?.observeQuery()?.subscribe({
            next: (data) => setAuthors([...data.items])
        });
    }, []);


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
        <div>
            <Card className='m-3 bg-white flex-row'>
                <div className='mb-3'>
                    <h3>Authors</h3>
                </div>
                <form className=' flex-col' onSubmit={handleCreate}>
                    <div className='col-span-6'>
                        <label htmlFor="authorName" className=''>Author Name: </label>
                        <input type="text" id="authorName" name="authorName" className='bg-zinc-400 rounded-md' />
                    </div>
                    <div>
                        <label htmlFor="authorDes" className=''>Description: </label>
                        <input type="text" id="authorDes" name="authorDes" className='bg-zinc-400 rounded-md' />
                    </div>
                    <br />
                    <input type="submit" value="Create Author" className='bg-blue-500 text-white p-2 rounded-xl' />
                </form>

                <ul className='bg-slate-400 border-solid m-2 text-white flex'>
                    {authors.map((author) => (
                        <div key={author.id}>
                            <li onClick={() => deleteAuthor(author.id)}>
                                <div>Author: {author.nameAuthor}</div>
                                <div>Description: {author.Description}</div>
                            </li>
                            <br />
                            Books by {author.nameAuthor}:
                            <ul>
                                {authorBooks[author.nameAuthor] && authorBooks[author.nameAuthor].length > 0 ? (
                                    authorBooks[author.nameAuthor].map((book) => (
                                        <li key={book.id}>
                                            Name: {book.nameBook} <br />
                                            Price: {book.price}$ <br />
                                            Author: {book.author}
                                        </li>
                                    ))
                                ) : (
                                    <button onClick={() => getBooksFromAuthor(author.nameAuthor)} className='bg-orange-300 p-1 rounded-lg'>
                                        Load Books
                                    </button>
                                )}
                            </ul>
                            <button className="btn btn-info" onClick={() => setAuthorToUpdate(author.id)}>Update</button>

                            {authorToUpdate === author.id && (
                                <Popup trigger={true} setTrigger={() => setAuthorToUpdate(null)}>
                                    <form className='' onSubmit={handleUpdate} id={author.id?.toString()}>
                                        <label htmlFor="authorNameUpdate">Author Name: </label>
                                        <input type="text" id="authorNameUpdate" name="authorNameUpdate" />
                                        <br />
                                        <label htmlFor="authorDesUpdate">Description: </label>
                                        <input type="text" id="authorDesUpdate" name="authorDesUpdate" />
                                        <input type="submit" value="Update Author" className="btn btn-success" />
                                    </form>
                                </Popup>
                            )}
                        </div>
                    ))}
                </ul>
            </Card>
        </div>
    )
}

export default Author