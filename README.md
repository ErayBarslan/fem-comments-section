<h1 align="center">Interactive Comments Section</h1>

<div align="center">
This is a solution to the <a href="https://www.frontendmentor.io/challenges/interactive-comments-section-iG1RugEG9" target="_blank">Interactive comments section challenge on Frontend Mentor</a>
</div>

<div align="center">
  <h3>
    <a href="https://fem-comments-section.vercel.app">
      Live
    </a>
    <span> | </span>
    <a href="https://github.com/eraybarslan/fem-comments-section">
      Solution
    </a>
  </h3>
</div>

## Table of Contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Built With](#built-with)
  - [Screenshots](#screenshots)
- [Features](#features)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Create, Read, Update, and Delete comments and replies
- Upvote and downvote comments
- **Bonus**: If you're building a purely front-end project, use `localStorage` to save the current state in the browser that persists when the browser is refreshed.
- **Bonus**: Instead of using the `createdAt` strings from the `data.json` file, try using timestamps and dynamically track the time since the comment or reply was posted.

### Built With

- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [Styled Components](https://styled-components.com/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Socket.io](https://socket.io/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)

### Screenshots

![desktop_solution](/client/public/screenshots/ss_desktop.png)
![mobile_solution](/client/public/screenshots/ss_mobile.png)

## Features

- User story: I can view comments without logging in.
- User story: I can register a new account.
- User story: I can login and lagout.
- User story: I can see my profile details.
- User story: I can edit my details including: photo, username, bio and password.
- User story: I can view other user's profile card.
- User story: I can send comments or reply to others.
- User story: I can mention other users in comments.
- User story: I can edit and delete my comments.
- User story: I can hide or show replies to a comment.
- User story: I can upvote and downvote comments.

- Use case: If a user tries to send, reply, vote a comment; will be redirected to register page.
- Use case: If a user tries to access profile page, will be redirected to comments page.
- Use case: 2 level deep nested comments replies will be hidden by default and can be navigated through **continue this comment** button beneath the parent comment.