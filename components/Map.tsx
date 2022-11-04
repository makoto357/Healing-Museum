import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
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
import { FaLocationArrow } from "react-icons/fa";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  InfoWindow,
} from "@react-google-maps/api";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useRef, useState, useEffect, useContext } from "react";
import { useAuth } from "../context/AuthContext";
// import { useFavorite } from "../context/favoriteContext";
import heart from "../asset/17d0747c12d59dd8fd244e90d91956b9.png";
const google = window.google;
const center = { lat: 52.90097126278884, lng: 18.668388603761674 };

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
  const [map, setMap] = useState(/** @type google.maps.Map */ null);
  const [galleries, setGalleries] = useState([]);
  const destiantionRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // const { saveToFavorites } = useFavorite();
  // console.log(typeof saveToFavorites);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const onLoad = () => {
    console.log("infoWindow: ", InfoWindow);
  };

  useEffect(() => {
    onLoad();
    const getArtworks = async () => {
      const q = query(
        collection(db, "artworks"),
        where("artistUrl", "==", "vincent-van-gogh"),
        orderBy("completitionYear", "desc")
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => doc.data());
      console.log(docs);
      setGalleries(docs);
    };
    getArtworks();
  }, [selectedMarker]);

  const getGallery = (galleries) => {
    destiantionRef.current.value = galleries.galleries;
    setSelectedMarker(galleries);
  };

  const saveToFavorites = async (id) => {
    const requestRef = doc(db, "users", user?.uid);
    return await updateDoc(requestRef, {
      favoriteArtworksID: arrayUnion(selectedMarker.id),
    });
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
            zoom={4}
            mapContainerStyle={{ width: "100%", height: "100vh" }}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
            onLoad={(map) => setMap(map)}
          >
            {galleries.map((g) => {
              return (
                <Marker
                  key={g.id}
                  position={g.geometry}
                  onClick={() => {
                    getGallery(g);
                  }}
                />
              );
            })}
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
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <h1>{selectedMarker.galleries}</h1>
                  <p>{selectedMarker.title}</p>
                  <p>{selectedMarker.completitionYear}</p>
                  <div
                    role="button"
                    style={{
                      backgroundImage: `url(${heart.src})`,
                      width: "30px",
                      height: "30px",
                      backgroundSize: "cover",
                    }}
                    onClick={saveToFavorites}
                  ></div>
                  <Link href={`/collection-maps/${selectedMarker.id}`}>
                    <img
                      alt={selectedMarker.id}
                      src={selectedMarker.image}
                      style={{ width: "100px" }}
                    />
                  </Link>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </Box>
        <Box
          p={4}
          borderRadius="lg"
          m={4}
          bgColor="white"
          shadow="base"
          minW="container.md"
          zIndex="1"
        >
          <HStack spacing={2} justifyContent="space-between">
            <Box flexGrow={1}>
              <Autocomplete>
                <Input
                  type="text"
                  placeholder="Click on the markers to get gallery address"
                  ref={destiantionRef}
                />
              </Autocomplete>
            </Box>
          </HStack>
          <HStack spacing={4} mt={4} justifyContent="space-between">
            <IconButton
              aria-label="center back"
              icon={<FaLocationArrow />}
              isRound
              onClick={() => {
                map.panTo(center);
                map.setZoom(7);
              }}
            />
            <ButtonGroup>
              <Button colorScheme="pink" type="submit">
                Find a place
              </Button>
            </ButtonGroup>
          </HStack>
        </Box>
      </Flex>
    </ChakraProvider>
  );
}
