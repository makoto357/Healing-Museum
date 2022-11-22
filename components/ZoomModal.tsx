import styled from "@emotion/styled";
import { createPortal } from "react-dom";

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
`;

const ModalContentBackdrop = styled.div`
  position: relative;
  max-width: 94vw;
  height: 94vh;
  margin: 3vh auto 0;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 94vw;
  height: 94vh;
`;

function ZoomModal({ children }) {
  return createPortal(
    <ModalBackdrop>
      <ModalContentBackdrop>
        <ModalContent>{children}</ModalContent>
      </ModalContentBackdrop>
    </ModalBackdrop>,
    document.body
  );
}

export default ZoomModal;
