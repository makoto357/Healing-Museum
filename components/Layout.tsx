import styled from "@emotion/styled";
import Link from "next/link";
import { useContext } from "react";
import { ThemeColorContext } from "../context/ColorContext";
import home from "../asset/back-to-homepage.png";

const LinkToHomepage = styled(Link)`
  position: absolute;
  bottom: 100px;
  right: 100px;
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

  return (
    <>
      <div
        style={{
          backgroundColor: "black",
          height: "32px",
          width: "32px",
          borderRadius: "50%",
          position: "fixed",
          top: "0",
          left: "0",
        }}
      />
      <main
        style={{
          background: themeColor,
          minHeight: "100vh",
          position: "relative",
          paddingTop: "140px",
        }}
      >
        {children}
        <LinkToHomepage href="/">
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
