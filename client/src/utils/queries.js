import { gql } from '@apollo/client';

export const QUERY_SINGLE_USER = gql`
  query getSingleUser($email: String!) {
    getSingleUser(email: $email) {
      _id
      username
      email
      savedBooks {
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

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
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
