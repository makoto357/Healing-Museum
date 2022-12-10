/* eslint-disable import/no-unresolved */
import styled from "@emotion/styled";
import Link from "next/link";
import Image from "next/image";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAuth } from "../context/AuthContext";
import museumOfMind from "../asset/museum-of-the-mind.jpeg";
import happiness from "../asset/happiness.png";
import benUri from "../asset/ben-uri.jpeg";
import colors from "../asset/pantone.png";
import quiz from "../asset/ideas.png";
import map from "../asset/journal.png";
import post from "../asset/video-player.png";
import ticket from "../asset/ticket.png";
import arrow from "../asset/right-arrow.png";
// import github from "../asset/github.png";
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

const Wrapper = styled.div`
  display: block;
  padding-top: 14px;
`;
const EntranceWrapper = styled.div`
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  display: flex;
  justify-content: center;
  padding-right: 20px;
  align-items: center;
  height: 60px;
`;
const HiddenEntrance = styled.div`
  cursor: pointer;
  margin: auto 3px auto 10px;
  font-size: 1.25rem;
  font-weight: 600;
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

const MuseumEntrance = styled.div`
  position: absolute;
  top: 50%;
  width: 40vw;
  margin: auto 30vw;
  height: 50%;
`;
const EntranceIcon = styled.div`
  width: 45px;
  height: 45px;
  background-size: cover;
  background-image: url(${ticket.src});
`;

const FeatureTitle = styled.h1`
  font-size: 1.25rem;
  text-align: center;
  margin: 40px auto 20px;
`;

const FeatureWrapper = styled.div`
  display: flex;
  height: fit-content;
  width: 80vw;
  margin: 20px auto;
  justify-content: space-between;
  align-items: baseline;
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

const FeatureIcon = styled.div<{ $bgImage: string }>`
  width: 45px;
  height: 45px;
  background-size: cover;
  margin: 0 auto 20px;
  background-image: url(${(props) => props.$bgImage});
`;

const MuseumIntroWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 70px;
  padding: 40px 0 0;
  align-items: center;
`;
const MuseumIntroTitle = styled.h1`
  font-size: 1.25rem;
  margin-bottom: 20px;
`;

const SwiperWrapper = styled.section`
  width: 80vw;
  height: 450px;
  cursor: pointer;
`;
const SlideImage = styled(Image)`
  cursor: pointer;
  margin: 0 auto;
`;
const SlideCaption = styled.div`
  font-size: 0.75rem;
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
export default function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();
  const { locale } = router;
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

      <Wrapper>
        <MainVisual title={t("index:museumOfMind")}>
          <Link href="/registration">
            <MuseumEntrance />
          </Link>
        </MainVisual>

        <EntranceWrapper>
          <EntranceIcon />

          <HiddenEntrance
            onClick={() => {
              if (user?.uid) {
                router.push("/theme-color");
              } else if (!user?.uid) {
                router.push("/registration");
              }
            }}
          >
            {t("index:start")}
          </HiddenEntrance>
          <ArrowIcon />
        </EntranceWrapper>

        <FeatureTitle>
          <strong> {t("index:experience")}</strong>
        </FeatureTitle>

        <FeatureWrapper>
          {websiteFeatures.map((websiteFeature) => (
            <FeatureIconGroup key={websiteFeature.icon}>
              <FeatureIcon $bgImage={websiteFeature.icon} />
              <p>{t(websiteFeature.text)}</p>
            </FeatureIconGroup>
          ))}
        </FeatureWrapper>

        <MuseumIntroWrapper>
          <MuseumIntroTitle>
            <strong> {t("index:museum")}</strong>
          </MuseumIntroTitle>
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
                <SwiperSlide key={bannerImage.image}>
                  <div>
                    <Link href={bannerImage.webpage}>
                      <SlideImage
                        src={bannerImage.image}
                        width={1280}
                        height={720}
                        alt={bannerImage.caption}
                      />
                    </Link>

                    <SlideCaption>
                      <strong>{t(bannerImage.caption)}</strong>
                    </SlideCaption>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </SwiperWrapper>
        </MuseumIntroWrapper>
      </Wrapper>
    </>
  );
}
