import styled from "@emotion/styled";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { ThemeColorContext } from "../context/ColorContext";
import { motion, Variants } from "framer-motion";
import logo from "../asset/healing-museum-low-resolution-logo-black-on-transparent-background.png";

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
          zIndex: "99999",
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
        <Link href="/">
          <div
            onMouseEnter={textEnter}
            onMouseLeave={textLeave}
            style={{
              height: "60px",
              width: "120px",
              margin: "auto",
              paddingTop: "24px",
            }}
            title="Quit the experience (Return to Homepage)"
          >
            <img src={logo.src} />
          </div>
        </Link>
        {children}
      </main>
    </>
  );
}
