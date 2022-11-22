import styled from "@emotion/styled";
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
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import wheel from "../asset/new-moon.png";
const google = window.google;
import museumMarker from "../asset/new-marker.png";
import artistLocation from "../public/visitorJourney.json";

const ArtworkInfo = styled.div`
  display: flex;
  min-height: 100px;
`;

const ArtworkTitle = styled.p`
  padding: 12px 0;
`;

const ArtworkWrapper = styled.div`
  background: white;
  width: 100%;
  height: 70px;
  border: solid 1px #a3a3a3;
  border-top: none;
  padding: 10px 15px;
  overflow-y: hidden;
  &:hover {
    background-color: #a3a3a3;
    height: fit-content;
  }
`;

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

  const destiantionRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<GoogleMap>();
  console.log(galleries);
  const { user } = useAuth();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const center = useMemo(
    () => ({ lat: 42.44163943619658, lng: -26.132456899797923 }),
    []
  );
  const clusterStyles = [
    {
      height: 30,
      textColor: "black",
      width: 30,
      url: `${wheel.src}`,
    },
  ];
  const onLoad = useCallback((map) => (mapRef.current = map), []);
  console.log(typeof MarkerClusterer);
  useEffect(() => {
    const getArtist = async () => {
      const q = query(collection(db, "users"), where("id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => doc.data() as any);
      const ArtistIndex =
        docs[0].visitorJourney[docs[0].visitorJourney.length - 1]
          .recommendedArtist;
      setArtist(ArtistIndex);
      getArtworks(ArtistIndex);
    };
    getArtist();
  }, [selectedMarker, user.uid]);

  const getArtworks = async (artist) => {
    const q = query(
      collection(db, "artworks"),
      where("artistUrl", "==", artist),
      orderBy("completitionYear", "desc")
    );
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.map((doc) => doc.data());
    console.log(docs);
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
      <div style={{ display: "flex", height: "100%", width: "100%" }}>
        <div
          style={{
            width: "310px",
            height: "70vh",
            textAlign: "left",
            overflowY: "scroll",
          }}
        >
          <h1
            style={{
              padding: "15px",
              border: "solid 1px #a3a3a3",
              background: "white",
            }}
          >
            <strong>
              Hover on the boxes below or click on markers on the map to view
              artwork details:
            </strong>
          </h1>
          {galleries.map((gallery) => (
            <ArtworkWrapper
              onMouseOver={() => {
                getGallery(gallery);
              }}
              key={gallery.id}
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
                  <i>{gallery.title}</i>, {gallery.completitionYear}
                </p>
              </div>
              <img
                style={{
                  width: "90px",
                  margin: "20px 0 10px",
                }}
                src={`${gallery.image}`}
              />
              <ul style={{ listStyle: "none" }}>
                <li>
                  {gallery?.media?.map((medium, index) => (
                    <span key={index}>{medium}, </span>
                  ))}
                </li>
                <li>
                  {gallery.sizeX} X {gallery.sizeY} cm
                </li>
                <li>Collection of the {gallery.galleries}</li>
              </ul>
            </ArtworkWrapper>
          ))}
        </div>
        <Flex
          position="relative"
          flexDirection="column"
          margin="auto"
          h="70vh"
          w="100%"
        >
          <Box position="absolute" left={0} top={0} h="80vh" w="100%">
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
                          marginRight: "12px",
                          backgroundSize: "cover",
                          height: "100%",
                        }}
                      ></div>
                    </Link>
                    <Link href={`/collection-maps/${selectedMarker.id}`}>
                      <div>
                        <ArtworkTitle>
                          <strong>
                            {selectedMarker.title},{" "}
                            {selectedMarker.completitionYear}
                          </strong>
                        </ArtworkTitle>
                        <p>{selectedMarker.galleries}</p>
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
      </div>
    </>
  );
}
