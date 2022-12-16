## About This Project

![Alt text](./readme-image/homepage.png "a title")

This web app translates the concepts of art history and art therapy into an interactive online learning experience.

[Website URL](https://the-healing-museum-makoto357.vercel.app/en)
[Demo Video](https://drive.google.com/file/d/1qG0zlCZ3tUxn1TJqtJh9wltSBE-iVtj5/view?usp=share_link)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Tech Stack

- The app is mainly built with the React Framework [Next.JS](https://nextjs.org/) (with [TypeScript](https://www.typescriptlang.org/)) and [Emotion CSS](https://emotion.sh/docs/introduction).
- A drawing board is created with [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API), [Rough.js](https://roughjs.com/) and [Perfect Freehand](https://github.com/steveruizok/perfect-freehand#readme) for users to draw their feelings.
- A collection map is implemented with [Google Maps API](https://developers.google.com/maps) for exploring highlighted artworks.
- A custom playlist is created and fetched from [YouTube API](https://developers.google.com/youtube) for the video gallery.
- Artworks and posts can be collected and saved to personal profiles, which include a section for users to drag and drop items (with [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd#readme)).
- User authentication and manipulation of user generated data is achieved with the help of [Firestore](https://firebase.google.com/products/firestore?gclid=Cj0KCQiAqOucBhDrARIsAPCQL1bSxD70VOyxo23yjbmGRU3KHKG9DjdSM8aG4po3-8lRlXhm_ENbOrcaAjUkEALw_wcB&gclsrc=aw.ds) and [Firebase Authentication](https://firebase.google.com/products/auth?gclid=Cj0KCQiAqOucBhDrARIsAPCQL1ZgbM76MkVttGmegkPSnqfgJ_6BInSzZm1gocycB7UpwIbI_uKLBAoaAk3cEALw_wcB&gclsrc=aw.ds).
- The homepage offers Chinese and English language options with [i18next](https://www.i18next.com/), and Facebook social sharing button ([next-share](https://github.com/Bunlong/next-share)) with [Vercel OG image](https://vercel.com/blog/introducing-vercel-og-image-generation-fast-dynamic-social-card-images) is installed.
- Data for this heavily content-based website is collected, edited and rewritten from WikiArt API and various art websites, before being compiled into - JSON files and stored on Firestore.
- A feedback form for users to record their journeys and upload drawings completed on the drawing board, images are stored on [Firestore Cloud Storage](https://firebase.google.com/products/storage).
- Accessible from devices of all viewport sizes (>360px) thanks to responsive web design.
- Used [ESLint](https://eslint.org/) to keep codes clean.

## Test Account

Email: kim@gmail.com  
Password: helloworld321

## Functional Map

## Website Features

The homepage provides CN/EN language options and social sharing button in the side menu:
![Alt text](./readme-image/homepage.png "a title")

Users can choose a theme color for each of their journeys:
![Alt text](./readme-image/theme-color.png "a title")

Lines, shapes and texts can be drawn on the canvas, and the drawing can be modified and downloaded:
![Alt text](./readme-image/drawing-board.png "a title")

An art quiz is designed to make artist recommendations to users:
![Alt text](./readme-image/quiz.png "a title")

Highlighted artworks of recommended artists are displayed on google maps for viewing, and clicking the images will lead to the next feature:
![Alt text](./readme-image/collection-map.png.png "a title")

Zoom, pinch and pan the artwork image to view details, collect by clicking on the heart icon or copy the link to clipboard:
![Alt text](./readme-image/artwork.png "a title")

Explore and collect more artworks:
![Alt text](./readme-image/artworks.png "a title")

Watch artist videos to learn and be inspired:
![Alt text](./readme-image/artist-video.png "a title")

Leave a few words or upload an image while reflecting on the experience:
![Alt text](./readme-image/form.png "a title")

Browse and leave comments on visitor posts to interact with other users:
![Alt text](./readme-image/visitor-posts.png "a title")

Arrange the order of favorite artworks and posts by dragging on the tiles:
![Alt text](./readme-image/user-profile.png "a title")
