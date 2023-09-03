import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { removeBookId } from '../utils/localStorage';

//importing queries and mutations
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_BOOK } from '../utils/mutations';
import { QUERY_ME } from '../utils/queries';

const SavedBooks = () => {

  //getting info about the logged in user
  const { loading, data } = useQuery(QUERY_ME);
  const me = data?.me || {};

  // console.log(me);
  const [deleteBook, { error }] = useMutation(DELETE_BOOK);


  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    try {
      const { data } = await deleteBook({
        variables: { id: me._id, bookToDelete: bookId }
      });
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(JSON.parse(JSON.stringify(err)));
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <div>
      <div className="text-light bg-dark p-5 fluid">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {me.savedBooks.length
            ? `Viewing ${me.savedBooks.length} saved ${me.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>

          {me.savedBooks.map((book) => {
            return (
              <Col md="4" key={book.image}>
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}

        </Row>
      </Container>
    </div>
  );
};

export default SavedBooks;
