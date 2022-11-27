import styled from "@emotion/styled";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { FacebookShareButton } from "next-share";
import github from "../asset/github.png";
import fb from "../asset/fb.svg";
import profile from "../asset/profile.png";
import logout from "../asset/log-out.png";

import brandIcon from "../asset/healing-museum-website-icon.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import close from "../asset/cancel-white.png";
import toggle from "../asset/menu.png";
import language from "../asset/translate.png";
import { useRouter } from "next/router";
import SignpostButton from "../components/Button";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
// import museumOfMind from "../asset/museum-of-the-mind.jpeg";
import happiness from "../asset/happiness.png";
import benUri from "../asset/ben-uri.jpeg";
const Menulist = styled.ul<{ $menuStyle: string }>`
  z-index: 20;
  position: absolute;
  top: 0;
  list-style: none;
  width: 300px;
  height: 100vh;
  background-color: #2c2b2c;
  transform: ${(props) => props.$menuStyle};
  transition: transform 300ms;
  color: white;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CloseMenuIcon = styled.div`
  background-image: url(${close.src});
  width: 20px;
  height: 20px;
  background-size: cover;
  margin-left: auto;
`;

const MenuToggle = styled.div`
  background-image: url(${toggle.src});
  background-size: cover;
  height: 30px;
  width: 30px;
  position: fixed;
  top: 24px;
  left: 24px;
  cursor: pointer;
`;

const TranslationToggle = styled.div`
  background-image: url(${language.src});
  background-size: cover;
  height: 30px;
  width: 30px;
  position: fixed;
  top: 24px;
  left: 64px;
  cursor: pointer;
`;

const Page = styled.div`
  background-image: linear-gradient(180deg, transparent 95%, white 0);
  background-repeat: no-repeat;
  background-size: 0 100%;
  transition: background-size 0.4s ease;
  width: fit-content;
  margin-bottom: 20px;
  &:hover {
    background-size: 100% 100%;
  }
`;
const FBicon = styled.div`
  background-image: url(${fb.src});
  width: 30px;
  height: 30px;
  background-size: cover;
  &:hover {
    border: 2px solid #2c2b2c;
  }
`;
const ProfileIcon = styled.div`
  background-image: url(${profile.src});
  width: 30px;
  height: 30px;
  background-size: cover;
  &:hover {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    border: 2px solid #2c2b2c;
  }
`;

const LogoutIcon = styled.div`
  background-image: url(${logout.src});
  width: 30px;
  height: 30px;
  background-size: cover;
  &:hover {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    border: 2px solid #2c2b2c;
  }
`;

const SwiperWrapper = styled.section`
  width: 80vw;
  height: 450px;
`;

const bannerImages = [
  // {
  //   image: museumOfMind.src,
  //   caption: "",
  // "The Bethlem Museum of the Mind in London, situated within the gounds of Bethlem Royal Hospital, holds an internationally renowned collection of archives, art and historic objects, which together offer an unparalleled resource to support the history of mental healthcare and treatment. ",
  //   webpage: "https://museumofthemind.org.uk/",
  // },
  {
    image: happiness.src,
    caption: "Exhibiitons on wellbeing at the Wellcome Collection.",
    webpage:
      "https://wellcomecollection.org/?gclid=Cj0KCQiAveebBhD_ARIsAFaAvrHyq9spdBGfJbkRv20ZALgIwL1m7W0kWCU0daQiTQ-wG9UMLKhnfwQaAoc1EALw_wcB",
  },
  {
    image: benUri.src,
    caption: "Art therapy session in the Ben Uri Museum and Gallery.",
    webpage: "https://benuri.org/artsandhealth/",
  },
];

const menuLinks = [
  { link: "/registration", text: "index:home" },
  { link: "/theme-color", text: "index:color" },
  { link: "/quiz", text: "index:quiz" },
  { link: "/collection-maps", text: "index:map" },
  { link: "/artworks", text: "index:detail" },
  { link: "/artist-video", text: "index:artworks" },
  { link: "/form", text: "index:form" },
  { link: "/visitor-posts", text: "index:posts" },
];
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["index"])),
    },
  };
}
export default function Home(props) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const router = useRouter();
  const { locale } = router;
  const [showMenu, setShowMenu] = useState(false);
  return (
    <>
      <ToastContainer
        position="top-center"
        // autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <MenuToggle
        role="button"
        onClick={() => {
          setShowMenu(true);
        }}
      ></MenuToggle>
      {locale == "en" ? (
        <Link href="/" locale="zh">
          <TranslationToggle role="button"></TranslationToggle>
        </Link>
      ) : (
        <Link href="/" locale="en">
          <TranslationToggle role="button"></TranslationToggle>
        </Link>
      )}
      <Menulist $menuStyle={!showMenu ? "translateX(-100%)" : "none"}>
        <div>
          <CloseMenuIcon
            role="button"
            onClick={() => {
              setShowMenu(false);
            }}
          />

          {menuLinks.map((menuLink, index) => (
            <li key={index}>
              <Page
                onClick={() => {
                  if (user?.uid) {
                    router.push(menuLink.link);
                  } else {
                    router.push("/registration");
                  }
                }}
              >
                {t(menuLink.text)}
              </Page>
            </li>
          ))}
        </div>
        <div>
          <FacebookShareButton
            url={"https://the-healing-museum-makoto357.vercel.app"}
            quote={
              "The Healing Museum brings you closer to the world of modern art."
            }
            hashtag={
              "#modernart #artiststory #artquiz #audiovisualtour #interactive"
            }
          >
            <FBicon />
          </FacebookShareButton>

          {/* {user && (
            <li>
              <Link href="/user-profile">
                <ProfileIcon />{" "}
              </Link>
            </li>
          )} */}
          {/* <li>
                <div
                  onClick={() => {
                    logout();
                  }}
                >
                  <LogoutIcon />
                </div>
              </li> */}
        </div>
      </Menulist>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "0 70px",
          padding: "40px 0 0",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            columnGap: "30px",
            width: "80vw",
          }}
        >
          <p>
            The Healing Museum is an online experience inspired by two concepts:
            “art as therapy” and “museum on prescription”. The former has its
            root in the 19th century psychologists’ theories and their
            perspective of “artistic expression as a window into the inner
            workings of the mind”, while the latter considers museums as places
            with potential to facilitate the healing process as well as serving
            as social prescriptions to complement primary medical care.
          </p>
          <p>
            Art as healing means to direct personal or traumatic experiences
            towards creative expressions of who you are, how you feel and what
            you identify with. By presenting the artworks of 3 female and 3 male
            modern artists, who have shared their visions of realities and
            transcended their adversities into ever-lasting arts, the Healing
            Museum aims to explore the source of their strength and learn about
            resilience.
          </p>
          {/* <br />
            We invite you to enter this Museum, and enjoy the colors and stories
            of these artists through a series of interactive experiences.
            Starting from choosing a color which echoes with your mood, and a
            quiz of which the questions are based on anecdotes of the artists,
            you will be going on a journey to the inner worlds and great minds
            of the artists, accompanied by audio-visual materials. At the end of
            your visits, we hope to bring you a bit of feelings and
            inspirations. */}
        </div>
        <SignpostButton href="/registration">Start your journey</SignpostButton>

        <SwiperWrapper>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            loop
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log("slide change")}
          >
            {bannerImages.map((bannerImage) => (
              <SwiperSlide key={bannerImage.image}>
                <div>
                  <Image
                    src={bannerImage.image}
                    width={1280}
                    height={720}
                    alt={bannerImage.caption}
                  />
                  <h1 style={{ fontSize: "0.5rem" }}>
                    <strong>{bannerImage.caption}</strong>
                  </h1>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </SwiperWrapper>
      </div>
    </>
  );
}
