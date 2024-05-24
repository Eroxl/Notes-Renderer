import React from 'react';
import Page from '../components/Page';

const HomePage: React.FC = () => (
  <Page
    title='Home'
    content={[
      {
        type: "h1",
        properties: {
          content: "H1",
        },
      },
      {
        type: "h2",
        properties: {
          content: "H2",
        },
      },
      {
        type: "h3",
        properties: {
          content: "H3",
        },
      },
      {
        type: "h4",
        properties: {
          content: "H4",
        },
      },
      {
        type: "h5",
        properties: {
          content: "H5",
        },
      },
      {
        type: "h6",
        properties: {
          content: "H6",
        },
      },
      {
        type: "quote",
        properties: {
          content: "Quote"
        }
      },
      {
        type: "callout",
        properties: {
          type: "Note",
          content: "Note Callout"
        }
      },
      {
        type: "callout",
        properties: {
          type: "Warning",
          content: "Warning Callout"
        }
      },
      {
        type: "text",
        properties: {
          content: "Welcome to my vault"
        }
      }
    ]}
  />
);

export default HomePage;
