import styled from "@emotion/styled";
import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import { ThemeColorContext } from "../context/ColorContext";
import { YoutubeVideoPlayer } from "../components/YoutubePlayer";
import Image from "next/image";
import { collection, query, where, getDocs } from "firebase/firestore";

import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import "swiper/css/pagination";
import "swiper/css/scrollbar";
const VideoWrapper = styled.section`
  margin: 24px auto;
  min-height: 100vh;
`;

const YoutubeVideoWrapper = styled.div`
  width: 65vw;
  margin: 0 auto 70px;
`;

const SwiperWrapper = styled.section`
  margin: 0 70px;
  height: 216px;
`;

export async function getStaticProps() {
  const MY_PLAYLIST = process.env.YOUTUBE_PLAYLIST_ID;
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const REQUEST_URL = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${MY_PLAYLIST}&key=${API_KEY}&maxResults=50`;
  const response = await fetch(REQUEST_URL);
  const results = await response?.json();
  const allResults = JSON.parse(JSON.stringify(results));
  return {
    props: { results: allResults.items || null },
    revalidate: 10,
  };
  //set how many seconds you want to revalidate data, if there's new code then it will rebuild
}

export default function ArtistVideo({ results }) {
  const { user } = useAuth();
  const [artist, setArtist] = useState("");
  console.log(results);
  interface IVideo {
    id: string | undefined;
    snippet: {
      title: string | undefined;
      resourceId: { videoId: string | undefined };
    };
  }

  const [currentVideo, setCurrentVideo] = useState(null);
  // console.log(currentVideo.snippet.title);
  const [playing, setPlaying] = useState(false);
  const [themeColor] = useContext(ThemeColorContext);

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
        results?.filter((result) =>
          result?.snippet.title
            .toLowerCase()
            .includes(recommendedArtist.split("-").slice(1))
        )[0]
      );
    };
    getArtist();
  }, [user?.uid, results]);

  return (
    <VideoWrapper>
      <YoutubeVideoWrapper>
        <YoutubeVideoPlayer
          key={currentVideo?.snippet?.title}
          id={currentVideo?.snippet?.resourceId.videoId}
          playing={onplaying}
        />
      </YoutubeVideoWrapper>
      <SwiperWrapper>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={4}
          navigation
          loop
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log("slide change")}
        >
          {results &&
            results
              ?.filter((result) =>
                result?.snippet.title
                  .toLowerCase()
                  .includes(artist.split("-").slice(1))
              )
              .map((video) => (
                <SwiperSlide key={video.id}>
                  <div
                    role="button"
                    onClick={() => {
                      setCurrentVideo(video);
                      setPlaying(true);
                    }}
                  >
                    <Image
                      src={
                        video.snippet.thumbnails.maxres?.url ||
                        video.snippet.thumbnails.medium?.url
                      }
                      // layout="intrinsic"
                      width={1280}
                      height={720}
                      alt={video.snippet.title}
                    />
                    <h1>
                      <strong>{video.snippet.title}</strong>
                    </h1>
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>
      </SwiperWrapper>
      <div style={{ textAlign: "right" }}>
        <Link href="/form">
          <p>And Finally...</p>
        </Link>
      </div>
      <div
        style={{ background: themeColor, height: "500px", width: "250px" }}
      ></div>
    </VideoWrapper>
  );
}
