import Link from "next/link";
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
  Autocomplete,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import { useRef, useState, useEffect } from "react";

const google = window.google;
const center = { lat: 23.818779, lng: 120.979708 };
const taipeiBranch = { lat: 25.038674695417868, lng: 121.53238182606339 };
const taipeiAddress = "100台北市中正區仁愛路二段99號";

export default function GoogleMaps() {
  const [map, setMap] = useState(/** @type google.maps.Map */ null);

  const markers = [
    {
      name: "taipei",
      location: taipeiBranch,
      address: taipeiAddress,
      region: "北部分店",
      branchAddress: "地址｜100台北市中正區仁愛路二段99號",
      tel: "電話｜(02) 2995-5487",
    },
  ];
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  if (!isLoaded) {
    return <SkeletonText />;
  }
  return (
    <>
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
              zoom={7}
              mapContainerStyle={{ width: "100%", height: "100vh" }}
              options={{
                // zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
              onLoad={(map) => setMap(map)}
            >
              {markers.map((marker) => {
                return <Marker key={marker.name} position={marker.location} />;
              })}
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
                  <Input type="text" placeholder="出發地點" />
                </Autocomplete>
              </Box>
            </HStack>
            <HStack spacing={4} mt={4} justifyContent="space-between">
              <IconButton
                aria-label="center back"
                isRound
                onClick={() => {
                  map.panTo(center);
                  map.setZoom(7);
                }}
              />
            </HStack>
          </Box>
        </Flex>
      </ChakraProvider>
    </>
  );
}
