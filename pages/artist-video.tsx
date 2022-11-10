import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import { ThemeColorContext } from "../context/ColorContext";
import { YoutubeVideoPlayer } from "../components/youtubePlayer";
import Head from "next/head";
import Image from "next/image";
import { Box, Center, Heading, SimpleGrid } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import noImage from "../asset/no-thumbnail.jpeg";
import {
  collection,
  onSnapshot,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  Timestamp,
  orderBy,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

export default function ArtistVideo({ results }) {
  const { user } = useAuth();
  const [artist, setArtist] = useState("");

  const [currentVideo, setCurrentVideo] = useState({
    title: "",
    snippet: {
      resourceId: { videoId: "" },
    },
  });
  // const [playing, setPlaying] = useState(false);
  console.log(
    results?.filter((result) =>
      result?.snippet.title.toLowerCase().includes(artist.split("-").slice(1))
    )[0]
  );
  const [themeColor] = useContext(ThemeColorContext);
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const getArtist = async () => {
      const q = query(collection(db, "users"), where("id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => doc.data() as any);
      const recommendedArtist =
        docs[0].visitorJourney[docs[0].visitorJourney.length - 1]
          .recommendedArtist;
      setArtist(recommendedArtist);
      setCurrentVideo(
        results.filter((result) =>
          result?.snippet.title
            .toLowerCase()
            .includes(recommendedArtist.split("-").slice(1))
        )[0]
      );
    };
    getArtist();
  }, [user?.uid]);

  return (
    <>
      <Box width="100%" mx="auto" my={4}>
        <Heading my={8} as="h1" textAlign="center">
          YouTube Video Gallery{" "}
        </Heading>
        <Box
          maxWidth="720px"
          mx="auto"
          p={4}
          borderRadius="lg"
          boxShadow="2xl"
          my={8}
        >
          <YoutubeVideoPlayer
            key={currentVideo.title}
            id={currentVideo.snippet.resourceId.videoId}
            playing={onplaying}
          />
        </Box>

        <SimpleGrid columns={[1, 2, 3]} spacing={8}>
          {/* 1 column for sm, 2 for md and 3 for large */}
          {results &&
            results
              .filter((result) =>
                result?.snippet.title
                  .toLowerCase()
                  .includes(artist.split("-").slice(1))
              )
              .map((video) => (
                <Box key={video.id} mx={4}>
                  <Image
                    src={video.snippet.thumbnails.maxres?.url || noImage}
                    // layout="intrinsic"
                    width={1280}
                    height={720}
                    alt={video.snippet.title}
                  />
                  <Heading
                    as="h5"
                    fontSize="sm"
                    textAlign="left"
                    noOfLines={1}
                    mb={2}
                  >
                    {video.snippet.title}
                  </Heading>
                  <Center>
                    <Button
                      mx="auto"
                      my={4}
                      colorScheme="red"
                      onClick={() => {
                        setCurrentVideo(video);
                        // setPlaying(true);
                        scrollTop();
                      }}
                    >
                      Watch Now
                    </Button>
                  </Center>
                </Box>
              ))}
        </SimpleGrid>
      </Box>

      <div style={{ textAlign: "right" }}>
        <Link href="/form">
          <p>And Finally...</p>
        </Link>
      </div>
      <div
        style={{ background: themeColor, height: "500px", width: "250px" }}
      ></div>
    </>
  );
}

export async function getStaticProps() {
  const MY_PLAYLIST = process.env.YOUTUBE_PLAYLIST_ID;
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const REQUEST_URL = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${MY_PLAYLIST}&key=${API_KEY}&maxResults=50`;
  const response = await fetch(REQUEST_URL);
  const results = await response.json();

  return {
    props: { results: results.items },
    revalidate: 10,
  };
  //set how many seconds you want to revalidate data, if there's new code then it will rebuild
}
