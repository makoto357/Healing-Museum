import styled from "@emotion/styled";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { ThemeColorContext } from "../context/ColorContext";
import home from "../asset/back-to-homepage.png";
import { motion, Variants } from "framer-motion";
import logo from "../asset/healing-museum-low-resolution-logo-black-on-transparent-background.png";
const LinkToHomepage = styled(Link)`
  position: fixed;
  bottom: 10px;
  right: 10px;
  display: flex;
  column-gap: 20px;
`;

const HomeIcon = styled.div`
  background-image: url(${home.src});
  width: 50px;
  height: 50px;
  background-size: cover;
  padding-top: 10px;
`;
interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;
  const [themeColor] = useContext(ThemeColorContext);
  console.log(themeColor);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
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
      <motion.div
        style={{
          backgroundColor: "black",
          height: "20px",
          width: "20px",
          borderRadius: "50%",
          position: "fixed",
          top: "0",
          left: "0",
          pointerEvents: "none",
          zIndex: "9999",
        }}
        variants={variants}
        animate={cursorVariant}
      />
      <main
        style={{
          background: themeColor?.secondary,
          minHeight: "100vh",
          position: "relative",
          transition: "background 1.5s ease",
        }}
      >
        <div
          style={{
            height: "15px",
            width: "80px",
            margin: "auto",
            paddingTop: "24px",
          }}
        >
          <img src={logo.src} />
        </div>
        {children}
        <LinkToHomepage
          onMouseEnter={textEnter}
          onMouseLeave={textLeave}
          href="/"
        >
          <div>
            <strong>
              Quit the Experience <br />( Return to Homepage )
            </strong>
          </div>
          <HomeIcon />
        </LinkToHomepage>
      </main>
    </>
  );
}
