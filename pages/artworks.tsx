import Link from "next/link";
import { useEffect, useRef, useState, useContext } from "react";

export default function Artworks() {
  const [artworkID, setArtworkID] = useState([]);
  useEffect(() => {
    const getArtist = async () => {
      const res = await fetch(
        "https://collectionapi.metmuseum.org/public/collection/v1/search?q=sunflowers"
      );
      const result = await res.json();
      console.log(result.objectIDs);
      setArtworkID(result.objectIDs);
    };
    getArtist();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     fetch(
  //       "https://collectionapi.metmuseum.org/public/collection/v1/search?q=sunflowers"
  //     )
  //       .then((res) => res.json())
  //       .then((result) => {
  //         console.log(result);
  //       })
  //       .catch(console.log);
  //   };
  //   fetchData();
  // }, []);

  return (
    <>
      <Link href="/">
        <p>Back to Index Page</p>
      </Link>
    </>
  );
}
