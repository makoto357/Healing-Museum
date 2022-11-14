import styled from "@emotion/styled";
import Link from "next/link";
import { useContext } from "react";
import { ThemeColorContext } from "../context/ColorContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;

  const [themeColor] = useContext(ThemeColorContext);

  return (
    <>
      <Link href="/">
        <p>Back to Index Page</p>
      </Link>
      <main style={{ background: themeColor, minHeight: "100vh" }}>
        {children}
      </main>
    </>
  );
}
