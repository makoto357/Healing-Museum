import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { db } from "../config/firebase";
import { YoutubeVideoPlayer } from "../components/YoutubePlayer";
import SignpostButton from "../components/Button";
import "react-toastify/dist/ReactToastify.css";
const Wrapper = styled.div`
  height: 85%;
  padding-top: 10px;
`;

const YoutubeVideoWrapper = styled.div`
  width: 50vw;
  margin: 0 auto 50px;

  @media screen and (max-width: 800px) {
    width: 80vw;
  }
`;

const SwiperWrapper = styled.section`
  margin: 0 70px;

  @media screen and (max-width: 650px) {
    width: 80vw;
    margin: 0 auto;
  }
`;
const SildeImage = styled.div`
  cursor: pointer;
  font-size: 0.5rem;
`;
export default function ArtistVideo() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const { user } = useAuth();
  const [artist, setArtist] = useState("");
  console.log(artist?.split("-").slice(1, 2));

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
      const q = query(collection(db, "users"), where("id", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => doc.data() as any);
      const recommendedArtist =
        docs[0].visitorJourney[docs[0].visitorJourney.length - 1]
          ?.recommendedArtist;
      if (!recommendedArtist) {
        toast(() => (
          <div>
            <p>Take the art quiz to get your artist recommendation!</p>
            <div style={{ width: "100%" }}>
              <button
                style={{
                  marginTop: "5px",
                  padding: "3px 10px",
                  background: "black",
                  color: "white",
                }}
                onClick={() => router.push("/quiz")}
              >
                Take a quiz
              </button>
            </div>
          </div>
        ));

        return;
      }
      setArtist(recommendedArtist);
    };

    const getVideos = async () => {
      const REQUEST_URL = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLx8RujK7Fijbp0NHNGNhW8uyVL_sC26Hx&key=AIzaSyBzzO-nkGKBcmL4IQsVRZHXS6Nr-axv8Sw&maxResults=50`;
      const response = await fetch(REQUEST_URL);
      const results = await response.json();
      console.log(results?.items.map((item) => item?.title));
      setVideos(
        results?.items.filter((item) =>
          item?.snippet.title
            .toLowerCase()
            .includes(artist?.split("-").slice(1, 2))
        )
      );
      setCurrentVideo(
        results?.items.filter((item) =>
          item?.snippet.title
            .toLowerCase()
            .includes(artist.split("-").slice(1, 2))
        )[0]
      );
    };
    const getCurrentVideo = async () => {
      if (user) {
        await getArtist();
      }
      await getVideos();
    };
    getCurrentVideo();
  }, [user, artist, router]);

  return (
    <Wrapper>
      <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
      />

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
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            600: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            800: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1200: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
            3000: {
              slidesPerView: 5,
              spaceBetween: 50,
            },
          }}
        >
          {videos &&
            videos.map((video) => (
              <SwiperSlide key={video.id}>
                <SildeImage
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

                  <h1>
                    <strong>{video.snippet.title}</strong>
                  </h1>
                </SildeImage>
              </SwiperSlide>
            ))}
        </Swiper>
      </SwiperWrapper>
      <SignpostButton href="/form">Express your feelings</SignpostButton>
    </Wrapper>
  );
}
