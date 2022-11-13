import styled from "@emotion/styled";
import { ChakraProvider, theme } from "@chakra-ui/react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
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
import Image from "next/image";
import { useRouter } from "next/router";

const google = window.google;
import museumMarker from "../asset/new-marker.png";
import { url } from "inspector";

const ArtworkInfo = styled.div`
  display: flex;
  min-height: 100px;
`;

const ArtworkText = styled.p`
  padding: 12px 0;
`;
export default function GoogleMaps() {
  interface IWindow {
    image: string | undefined;
    galleries: string | undefined;
    title: string | undefined;
    completitionYear: string | undefined;
    artistName: string | undefined;
    geometry: { lat: number; lng: number } | undefined;
    id: string | undefined;
  }
  const [selectedMarker, setSelectedMarker] = useState<IWindow>({
    image: undefined,
    galleries: undefined,
    title: undefined,
    completitionYear: undefined,
    artistName: undefined,
    geometry: undefined,
    id: undefined,
  });
  const [galleries, setGalleries] = useState([]);
  const [artist, setArtist] = useState([]);
  const destiantionRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<GoogleMap>();

  const { user } = useAuth();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const center = useMemo(
    () => ({ lat: 42.44163943619658, lng: -26.132456899797923 }),
    []
  );
  //call this value once and use this value unless the dependency array changes
  const onLoad = useCallback((map) => (mapRef.current = map), []);

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

  const getGallery = (galleries) => {
    destiantionRef.current.value = galleries;
    setSelectedMarker(galleries);
  };

  if (!isLoaded) {
    return <SkeletonText />;
  }

  return (
    <ChakraProvider theme={theme}>
      <Flex
        position="relative"
        flexDirection="column"
        alignItems="center"
        h="100vh"
        w="100vw"
      >
        <Box position="absolute" left={0} top={0} h="100%" w="100%">
          <GoogleMap
            center={center}
            zoom={3}
            mapContainerStyle={{ width: "100%", height: "100vh" }}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              // mapId: "f8edff93482db741",
            }}
            onLoad={onLoad}
          >
            <MarkerClusterer>
              {(clusterer) =>
                galleries.map((g) => {
                  return (
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
                  );
                })
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
                  <div>
                    <ArtworkText>
                      <strong>
                        {selectedMarker.title},{" "}
                        {selectedMarker.completitionYear}
                      </strong>
                    </ArtworkText>
                    <p>{selectedMarker.galleries}</p>
                  </div>
                </ArtworkInfo>
              </InfoWindow>
            )}
          </GoogleMap>
        </Box>
        <div style={{ display: "none" }}>
          <Input type="text" ref={destiantionRef} />
        </div>
      </Flex>
    </ChakraProvider>
  );
}
