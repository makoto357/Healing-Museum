import styled from "@emotion/styled";
import { useContext } from "react";
import { ThemeColorContext } from "../context/ColorContext";
interface Prop {
  $colorCode?: string;
}
import { createPortal } from "react-dom";
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
`;

const ModalContentBackdrop = styled.div`
  position: relative;
  max-width: 90vw;
  height: 94vh;
  margin: 3vh auto 0;
  background: ${(props: Prop) =>
    props.$colorCode ? props.$colorCode : "#eeece5"};
`;

const ModalContent = styled.div`
  position: relative;
  padding: 24px 32px 40px;
  max-width: 90vw;
  height: 94vh;
  background: ${(props: Prop) =>
    props.$colorCode ? props.$colorCode : "#eeece5"};
  border: 1px solid black;
`;

function ArtworkModal({ children }) {
  const [themeColor, setThemeColor] = useContext(ThemeColorContext);

  return createPortal(
    <ModalBackdrop>
      <ModalContentBackdrop $colorCode={`${themeColor}`}>
        <ModalContent>{children}</ModalContent>
      </ModalContentBackdrop>
    </ModalBackdrop>,
    document.body
  );
}
export default ArtworkModal;
