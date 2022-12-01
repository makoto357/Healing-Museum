import styled from "@emotion/styled";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { FacebookShareButton } from "next-share";
import { useRouter } from "next/router";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import museumOfMind from "../asset/museum-of-the-mind.jpeg";
import happiness from "../asset/happiness.png";
import benUri from "../asset/ben-uri.jpeg";
import colors from "../asset/pantone.png";
import quiz from "../asset/ideas.png";
import map from "../asset/journal.png";
import post from "../asset/video-player.png";
import ticket from "../asset/ticket.png";
import arrow from "../asset/right-arrow.png";
import github from "../asset/github.png";
import fb from "../asset/fb.svg";
import share from "../asset/share.png";
import close from "../asset/cancel-white.png";
import toggle from "../asset/menu.png";
import language from "../asset/translate.png";

const TranslationToggle = styled.div`
  background-image: url(${language.src});
  background-size: cover;
  height: 30px;
  width: 30px;
  position: absolute;
  top: 24px;
  left: 64px;
  cursor: pointer;
`;

const MenuToggle = styled.div`
  background-image: url(${toggle.src});
  background-size: cover;
  height: 30px;
  width: 30px;
  position: absolute;
  top: 24px;
  left: 24px;
  cursor: pointer;
`;

const CloseMenuIcon = styled.div`
  background-image: url(${close.src});
  width: 20px;
  height: 20px;
  background-size: cover;
  margin-left: auto;
`;

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
  background-image: url(${share.src});
  border: 2px solid #2c2b2c;
  width: 30px;
  height: 30px;
  background-size: cover;
  &:hover {
    width: 32px;
    height: 32px;
  }
`;

const MainVisual = styled.div`
  background-image: url(${museumOfMind.src});
  opacity: 0.8;
  background-size: cover;
  position: relative;
  height: 450px;
  width: 100vw;
  background-position: center;
`;
const EntranceIcon = styled.div`
  width: 45px;
  height: 45px;
  background-size: cover;
  background-image: url(${ticket.src});
`;

const ArrowIcon = styled.div`
  width: 12px;
  height: 12px;
  background-size: cover;
  background-image: url(${arrow.src});
`;

const IntroText = styled.div`
  display: flex;
  column-gap: 30px;
  width: 80vw;
  margin-bottom: 20px;
  @media screen and (max-width: 600px) {
    display: initial;
  }
`;

const FeatureIconGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 150px;
  text-align: left;
  justify-content: center;
  padding: 0 5px;
`;

const FeatureIcon = styled.div`
  width: 45px;
  height: 45px;
  background-size: cover;
  margin: 0 auto 20px;
`;

const SwiperWrapper = styled.section`
  width: 80vw;
  height: 450px;
`;

const bannerImages = [
  {
    image: happiness.src,
    caption: "index:caption1",
    webpage:
      "https://wellcomecollection.org/?gclid=Cj0KCQiAveebBhD_ARIsAFaAvrHyq9spdBGfJbkRv20ZALgIwL1m7W0kWCU0daQiTQ-wG9UMLKhnfwQaAoc1EALw_wcB",
  },
  {
    image: benUri.src,
    caption: "index:caption2",
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

const websiteFeatures = [
  {
    icon: colors.src,
    text: "index:selectColor",
  },
  { icon: quiz.src, text: "index:artQuiz" },
  {
    icon: map.src,
    text: "index:audiovisual",
  },
  {
    icon: post.src,
    text: "index:postFeeling",
  },
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
  const { user } = useAuth();
  const router = useRouter();
  const { locale } = router;
  const [showMenu, setShowMenu] = useState(false);
  return (
    <>
      {locale == "en" ? (
        <Link href="/" locale="zh">
          <TranslationToggle role="button"></TranslationToggle>
        </Link>
      ) : (
        <Link href="/" locale="en">
          <TranslationToggle role="button"></TranslationToggle>
        </Link>
      )}

      <MenuToggle
        role="button"
        onClick={() => {
          setShowMenu(true);
        }}
      ></MenuToggle>
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
        </div>
      </Menulist>
      <div style={{ display: "block", paddingTop: "14px" }}>
        <MainVisual title={t("index:museumOfMind")} />

        <div
          style={{
            borderTop: "1px solid black",
            borderBottom: "1px solid black",
            display: "flex",
            justifyContent: "center",
            paddingRight: "20px",
            alignItems: "center",
            height: "60px",
          }}
        >
          <EntranceIcon />

          <Link
            style={{
              cursor: "pointer",
              margin: "auto 3px auto 10px",
              fontSize: "1.25rem",
              fontWeight: "600",
            }}
            href="/registration"
          >
            {t("index:start")}
          </Link>
          <ArrowIcon />
        </div>
        <h1
          style={{
            fontSize: "1.25rem",
            textAlign: "center",
            margin: "40px auto 20px",
          }}
        >
          <strong> {t("index:experience")}</strong>
        </h1>
        <section
          style={{
            display: "flex",
            height: "fit-content",
            width: "80vw",
            margin: "20px auto",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          {websiteFeatures.map((websiteFeature) => (
            <FeatureIconGroup key={websiteFeature.icon}>
              <FeatureIcon
                style={{ backgroundImage: `url(${websiteFeature.icon})` }}
              />
              <p>{t(websiteFeature.text)}</p>
            </FeatureIconGroup>
          ))}
        </section>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "0 70px",
            padding: "40px 0 0",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "1.25rem",
              marginBottom: "20px",
            }}
          >
            <strong> {t("index:museum")}</strong>
          </h1>
          <IntroText>
            <p>{t("index:paragraph1")}</p>
            <br />
            <p>{t("index:paragraph2")}</p>
          </IntroText>

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
                <SwiperSlide
                  key={bannerImage.image}
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    <Link href={bannerImage.webpage}>
                      <Image
                        style={{ cursor: "pointer" }}
                        src={bannerImage.image}
                        width={1280}
                        height={720}
                        alt={bannerImage.caption}
                      />
                    </Link>
                    <h1 style={{ fontSize: "0.75rem" }}>
                      <strong>{t(bannerImage.caption)}</strong>
                    </h1>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </SwiperWrapper>
        </div>
      </div>
    </>
  );
}
