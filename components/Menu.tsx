import { FacebookShareButton } from "next-share";
import styled from "@emotion/styled";
import React from "react";
import { useRouter } from "next/router";
import close from "../asset/cancel-white.png";
import toggle from "../asset/menu.png";
import share from "../asset/share.png";
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

const Menulist = styled.nav<{ $menuStyle: string }>`
  z-index: 20;
  position: fixed;
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
  @media screen and (max-width: 700px) {
    height: 100vh;
    position: absolute;
    width: 100vw;
    overflow-y: scroll;
  }
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
  width: 30px;
  height: 30px;
  background-size: contain;
  &:hover {
    width: 32px;
    height: 32px;
  }
`;

export default function Menu({
  setShowMenu,
  menuRef,
  showMenu,
  backToHomepage,
  userLogout,
  user,
}: {
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  menuRef: React.RefObject<HTMLElement>;
  showMenu: boolean;
  backToHomepage: () => void;
  userLogout: () => void;
  user: any;
}) {
  const router = useRouter();
  const menuLinks = [
    { page: "A Color for Yourself", link: "/theme-color" },
    { page: "Draw Your Inner World", link: "/drawing-board" },
    { page: "Quiz: How Are You Feeling?", link: "/quiz" },
    { page: "Explore the Art Map", link: "/collection-maps" },
    { page: "Emotional Gallery", link: "/artworks" },
    { page: "Hear about the Artist (Videos)", link: "/artist-video" },
    { page: "Express Your Feelings", link: "/form" },
    { page: "How They Feel (Visitor Posts)", link: "/visitor-posts" },
  ];
  const blockContent = (menuLink: { page: string; link: string }) => {
    if (user?.uid) {
      router.push(menuLink.link);
    } else {
      router.push("/registration");
    }
  };
  return (
    <>
      <MenuToggle
        role="button"
        onClick={() => {
          setShowMenu(true);
        }}
      ></MenuToggle>
      <Menulist
        ref={menuRef}
        $menuStyle={!showMenu ? "translateX(-100%)" : "none"}
      >
        <div>
          <CloseMenuIcon
            role="button"
            onClick={() => {
              setShowMenu(false);
            }}
          />

          {menuLinks.map((menuLink) => (
            <li key={menuLink.page}>
              <Page onClick={() => blockContent(menuLink)}>
                {menuLink.page}
              </Page>
            </li>
          ))}

          <MenuButtonGroup>
            <>
              <MenuButton onClick={backToHomepage}>Your Profile</MenuButton>

              <MenuButton onClick={userLogout}>Logout</MenuButton>
            </>
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
  );
}
