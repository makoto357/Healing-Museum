import styled from "@emotion/styled";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoWindow,
  MarkerClusterer,
} from "@react-google-maps/api";
import { toast } from "react-toastify";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  IArtwork,
  IArtworks,
  getUserInfo,
  getHighlightedArtworks,
} from "../utils/firebaseFuncs";
import AlertBox from "../components/AlertBox";
import selectImage from "../asset/hand.png";
import { useAuth } from "../context/AuthContext";
import image from "../asset/image.png";
import museumMarker from "../asset/new-marker.png";
import wheel from "../asset/purple-circle.png";
import artistLocation from "../public/artist-info/visitorJourney.json";

const MapWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;

const CardWrapper = styled.div`
  width: 310px;
  height: 70vh;
  text-align: left;
  overflow-y: scroll;
  @media screen and (max-width: 800px) {
    display: none;
  }
`;

const InstructionTextWrapper = styled.div`
  padding: 20px;
  border: solid 1px #a3a3a3;
  background: white;
  color: black;
  height: fit-content;
  font-weight: 500;
  @media screen and (max-width: 800px) {
    display: initial;
  }
`;

const InstructionTextHeading = styled.h1``;
const ClustererIconWrapper = styled.div`
  display: flex;
  width: 85%;
  font-size: 0.75rem;
`;
const ClustererIcon = styled.div`
  height: 30px;
  width: 30px;
  background-image: url(${wheel.src});
  background-size: cover;
`;
const ClustererIconCaption = styled.div`
  width: 85%;
  margin-left: 5px;
`;

const InstructionTextSmallScreenWrapper = styled.div`
  display: none;
  .p {
  }
  @media screen and (max-width: 800px) {
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

const InstructionTextContent = styled.p`
  width: 85%;
  margin-left: 5px;
`;

const ArtworkCardWrapper = styled.div<{
  $cardBackground: string;
  $cardHeight: string;
}>`
  width: 100%;
  background: ${(props) => props.$cardBackground};
  height: ${(props) => props.$cardHeight};
  border: solid 1px white;
  border-top: none;
  padding: 10px 20px;
  overflow-y: hidden;
  &:hover {
    background: white;
    height: fit-content;
  }
`;

const ArtworkInfoWrapper = styled.div`
  display: flex;
  min-height: 100px;
`;

const ArtworkTitle = styled.p`
  padding: 12px 0;
`;
const ArtistLocationsIntro = styled.p`
  width: 96vw;
  margin: auto;
  text-align: left;
  padding-bottom: 20px;
`;
const ArtworkPrimaryInfo = styled.div`
  display: flex;
`;
const ArtworkImage = styled.img`
  height: 100px;
  margin: 20px 0 10px;
`;

const CollectionLocation = styled.p`
  font-size: 0.75rem;
  padding-top: 5px;
`;
const MarkerIcon = styled.div`
  width: 40px;
  height: 40px;
  background-image: url(${museumMarker.src});
  background-size: cover;
  margin-right: 10px;
`;
const ArtworkCardTitle = styled.div`
  width: 165px;
`;

const ArtworkLink = styled.div`
  cursor: pointer;
  color: #275fcf;
  padding-top: 10px;
`;

const MapContentWrapper = styled.div`
  position: relative;
  flex-direction: column;
  margin: auto;
  height: 70vh;
  width: 100%;
  .gm-style .gm-style-iw-c {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    padding-left: 0px !important;
    padding-right: 0px !important;
    height: auto !important;
    min-height: 100px !important;
    width: 350px !important;
    min-width: 350px !important;
    box-sizing: border-box;
    top: 5px;
    left: 0;
    background-color: white;
    border-radius: 0px;
    box-shadow: 0 2px 7px 1px rgba(0, 0, 0, 0.3);
  }

  .gm-style-iw-d {
    overflow: hidden !important;
  }
`;

const MapContent = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
`;

const InfoWindowImage = styled.div<{ $bgImage: string | undefined }>`
  background-image: url(${(props) => props.$bgImage});
  width: 100px;
  background-size: cover;
  height: 100%;
`;
const ArtworkInfo = styled.div`
  margin: 0 12px 5px;
`;
const InputWrapper = styled.div`
  display: none;
`;
const ArtworkLocation = styled.div`
  text-align: left;
`;

function InstructionText() {
  return (
    <InstructionTextWrapper>
      <InstructionTextHeading>
        <strong>
          Hover and tap on the boxes below, or markers on the map&nbsp;
        </strong>
        to explore details about highlighted artworks.
      </InstructionTextHeading>
      <br />

      <ClustererIconWrapper>
        <ClustererIcon />
        <ClustererIconCaption>
          <strong>
            The purple circle means the area has multiple artworks to be
            explored.
          </strong>
        </ClustererIconCaption>
      </ClustererIconWrapper>
    </InstructionTextWrapper>
  );
}

function InstructionTextSmallScreen() {
  return (
    <InstructionTextSmallScreenWrapper>
      <IconWrapper>
        <SelectIcon />

        <InstructionTextContent>
          <strong>Step 1: Click on map markers </strong>
          to explore details about highlighted artworks.
        </InstructionTextContent>
      </IconWrapper>

      <IconWrapper>
        <ImageIcon />
        <InstructionTextContent>
          <strong>Step 2: Click on artwork images </strong>to go to the next
          gallery.
        </InstructionTextContent>
      </IconWrapper>
      <IconWrapper>
        <ClustererIcon />
        <InstructionTextContent>
          The purple circle means the area has multiple artworks to be explored.
        </InstructionTextContent>
      </IconWrapper>
    </InstructionTextSmallScreenWrapper>
  );
}

// eslint-disable-next-line no-unused-vars
const google = window.google;
const Libraries: (
  | "places"
  | "geometry"
  | "drawing"
  | "localContext"
  | "visualization"
)[] = ["places"];
interface IWindow {
  image?: string;
  galleries?: string[];
  title?: string;
  completitionYear?: number;
  artistName?: string;
  geometry?: { lat: number; lng: number } | null;
  id?: string;
}
export default function GoogleMaps() {
  const [selectedMarker, setSelectedMarker] = useState<IWindow>({});
  const [galleries, setGalleries] = useState<IArtworks>([]);
  const [artist, setArtist] = useState<string>();
  const artworkRef = useRef<HTMLDivElement | null>(null);
  const destinationRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !== undefined
        ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        : "",
    libraries: Libraries,
  });
  const center = useMemo(
    () =>
      artist === "frida-kahlo" ||
      artist === "dorothea-tanning" ||
      artist === "edward-hopper "
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

  useEffect(() => {
    const getArtist = async () => {
      getUserInfo(user.uid).then(({ recommendedArtist }) => {
        if (!recommendedArtist) {
          toast(() => <AlertBox />, {
            closeOnClick: false,
          });
          return;
        }
        setArtist(recommendedArtist);
        getHighlightedArtworks(recommendedArtist).then(
          ({ highlightedArtworks }) => {
            setGalleries(highlightedArtworks);
          }
        );
      });
    };
    if (user) {
      getArtist();
    }
  }, [user]);

  const getGallery = (gallery: IArtwork) => {
    if (destinationRef.current !== null) {
      destinationRef.current.value =
        gallery.galleries !== undefined ? gallery.galleries[0] : " ";
      setSelectedMarker(gallery);
    }
  };

  if (!isLoaded) {
    return null;
  }

  const artistLocationInfo = artistLocation?.filter(
    (location) => location?.artistUrl === artist
  )[0]?.artistLocation;

  return (
    <>
      <ArtistLocationsIntro>{artistLocationInfo}</ArtistLocationsIntro>
      <MapWrapper>
        <InstructionTextSmallScreen />
        <CardWrapper>
          <InstructionText />
          {galleries.map((gallery) => {
            const {
              id,
              title,
              completitionYear,
              image,
              media,
              sizeX,
              sizeY,
              galleries,
            } = gallery;
            return (
              <ArtworkCardWrapper
                key={id}
                ref={artworkRef}
                $cardBackground={selectedMarker.id == id ? "white" : "#a3a3a3"}
                $cardHeight={selectedMarker.id == id ? "fit-content" : "70px"}
                onPointerOver={() => {
                  getGallery(gallery);
                }}
              >
                <ArtworkPrimaryInfo>
                  <MarkerIcon />
                  <ArtworkCardTitle>
                    <strong>
                      <i>{title},</i>&nbsp;
                    </strong>
                    {completitionYear}
                  </ArtworkCardTitle>
                </ArtworkPrimaryInfo>
                <ArtworkImage src={`${image}`} />
                <p>
                  {media?.map((medium) => (
                    <span key={medium}>{medium} </span>
                  ))}
                </p>
                <p>
                  {sizeX} X {sizeY} cm
                </p>

                <CollectionLocation>
                  Collection of the {galleries}
                </CollectionLocation>
                <ArtworkLink
                  onClick={() => router.push(`/collection-maps/${id}`)}
                >
                  See artwork details
                </ArtworkLink>
              </ArtworkCardWrapper>
            );
          })}
        </CardWrapper>

        <MapContentWrapper>
          <MapContent>
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
            >
              <MarkerClusterer
                options={{
                  styles: clusterStyles,
                }}
              >
                {(clusterer) => {
                  return (
                    <>
                      {galleries.map((gallery) => {
                        const { id, geometry } = gallery;
                        return (
                          <Marker
                            key={id}
                            position={geometry}
                            onClick={() => {
                              getGallery(gallery);
                            }}
                            icon={{
                              url: `${museumMarker.src}`,
                            }}
                            clusterer={clusterer}
                          />
                        );
                      })}
                    </>
                  );
                }}
              </MarkerClusterer>
              {selectedMarker?.geometry && (
                <InfoWindow
                  onCloseClick={() => {
                    setSelectedMarker({});
                  }}
                  options={{
                    pixelOffset: new window.google.maps.Size(0, -40),
                  }}
                  position={selectedMarker.geometry}
                >
                  <ArtworkInfoWrapper>
                    <Link href={`/collection-maps/${selectedMarker.id}`}>
                      <InfoWindowImage $bgImage={selectedMarker.image} />
                    </Link>
                    <Link href={`/collection-maps/${selectedMarker.id}`}>
                      <ArtworkInfo>
                        <ArtworkTitle>
                          <strong>
                            <i>{selectedMarker.title}, </i>
                          </strong>
                          {selectedMarker.completitionYear}
                        </ArtworkTitle>
                        <ArtworkLocation>
                          {selectedMarker.galleries}
                        </ArtworkLocation>
                      </ArtworkInfo>
                    </Link>
                  </ArtworkInfoWrapper>
                </InfoWindow>
              )}
            </GoogleMap>
          </MapContent>
          <InputWrapper>
            <input type="text" ref={destinationRef} />
          </InputWrapper>
        </MapContentWrapper>
      </MapWrapper>
    </>
  );
}
