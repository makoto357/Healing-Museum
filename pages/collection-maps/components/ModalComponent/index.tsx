import styled from "@emotion/styled";
import { createPortal } from "react-dom";
import {
  TransformComponent,
  TransformWrapper,
} from "@pronestor/react-zoom-pan-pinch";
import React from "react";
import { IArtworks } from "../../../../utils/firebaseFuncs";
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  cursor: pointer;

  .transform-component-module_wrapper__7HFJe {
    margin: 0 auto !important;
  }
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

const CloseIcon = styled.button`
  background: white;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  opacity: 0.8;
  width: 50px;
  height: 50px;
  position: absolute;
  top: 0;
  right: 1rem;
  z-index: 600;
  padding-left: 8px;
  svg {
    cursor: pointer;
  }
  &:hover {
    height: 52px;
    width: 52px;
    padding-left: 9px;
  }
`;

const ZoomIcon = styled.div`
  padding-top: 8px;
  padding-left: 8px;
  background: white;
  border-radius: 50px;
  border: none;
  opacity: 0.8;
  width: 50px;
  height: 50px;
  position: absolute;
  left: 2rem;
  cursor: pointer;
  z-index: 500;
  svg {
    cursor: pointer;
  }
  &:hover {
    height: 52px;
    width: 52px;
    padding-top: 9px;
    padding-left: 9px;
  }
`;

const ModalImage = styled.img`
  height: 96vh;
  object-fit: contain;
  margin-bottom: auto;
`;

export function ZoomModal({
  artwork,
  setShowModal,
}: {
  artwork: IArtworks;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return createPortal(
    <ModalBackdrop>
      <ModalContentBackdrop>
        <ModalContent>
          {artwork &&
            artwork?.map((artwork, index) => (
              <TransformWrapper
                initialScale={1}
                key={`${index} + ${artwork.id}`}
              >
                {({ zoomIn, zoomOut }) => (
                  <>
                    <ZoomIcon onClick={() => zoomIn()} aria-label="Zoom in">
                      <svg className="icon" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M17.5 8.086v18.875M8.088 17.5h18.813"
                          fill="none"
                          stroke="black"
                        ></path>
                      </svg>
                    </ZoomIcon>
                    <ZoomIcon
                      style={{ top: "4rem" }}
                      onClick={() => zoomOut()}
                      aria-label="Zoom out"
                    >
                      <svg className="icon" xmlns="http://www.w3.org/2000/svg">
                        <path
                          fill="none"
                          stroke="black"
                          d="M8.088 17.5h18.813"
                        ></path>
                      </svg>
                    </ZoomIcon>
                    <TransformComponent>
                      <ModalImage alt={artwork.id} src={artwork.image} />
                    </TransformComponent>
                    <CloseIcon
                      onClick={() => setShowModal(false)}
                      aria-label="Close viewer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="35"
                        height="35"
                      >
                        <path
                          d="M24.251 10.935L10.746 24.12m.194-13.344l13.143 13.462"
                          fill="none"
                          stroke="black"
                        ></path>
                      </svg>
                    </CloseIcon>
                  </>
                )}
              </TransformWrapper>
            ))}
        </ModalContent>
      </ModalContentBackdrop>
    </ModalBackdrop>,
    document.getElementById("modal-root")!
  );
}
