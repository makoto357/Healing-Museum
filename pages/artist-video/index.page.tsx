import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { getUserInfo } from "../../utils/firebaseFuncs";
import AlertBox from "../../components/AlertBox";
import { useAuth } from "../../context/AuthContext";
import SignpostButton from "../../components/Button";
import { YoutubeVideoPlayer } from "./PlayerComponent";

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

const Image = styled.img``;
interface IVideo {
  id?: string;
  snippet?: {
    title?: string;
    resourceId?: { videoId: string };
    thumbnails?: {
      maxres?: { url: string };
      medium?: { url: string };
    };
  };
}

const swiperBreakpoints = {
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
};

export default function ArtistVideo() {
  const router = useRouter();
  const [videos, setVideos] = useState<IVideo[]>([]);
  const { user } = useAuth();
  const [artist, setArtist] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [playing, setPlaying] = useState(false);

  const [currentVideo, setCurrentVideo] = useState<IVideo>({});

  const fetchVideos = async () => {
    const REQUEST_URL = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLx8RujK7Fijbp0NHNGNhW8uyVL_sC26Hx&key=AIzaSyBzzO-nkGKBcmL4IQsVRZHXS6Nr-axv8Sw&maxResults=50`;
    const response = await fetch(REQUEST_URL);
    return response.json();
  };

  const { data, isSuccess } = useQuery("videoData", fetchVideos);
  useEffect(() => {
    const getArtist = async () => {
      getUserInfo(user.uid);
      const setArtistForVideo = async () => {
        const { recommendedArtist } = await getUserInfo(user.uid);
        if (!recommendedArtist) {
          toast(() => <AlertBox />, {
            closeOnClick: false,
          });
          return;
        }
        setArtist(recommendedArtist);
      };
      setArtistForVideo();
    };

    const getVideos = async () => {
      const VideoResults = data?.items.filter((item: IVideo) =>
        item?.snippet?.title
          ?.toLowerCase()
          .includes(artist?.split("-")?.slice(1, 2)[0])
      );
      setVideos(VideoResults);
      {
        isSuccess && setCurrentVideo(VideoResults[0]);
      }
    };
    const getCurrentVideo = async () => {
      if (user) {
        getArtist();
      }
      getVideos();
    };
    getCurrentVideo();
  }, [user, artist, router, data?.items, isSuccess]);

  return (
    <Wrapper>
      <YoutubeVideoWrapper>
        <YoutubeVideoPlayer
          id={currentVideo?.snippet?.resourceId?.videoId}
          playing={playing}
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
          breakpoints={swiperBreakpoints}
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
                      video?.snippet?.thumbnails?.maxres?.url ||
                      video?.snippet?.thumbnails?.medium?.url
                    }
                    width={1280}
                    height={720}
                    alt={video?.snippet?.title}
                  />

                  <h1>
                    <strong>{video?.snippet?.title}</strong>
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
