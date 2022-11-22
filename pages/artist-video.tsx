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
const YoutubeVideoWrapper = styled.div`
  width: 65vw;
  margin: 0 auto 70px;
`;

const SwiperWrapper = styled.section`
  margin: 0 70px;
`;

export default function ArtistVideo() {
  const [videos, setVideos] = useState([]);
  const { user } = useAuth();
  const [artist, setArtist] = useState("");
  const [playing, setPlaying] = useState(false);
  interface IVideo {
    id: string | undefined;
    snippet: {
      title: string | undefined;
      resourceId: { videoId: string | undefined };
    };
  }
  const [currentVideo, setCurrentVideo] = useState<IVideo>({
    id: undefined,
    snippet: {
      title: undefined,
      resourceId: { videoId: undefined },
    },
  });
  useEffect(() => {
    const getArtist = async () => {
      const q = query(collection(db, "users"), where("id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => doc.data() as any);
      const recommendedArtist =
        docs[0].visitorJourney[docs[0].visitorJourney.length - 1]
          .recommendedArtist;
      setArtist(recommendedArtist);
    };

    const getVideos = async () => {
      const REQUEST_URL = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLx8RujK7Fijbp0NHNGNhW8uyVL_sC26Hx&key=AIzaSyBzzO-nkGKBcmL4IQsVRZHXS6Nr-axv8Sw&maxResults=50`;
      const response = await fetch(REQUEST_URL);
      const results = await response.json();
      console.log(results);
      setVideos(
        results?.items.filter((item) =>
          item?.snippet.title.toLowerCase().includes(artist.split("-").slice(1))
        )
      );
      setCurrentVideo(
        results?.items.filter((item) =>
          item?.snippet.title.toLowerCase().includes(artist.split("-").slice(1))
        )[0]
      );
    };
    const getCurrentVideo = async () => {
      await getArtist();
      await getVideos();
    };
    getCurrentVideo();
  }, [user?.uid, artist]);

  return (
    <section style={{ height: "85%", paddingTop: "104px" }}>
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
          {videos &&
            videos.map((video) => (
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
                    width={1280}
                    height={720}
                    alt={video.snippet.title}
                  />
                  <h1 style={{ fontSize: "0.5rem" }}>
                    <strong>{video.snippet.title}</strong>
                  </h1>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </SwiperWrapper>
      <div style={{ textAlign: "left" }}>
        <Link href="/form">
          <p>And Finally...</p>
        </Link>
      </div>
    </section>
  );
}
