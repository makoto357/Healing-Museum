import styled from "@emotion/styled";
import { Droppable, Draggable } from "react-beautiful-dnd";
import drag from "../asset/drag.png";
const CollectionWrapper = styled.div`
  display: flex;
  @media screen and (max-width: 650px) {
    flex-direction: column;
  }
`;

const DroppableWrapper = styled.div`
  border: 1px solid black;
  height: 180px;
  padding: 13px;
  width: 80vw;
  margin-left: 5vw;
`;

const TextWrapper = styled.div`
  height: 150px;
  width: 150px;
  overflow: hidden;
  display: flex;
  position: relative;
`;

const TextScreen = styled.div<{ $displayText: string }>`
  background: black;
  height: 100%;
  position: absolute;
  padding: 10px;
  text-align: left;
  opacity: 0.5;
  color: white;
  width: 100%;
  display: ${(props) => props.$displayText};
  z-index: 10;
  overflow-y: scroll;
  overflow-x: hidden;
  white-space: normal;
`;

const ArtworkImage = styled.img`
  height: auto;
  min-height: 150px;
  min-width: 150px;
  z-index: -1;
`;
const PostWrapper = styled.div`
  padding: 5px 10px;
  height: 150px;
  width: 150px;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  row-gap: 15px;
  overflow-y: scroll;
  white-space: normal;

  &:hover {
    background-color: #2c2b2c;
    color: white;
    opacity: 0.5;
  }
`;
const DragInstruction = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto 2vw;
  @media screen and (max-width: 650px) {
    flex-direction: row;
    margin: 20px auto;
  }
`;
const DragButton = styled.div`
  background-image: url(${drag.src});
  margin: 0 auto;
  width: 50px;
  height: 50px;
  background-size: cover;
  @media screen and (max-width: 650px) {
    margin-right: 10px;
  }
`;

const TextScreenContent = styled.p`
  margin-top: auto;
`;
const InstructionText = styled.div`
  text-align: left;
`;
const getListStyle = (isDraggingOver) => ({
  whiteSpace: "nowrap",
  overflow: "scroll",
});

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  width: 150,
  height: 150,
  display: "inline-block",
  overflow: "scroll",
  margin: `0 20px 0 0`,
  ...draggableStyle,
});

export default function CollectionColumn({
  showFavoriteArtworks,
  artwork,
  setShowText,
  showText,
  favoritePosts,
}) {
  return (
    <CollectionWrapper>
      <DroppableWrapper>
        <Droppable direction="horizontal" droppableId="drop-id">
          {(droppableProvided, droppableSnapshot) => (
            <div
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
              style={getListStyle(droppableSnapshot.isDraggingOver)}
            >
              {showFavoriteArtworks &&
                artwork.map((artwork, index) => {
                  return (
                    <Draggable
                      draggableId={artwork.id}
                      index={index}
                      key={artwork.id}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <TextWrapper
                            onMouseEnter={() => setShowText(artwork.id)}
                            onMouseLeave={() => setShowText(null)}
                          >
                            <TextScreen
                              $displayText={
                                showText == artwork.id ? "initial" : "none"
                              }
                            >
                              <TextScreenContent>
                                {artwork.artistName}
                                <br />
                                <i>
                                  <strong>{artwork.title},</strong>
                                </i>{" "}
                                {artwork.year}
                              </TextScreenContent>
                            </TextScreen>
                            <div>
                              <ArtworkImage src={artwork.image} />
                            </div>
                          </TextWrapper>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              {!showFavoriteArtworks &&
                favoritePosts?.map((post, index) => {
                  return (
                    <Draggable
                      draggableId={post?.id}
                      index={index}
                      key={post?.id}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <PostWrapper key={post?.id}>
                            <div>
                              <h1>
                                <strong>{post?.title}</strong>
                              </h1>
                              <p>{post?.postTime}</p>
                            </div>
                            <div>
                              <p>
                                <strong>Posted by: </strong>
                                {post?.postBy}
                              </p>
                              <p>
                                <strong>Artist: </strong>
                                {post?.artist}
                              </p>
                            </div>
                          </PostWrapper>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DroppableWrapper>
      <DragInstruction>
        <DragButton />

        <InstructionText>
          <strong>1. Scroll to see collections</strong>
          <br />
          <strong>2. Drag to adjust order</strong>
        </InstructionText>
      </DragInstruction>
    </CollectionWrapper>
  );
}
