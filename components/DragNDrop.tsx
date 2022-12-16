import styled from "@emotion/styled";
import { Droppable, Draggable } from "react-beautiful-dnd";
import React from "react";
import { IFavoriteArtwork, IFavoritePost } from "../utils/firebaseFuncs";
import drag from "../asset/drag.png";
const CollectionWrapper = styled.div`
  display: flex;
  @media screen and (max-width: 650px) {
    flex-direction: column;
  }
`;
const DraggableWrapper = styled.div`
  user-select: none;
  width: 150;
  height: 150;
  display: inline-block;
  overflow: scroll;
  margin: 0 20px 0 0;
`;
const DroppableWrapper = styled.div`
  border: 1px solid black;
  height: 180px;
  padding: 13px;
  width: 80vw;
  margin-left: 5vw;
`;

const DroppableList = styled.div`
  white-space: nowrap;
  overflow: scroll;
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

export default function CollectionColumn({
  showFavoriteArtworks,
  artwork,
  setShowText,
  showText,
  favoritePosts,
}: {
  showFavoriteArtworks: boolean;
  artwork: IFavoriteArtwork[];
  setShowText: React.Dispatch<React.SetStateAction<string | undefined>>;
  showText: string | undefined;
  favoritePosts: IFavoritePost[];
}) {
  return (
    <CollectionWrapper>
      <DroppableWrapper>
        <Droppable direction="horizontal" droppableId="drop-id">
          {(droppableProvided) => (
            <DroppableList
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
            >
              {showFavoriteArtworks &&
                artwork.map((artwork, index) => {
                  const { id, artistName, title, image, year } = artwork;
                  return (
                    <Draggable
                      draggableId={id !== undefined ? id : `${index}`}
                      index={index}
                      key={id}
                    >
                      {(provided) => (
                        <DraggableWrapper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TextWrapper
                            onMouseEnter={() => setShowText(id)}
                            onMouseLeave={() => setShowText("")}
                          >
                            <TextScreen
                              $displayText={showText == id ? "initial" : "none"}
                            >
                              <TextScreenContent>
                                {artistName}
                                <br />
                                <i>
                                  <strong>{title},</strong>
                                </i>
                                {year}
                              </TextScreenContent>
                            </TextScreen>
                            <div>
                              <ArtworkImage src={image} />
                            </div>
                          </TextWrapper>
                        </DraggableWrapper>
                      )}
                    </Draggable>
                  );
                })}
              {!showFavoriteArtworks &&
                favoritePosts?.map((favoritePost, index) => {
                  const { id, postMadeBy, artistForThisVisit, date, title } =
                    favoritePost;
                  return (
                    <Draggable
                      draggableId={id !== undefined ? id : `${index}`}
                      index={index}
                      key={id}
                    >
                      {(provided) => (
                        <DraggableWrapper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <PostWrapper key={id}>
                            <div>
                              <h1>
                                <strong>{title}</strong>
                              </h1>
                              <p>{date}</p>
                            </div>
                            <div>
                              <p>
                                <strong>Posted by: </strong>
                                {postMadeBy}
                              </p>
                              <p>
                                <strong>Artist: </strong>
                                {artistForThisVisit}
                              </p>
                            </div>
                          </PostWrapper>
                        </DraggableWrapper>
                      )}
                    </Draggable>
                  );
                })}
              {droppableProvided.placeholder}
            </DroppableList>
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
