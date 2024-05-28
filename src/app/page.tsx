import React from 'react';
import Page from '../components/Page';
import FileExplorer from 'src/components/FileExplorer';

const HomePage: React.FC = () => (
  <div className="flex flex-row">
    <FileExplorer pagePath="" />
    <div className="w-full h-screen p-10 overflow-hidden">
      <Page
        title='Home'
        content={[
          {
            type: 'h1',
            properties: {
              content: 'Welcome to My Notes Vault',
            }
          },
          {
            type: 'text',
            properties: {
              content: 'Welcome to my collection of notes on various topics. This site serves as an organized repository of all my notes. These notes are converted from **Markdown** to **HTML** and hosted here for easy access and reference.'
            }
          },
          {
            type: 'h2',
            properties: {
              content: 'About This Site'
            }
          },
          {
            type: 'text',
            properties: {
              content: 'This site is built using **Markdown** files stored in an [Obsidian vault](https://obsidian.md/.md). The notes are converted to **HTML** using a [custom renderer](https://github.com/eroxl/notes-renderer.md) I developed. The purpose of this site is to provide an easy-to-navigate and visually appealing way to review and study my notes.'
            }
          },
          {
            type: 'h2',
            properties: {
              content: 'How to Use This Site'
            }
          },
          {
            type: 'text',
            properties: {
              content: "Navigating through this site is designed to be intuitive and straightforward. You can use the sidebar to navigate different subjects and pages and use the links between documents to view related materials.",
            }
          },
          {
            type: 'h2',
            properties: {
              content: 'Contact'
            }
          },
          {
            type: 'text',
            properties: {
              content: 'For any inquiries or feedback, please reach out to me at:'
            }
          },
          {
            type: 'list',
            properties: {
              content: '**Email**: evan@erox.one'
            }
          },
          {
            type: 'list',
            properties: {
              content: '**Github**: [[https://github.com/Eroxl]]'
            }
          },
          {
            type: 'text',
            properties: {
              content: 'Thank you for visiting, and happy studying!',
            }
          }
        ]}
      />
    </div>
  </div>
);

export default HomePage;
