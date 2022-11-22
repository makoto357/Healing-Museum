import ReactPlayer from "react-player";
import { Box } from "@chakra-ui/react";

export function YoutubeVideoPlayer(props) {
  const { id, playing } = props;
  const url = `https://www.youtube.com/watch?v=${id}`;
  return (
    <Box className="player-wrapper">
      <ReactPlayer
        className="react-player"
        url={url}
        playing={playing}
        width="100%"
        height="100%"
        config={{
          youtube: {
            playerVars: { rel: 0 },
          },
        }}
        controls={true}
      />
    </Box>
  );
}
