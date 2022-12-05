import styled from "@emotion/styled";
import Link from "next/link";
import { useRouter } from "next/router";
import { Box, Flex, Input, SkeletonText } from "@chakra-ui/react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoWindow,
  MarkerClusterer,
} from "@react-google-maps/api";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import selectImage from "../asset/hand.png";
import image from "../asset/image.png";
import museumMarker from "../asset/new-marker.png";
import wheel from "../asset/purple-circle.png";
import artistLocation from "../public/artist-info/visitorJourney.json";

const MapWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  @media screen and (max-width: 650px) {
    flex-direction: column;
  }
`;

const CardWrapper = styled.div`
  width: 310px;
  height: 70vh;
  text-align: left;
  overflow-y: scroll;
  @media screen and (max-width: 650px) {
    display: none;
  }
`;

const InstructionText = styled.div`
  padding: 15px;
  border: solid 1px #a3a3a3;
  background: white;
  color: black;
  height: fit-content;
  font-weight: 500;
  @media screen and (max-width: 650px) {
    display: initial;
  }
`;

const InstructionTextSmallScreen = styled.div`
  display: none;

  @media screen and (max-width: 650px) {
    padding: 5px 15px 15px 15px;
    border: solid 1px #a3a3a3;
    background: white;
    color: black;
    height: fit-content;
    font-weight: 500;
    display: initial;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  width: 100%;
  padding-top: 10px;
`;

const SelectIcon = styled.div`
  height: 30px;
  width: 30px;
  background-image: url(${selectImage.src});
  background-size: cover;
`;

const ImageIcon = styled.div`
  height: 30px;
  width: 30px;
  background-image: url(${image.src});
  background-size: cover;
`;

const ArtworkWrapper = styled.div<{
  $cardBackground: string;
  $cardHeight: string;
}>`
  width: 100%;
  background: ${(props) => props.$cardBackground};
  height: ${(props) => props.$cardHeight};
  border: solid 1px white;
  border-top: none;
  padding: 10px 15px;
  overflow-y: hidden;
  &:hover {
    background: white;
    height: fit-content;
  }
`;

const ArtworkInfo = styled.div`
  display: flex;
  min-height: 100px;
`;

const ArtworkTitle = styled.p`
  padding: 12px 0;
`;
const ClustererIcon = styled.div`
  height: 30px;
  width: 30px;
  background-image: url(${wheel.src});
  background-size: cover;
`;

function InstructionTextContent() {
  return (
    <InstructionText>
      <h1>
        <strong>
          Hover and tap on the boxes below, or markers on the map{" "}
        </strong>
        to explore details about highlighted artworks.
      </h1>
      <br />

      <div style={{ display: "flex", width: "85%", fontSize: "0.75rem" }}>
        <ClustererIcon />
        <p style={{ width: "85%", marginLeft: "5px" }}>
          <strong>
            The purple circle means the area has multiple artworks to be
            explored.
          </strong>
        </p>
      </div>
    </InstructionText>
  );
}

function InstructionTextContentSmallScreen() {
  return (
    <InstructionTextSmallScreen>
      <IconWrapper>
        <SelectIcon />

        <p style={{ width: "85%", marginLeft: "5px" }}>
          <strong>Step 1: Click on map markers </strong>
          to explore details about highlighted artworks.
        </p>
      </IconWrapper>

      <IconWrapper>
        <ImageIcon />

        <p style={{ width: "85%", marginLeft: "5px" }}>
          <strong>Step 2: Click on artwork images </strong>to go to the next
          gallery.
        </p>
      </IconWrapper>
      <IconWrapper>
        <ClustererIcon />
        <p style={{ width: "85%", marginLeft: "5px" }}>
          The purple circle means the area has multiple artworks to be explored.
        </p>
      </IconWrapper>
    </InstructionTextSmallScreen>
  );
}

const google = window.google;
const Libraries: (
  | "places"
  | "geometry"
  | "drawing"
  | "localContext"
  | "visualization"
)[] = ["places"];
export default function GoogleMaps() {
  interface IWindow {
    image: string | undefined;
    galleries: string[] | undefined;
    title: string | undefined;
    completitionYear: number | undefined;
    artistName: string | undefined;
    geometry: { lat: number; lng: number } | null;
    id: string | undefined;
  }
  const [selectedMarker, setSelectedMarker] = useState<IWindow>({
    image: undefined,
    galleries: undefined,
    title: undefined,
    completitionYear: undefined,
    artistName: undefined,
    geometry: null,
    id: undefined,
  });
  const [galleries, setGalleries] = useState([]) as any[];
  const [artist, setArtist] = useState("");
  const ref = useRef(null);
  const destiantionRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<GoogleMap>();
  const router = useRouter();
  const { user } = useAuth();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: Libraries,
  });
  const center = useMemo(
    () =>
      artist == "frida-kahlo" || "dorothea-tanning || "
        ? { lat: 30.2845084110191, lng: -97.74119954552144 }
        : { lat: 52.35836306220029, lng: 4.881396717020184 },
    [artist]
  );
  const clusterStyles = [
    {
      height: 50,
      textColor: "black",
      width: 50,
      url: `${wheel.src}`,
    },
  ];

  const onLoad = useCallback((map) => (mapRef.current = map), []);
  useEffect(() => {
    const getArtist = async () => {
      const q = query(collection(db, "users"), where("id", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => doc.data() as any);
      const ArtistIndex =
        docs[0].visitorJourney?.[docs[0]?.visitorJourney?.length - 1]
          ?.recommendedArtist;
      if (!ArtistIndex) {
        toast(({ closeToast, toastProps }) => (
          <div>
            <p>Take the art quiz to get your artist recommendation!</p>
            <div style={{ width: "100%" }}>
              <button
                style={{
                  marginTop: "5px",
                  padding: "3px 10px",
                  background: "black",
                  color: "white",
                }}
                onClick={() => router.push("/quiz")}
              >
                Take a quiz
              </button>
            </div>
          </div>
        ));

        return;
      }
      setArtist(ArtistIndex);
      getArtworks(ArtistIndex);
    };
    if (user) {
      getArtist();
    }
  }, [selectedMarker, user]);

  const getArtworks = async (artist) => {
    const q = query(
      collection(db, "artworks"),
      where("artistUrl", "==", artist),
      orderBy("completitionYear", "desc")
    );
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.map((doc) => doc.data());
    setGalleries(docs);
  };

  const getGallery = (gallery) => {
    destiantionRef.current.value = gallery;
    setSelectedMarker(gallery);
  };

  if (!isLoaded) {
    return <SkeletonText />;
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <p
        style={{
          width: "96vw",
          margin: "auto",
          textAlign: "left",
          paddingBottom: "20px",
        }}
      >
        {
          artistLocation?.filter(
            (location) => location?.artistUrl === artist
          )[0]?.artistLocation
        }
      </p>
      <MapWrapper>
        <InstructionTextContentSmallScreen />
        <CardWrapper>
          <InstructionTextContent />
          {galleries.map((gallery) => (
            <ArtworkWrapper
              key={gallery.id}
              ref={ref}
              $cardBackground={
                selectedMarker.id == gallery.id ? "white" : "#a3a3a3"
              }
              $cardHeight={
                selectedMarker.id == gallery.id ? "fit-content" : "70px"
              }
              onMouseOver={() => {
                getGallery(gallery);
              }}
            >
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundImage: `url(${museumMarker.src})`,
                    backgroundSize: "cover",
                    marginRight: "10px",
                  }}
                />
                <p style={{ width: "165px" }}>
                  <strong>
                    <i>{gallery.title},</i>{" "}
                  </strong>
                  {gallery.completitionYear}
                </p>
              </div>
              <img
                style={{
                  height: "100px",
                  margin: "20px 0 10px",
                }}
                src={`${gallery.image}`}
              />
              <p>
                {gallery?.media?.map((medium, index) => (
                  <span key={index}>{medium} </span>
                ))}
              </p>
              <p>
                {gallery.sizeX} X {gallery.sizeY} cm
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  paddingTop: "5px",
                }}
              >
                Collection of the {gallery.galleries}
              </p>
              <div
                style={{ cursor: "pointer", color: "blue", paddingTop: "10px" }}
                onClick={() => router.push(`/collection-maps/${gallery.id}`)}
              >
                See artwork details
              </div>
            </ArtworkWrapper>
          ))}
        </CardWrapper>
        <Flex
          position="relative"
          flexDirection="column"
          margin="auto"
          h="70vh"
          w="100%"
        >
          <Box position="absolute" left={0} top={0} h="100%" w="100%">
            <GoogleMap
              center={center}
              zoom={4}
              mapContainerStyle={{
                width: "100%",
                height: "70vh",
              }}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
              onLoad={onLoad}
            >
              <MarkerClusterer
                options={{
                  styles: clusterStyles,
                }}
              >
                {(clusterer) =>
                  galleries.map((g) => (
                    <Marker
                      key={g.id}
                      position={g.geometry}
                      onClick={() => {
                        getGallery(g);
                      }}
                      icon={{
                        url: `${museumMarker.src}`,
                      }}
                      cursor="pointer"
                      clusterer={clusterer}
                    />
                  ))
                }
              </MarkerClusterer>
              {selectedMarker?.geometry && (
                <InfoWindow
                  onCloseClick={() => {
                    setSelectedMarker({
                      image: undefined,
                      galleries: undefined,
                      title: undefined,
                      completitionYear: undefined,
                      artistName: undefined,
                      geometry: undefined,
                      id: undefined,
                    });
                  }}
                  onLoad={onLoad}
                  options={{
                    pixelOffset: new window.google.maps.Size(0, -40),
                  }}
                  position={selectedMarker.geometry}
                >
                  <ArtworkInfo>
                    <Link href={`/collection-maps/${selectedMarker.id}`}>
                      <div
                        style={{
                          backgroundImage: `url(${selectedMarker.image})`,
                          width: "100px",
                          backgroundSize: "cover",
                          height: "100%",
                        }}
                      ></div>
                    </Link>
                    <Link href={`/collection-maps/${selectedMarker.id}`}>
                      <div style={{ margin: "0 12px 5px" }}>
                        <ArtworkTitle>
                          <strong>
                            <i>{selectedMarker.title}, </i>
                          </strong>
                          {selectedMarker.completitionYear}
                        </ArtworkTitle>
                        <p style={{ textAlign: "left" }}>
                          {selectedMarker.galleries}
                        </p>
                      </div>
                    </Link>
                  </ArtworkInfo>
                </InfoWindow>
              )}
            </GoogleMap>
          </Box>
          <div style={{ display: "none" }}>
            <Input type="text" ref={destiantionRef} />
          </div>
        </Flex>
      </MapWrapper>
    </>
  );
}
