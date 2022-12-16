## About This Project

![截圖 2022-12-16 12 43 04](https://user-images.githubusercontent.com/95968067/208024037-c527dd64-1e52-4954-875a-be4182a26975.png)

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

## Website Features

The homepage provides CN/EN language options and social sharing button in the side menu:
<img width="1280" alt="homepage" src="https://user-images.githubusercontent.com/95968067/208023121-7b372080-9cbb-4e25-8472-f8d265d89c98.png">

Users can choose a theme color for each of their journeys:
<img width="1280" alt="theme-color" src="https://user-images.githubusercontent.com/95968067/208023142-b382aa7a-be0f-4a97-b939-a09ac0c6f5f7.png">

Lines, shapes and texts can be drawn on the canvas, and the drawing can be modified and downloaded:
<img width="1280" alt="drawing-board" src="https://user-images.githubusercontent.com/95968067/208023478-441e7236-0672-4b9f-a966-82c32e5e9870.png">

An art quiz is designed to make artist recommendations to users:
![quiz](https://user-images.githubusercontent.com/95968067/208023203-6dba9b4a-af8f-46a5-94b4-0385a2b05636.png)

Highlighted artworks of recommended artists are displayed on google maps for viewing, and clicking the images will lead to the next feature:
<img width="1280" alt="collection-map" src="https://user-images.githubusercontent.com/95968067/208023280-9a8bbaf5-6170-40b2-b898-e71996f2187c.png">

Zoom, pinch and pan the artwork image to view details, collect by clicking on the heart icon or copy the link to clipboard:
![artwork](https://user-images.githubusercontent.com/95968067/208023229-da877822-318a-4b36-bd35-e594d5ff5761.png)

Explore and collect more artworks:
<img width="1280" alt="artworks" src="https://user-images.githubusercontent.com/95968067/208023314-27d0b326-f7f5-44c2-8d90-695624cca02b.png">

Watch artist videos to learn and be inspired:
<img width="1280" alt="artist-video" src="https://user-images.githubusercontent.com/95968067/208023344-e86b5d7b-513d-4181-b6f7-828191646c78.png">

Leave a few words or upload an image while reflecting on the experience:
![form](https://user-images.githubusercontent.com/95968067/208023738-b16b26da-99bc-47a7-b6f5-d118cd84c209.png)

Browse and leave comments on visitor posts to interact with other users:
![visitor-post](https://user-images.githubusercontent.com/95968067/208023411-c12736d6-7c78-448e-836d-bc250fdecbeb.png)

Arrange the order of favorite artworks and posts by dragging on the tiles:
<img width="1280" alt="user-profile" src="https://user-images.githubusercontent.com/95968067/208023442-dadd27c6-4f61-400c-9b1c-41227037f792.png">



