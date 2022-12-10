import styled from "@emotion/styled";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion, Variants } from "framer-motion";
import { FacebookShareButton } from "next-share";
import { useAuth } from "../context/AuthContext";
import { ThemeColorContext } from "../context/ColorContext";
import logo from "../asset/healing-museum-low-resolution-logo-black-on-transparent-background.png";
import profile from "../asset/profile.png";
import logout from "../asset/log-out.png";
import close from "../asset/cancel-white.png";
import toggle from "../asset/menu.png";
import share from "../asset/share.png";

const Main = styled.main<{ $bgImage: string }>`
  background: ${(props) => props.$bgImage};

  min-height: 100vh;
  transition: background 1.5s ease;
  box-sizing: border-box;
`;
const Cursor = styled(motion.div)`
  background-color: black;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 99999;
  @media screen and (max-width: 950px) {
    display: none;
  }
`;

const Logo = styled.div`
  height: 60px;
  width: 120px;
  margin: auto;
  padding-top: 24px;
  position: relative;
`;

const ProfileIcon = styled.div`
  display: none;
  background-image: url(${profile.src});
  width: 30px;
  height: 30px;
  background-size: cover;
  cursor: pointer;
  @media screen and (min-width: 700px) {
    display: initial;
    position: absolute;
    top: 24px;
    right: 24px;
  }
`;

const LogoutIcon = styled.div`
  display: none;
  background-image: url(${logout.src});
  width: 32px;
  height: 32px;
  background-size: cover;
  cursor: pointer;
  @media screen and (min-width: 700px) {
    position: absolute;
    top: 23px;
    right: 64px;
    display: initial;
  }
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
  position: fixed;
  top: 0;
  list-style: none;
  width: 300px;
  height: 100vh;

  /* min-height: 700px; */
  background-color: #2c2b2c;
  transform: ${(props) => props.$menuStyle};
  transition: transform 300ms;
  color: white;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MenuButtonGroup = styled.div`
  display: flex;
  column-gap: 10px;
`;
const MenuButton = styled.div`
  display: none;
  border: 1px solid white;
  width: fit-content;
  padding: 5px 10px;
  margin-bottom: 20px;
  cursor: pointer;
  &:hover {
    color: black;
    background: white;
  }
  @media screen and (max-width: 700px) {
    display: initial;
  }
`;

const Page = styled.div`
  background-image: linear-gradient(180deg, transparent 95%, white 0);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.4s ease;
  width: fit-content;
  margin-bottom: 20px;
  z-index: 1000;
  cursor: pointer;
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
const ProgressBarWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  width: 24.5vw;
  justify-content: space-between;
  position: absolute;
  top: 15px;
  left: 64px;
  @media screen and (max-width: 700px) {
    width: 77.5vw;
    top: 40px;
    left: 10vw;
  }
`;
const ProgressBarColor = styled.div`
  position: absolute;
  width: 100%;
  z-index: 30px;
  border-bottom: 1px solid black;
`;

const Indicator = styled.div<{
  $bgcolor: string;
  $height: string;
  $width: string;
}>`
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  border-radius: 50%;
  background: ${(props) => props.$bgcolor};
`;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;
  const router = useRouter();
  const [themeColor] = useContext(ThemeColorContext);
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");

  const menuLinks = [
    // { page: "Enter the Museum", link: "/registration" },
    { page: "A Color for Yourself", link: "/theme-color" },
    { page: "Draw Your Inner World", link: "/drawing-board" },
    { page: "Quiz: How Are You Feeling?", link: "/quiz" },
    { page: "Explore the Art Map", link: "/collection-maps" },
    { page: "Emotional Gallery", link: "/artworks" },
    { page: "Hear about the Artist (Videos)", link: "/artist-video" },
    { page: "Express Your Feelings", link: "/form" },
    { page: "How They Feel (Visitor Posts)", link: "/visitor-posts" },
  ];

  const progressBarItems = [
    "/theme-color",
    "/drawing-board",
    "/quiz",
    "/collection-maps",
    "/collection-maps/[collectionID]",
    "/artworks",
    "/artist-video",
    "/form",
    "/visitor-posts",
    "/user-profile",
  ];

  const variants: Variants = {
    default: {
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
    },
    text: {
      width: 80,
      height: 80,
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      backgroundColor: "white",
      mixBlendMode: "difference",
    },
  };

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", mouseMove);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  const textEnter = () => setCursorVariant("text");
  const textLeave = () => setCursorVariant("default");

  return (
    <>
      {router.pathname !== "/" && router.pathname !== "/registration" && (
        <ProgressBarWrapper>
          <ProgressBarColor></ProgressBarColor>
          {progressBarItems.map((progressBarItem) => (
            <Indicator
              key={progressBarItem}
              $bgcolor="black"
              $height={progressBarItem == router.pathname ? "12px" : "6px"}
              $width={progressBarItem == router.pathname ? "12px" : "6px"}
            />
          ))}
        </ProgressBarWrapper>
      )}
      <Cursor variants={variants} animate={cursorVariant} />

      <Main $bgImage={themeColor?.secondary}>
        <div>
          <Logo onMouseEnter={textEnter} onMouseLeave={textLeave}>
            <Link href="/">
              <img src={logo.src} />
            </Link>
          </Logo>
        </div>

        <div>
          <div
            onClick={() => {
              if (user) {
                router.push("/user-profile");
              } else if (!user) {
                router.push("/registration");
              }
            }}
          >
            <ProfileIcon />
          </div>
          {user && (
            <div
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              <LogoutIcon />
            </div>
          )}
        </div>

        {user?.uid && (
          <>
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
                      {menuLink.page}
                    </Page>
                  </li>
                ))}

                <MenuButtonGroup>
                  {user && router.pathname !== "/" && (
                    <>
                      <MenuButton
                        onClick={() => {
                          if (user) {
                            router.push("/user-profile");
                          } else if (!user) {
                            router.push("/registration");
                          }
                        }}
                      >
                        Your Profile
                      </MenuButton>

                      <MenuButton
                        onClick={() => {
                          logout();
                          router.push("/");
                        }}
                      >
                        Logout
                      </MenuButton>
                    </>
                  )}
                </MenuButtonGroup>
              </div>
              <div>
                <FacebookShareButton
                  url={"https://the-healing-museum-makoto357.vercel.app/en"}
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
          </>
        )}
        {children}
      </Main>
    </>
  );
}
