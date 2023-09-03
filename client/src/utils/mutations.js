import { gql } from '@apollo/client';

export const SAVE_BOOK = gql`
  mutation saveBook(_id: ID!, bookToSave: BookInput!) {
    saveBook(_id: $id, bookToSave: $bookToSave) {
      _id
      savedBooks {
        _id
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;


