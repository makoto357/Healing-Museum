import styled from "@emotion/styled";
import Link from "next/link";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { motion, Variants } from "framer-motion";
import { ToastContainer } from "react-toastify";
import Image from "next/image";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { useAuth } from "../context/AuthContext";
import { ThemeColorContext } from "../context/ColorContext";
import logo from "../asset/healing-museum-low-resolution-logo-black-on-transparent-background.png";
import profile from "../asset/profile.png";
import logout from "../asset/log-out.png";
import Menu from "./Menu";

import "react-toastify/dist/ReactToastify.css";

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
  const { themeColor } = useContext(ThemeColorContext);
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  useOnClickOutside(menuRef, () => setShowMenu(false));
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");

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
      x: pointerPosition.x - 10,
      y: pointerPosition.y - 10,
    },
    text: {
      width: 80,
      height: 80,
      x: pointerPosition.x - 40,
      y: pointerPosition.y - 40,
      backgroundColor: "white",
      mixBlendMode: "difference",
    },
  };

  useEffect(() => {
    const pointerMove = (e: PointerEvent) => {
      setPointerPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("pointermove", pointerMove);
    return () => {
      window.removeEventListener("pointermove", pointerMove);
    };
  }, []);

  const textEnter = () => setCursorVariant("text");
  const textLeave = () => setCursorVariant("default");

  const backToHomepage = () => {
    if (user) {
      router.push("/user-profile");
    } else if (!user) {
      router.push("/registration");
    }
  };
  const userLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      {(router.pathname === "/collection-maps" ||
        router.pathname === "/drawing-board" ||
        router.pathname === "/artworks" ||
        router.pathname === "/artist-video" ||
        router.pathname === "/drawing-board" ||
        router.pathname === "/user-profile" ||
        router.pathname === "/registration" ||
        router.pathname === "/form" ||
        router.pathname === "/collection-maps/[collectionID]") && (
        <ToastContainer
          position="top-center"
          autoClose={false}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          limit={1}
        />
      )}

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

      <Main $bgImage={themeColor ? themeColor?.secondary : "#eeece5"}>
        <div>
          <Logo onPointerEnter={textEnter} onPointerLeave={textLeave}>
            <Link href="/">
              <Image alt="museum logo" height={60} width={120} src={logo.src} />
            </Link>
          </Logo>
        </div>

        <div>
          <div onClick={backToHomepage}>
            <ProfileIcon />
          </div>
          {user && (
            <div onClick={userLogout}>
              <LogoutIcon />
            </div>
          )}
        </div>

        {user?.uid && (
          <Menu
            setShowMenu={setShowMenu}
            menuRef={menuRef}
            showMenu={showMenu}
            backToHomepage={backToHomepage}
            userLogout={userLogout}
            user={user}
          />
        )}
        {children}
      </Main>
    </>
  );
}
