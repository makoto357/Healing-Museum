import ReactPlayer from "react-player";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  .player-wrapper {
    width: auto;
    height: auto;
  }
  .react-player {
    padding-top: 56.25%;
    position: relative;
  }

  .react-player > div {
    position: absolute;
    top: 24px;
  }
`;
export function YoutubeVideoPlayer({
  id,
  playing,
}: {
  id: string | undefined;
  playing: boolean;
}) {
  const url = `https://www.youtube.com/watch?v=${id}`;
  return (
    <Wrapper className="player-wrapper">
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
        controls
      />
    </Wrapper>
  );
}
