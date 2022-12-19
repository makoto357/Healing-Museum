/* eslint-disable no-case-declarations */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getStroke } from "perfect-freehand";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../config/firebase";
import SignpostButton from "../components/Button";
import undoDrawing from "../asset/undo.png";
import redoDrawing from "../asset/redo.png";

import drawRectangle from "../asset/rectangle.png";
import pencilTool from "../asset/sketching.png";
import selectionTool from "../asset/selection.png";
import drawLine from "../asset/diagonal-line.png";
import downloadImage from "../asset/download.png";
import undoDrawingBlue from "../asset/undo-blue.png";
import redoDrawingBlue from "../asset/redo-blue.png";

import drawRectangleBlue from "../asset/rectangle-blue.png";
import pencilToolBlue from "../asset/sketching-blue.png";
import selectionToolBlue from "../asset/selection-blue.png";
import drawLineBlue from "../asset/diagonal-line-blue.png";
import downloadImageBlue from "../asset/download-blue.png";
import bin from "../asset/bin.png";
import binBlue from "../asset/bin-blue.png";

const AlertMessageWrapper = styled.div``;
const AlertMessage = styled.p``;
const AlertButtonWrapper = styled.div`
  width: 100%;
`;
const AlertButton = styled.button`
  margin: 5px 10px 0 0;
  padding: 3px 10px;
  background: black;
  color: white;
`;
const Wrapper = styled.div`
  position: relative;
`;
const InstructionText = styled.div`
  padding-top: 40px;
  width: 96vw;
  margin: auto;
  font-size: 1.25rem;
`;

const ToolBar = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  left: 24px;
  margin-top: 24px;
  align-items: center;
  @media screen and (max-width: 600px) {
    margin-top: 10px;
    left: 5px;
  }
`;
const ButtonWrapper = styled.div`
  background: white;
  padding: 20px 10px;
  border-radius: 5px;
  border: 1px solid #bbb6ac;
  margin-bottom: 10px;
`;

const FunctionButtonLabel = styled.div<{ $showLabel: string }>`
  position: absolute;
  left: 50px;
  width: fit-content;
  white-space: nowrap;
  border-radius: 20px;
  background: #2c2b2c;
  color: white;
  padding: 5px 10px;
  font-weight: 500;
  margin-top: -8px;
  display: ${(props) => props.$showLabel};
`;
const FunctionButton = styled.div<{ $bgImage: string; $bgImageHover: string }>`
  background-image: url(${(props) => props.$bgImage});
  width: 20px;
  height: 20px;
  background-size: cover;
  cursor: pointer;
  margin-bottom: 20px;
  &:hover {
    background-image: url(${(props) => props.$bgImageHover});
  }
`;

const ColorOption = styled.div<{ $bgColor: string; $colorBorder: string }>`
  background: ${(props) => props.$bgColor};
  width: 25px;
  height: 25px;
  border: ${(props) => props.$colorBorder};
`;

const ColorPicker = styled.div`
  display: flex;
  position: absolute;
  margin-top: 24px;
  left: 200px;
  align-items: center;
  @media screen and (max-width: 600px) {
    margin-top: 10px;
    left: 52px;
  }
`;
const rough = require("roughjs/bundled/rough.cjs");
const generator = rough.generator();
const PreloadBackgroundImg = styled.div`
  display: none;
`;
const Img = styled.img``;
export function PreloadImages() {
  return (
    <PreloadBackgroundImg>
      <Img src={selectionToolBlue.src} />
      <Img src={selectionTool.src} />
      <Img src={drawLineBlue.src} />
      <Img src={drawLine.src} />
      <Img src={drawRectangleBlue.src} />
      <Img src={drawRectangle.src} />
      <Img src={pencilToolBlue.src} />
      <Img src={pencilTool.src} />
      <Img src={downloadImageBlue.src} />
      <Img src={downloadImage.src} />
      <Img src={undoDrawingBlue.src} />
      <Img src={undoDrawing.src} />
      <Img src={redoDrawingBlue.src} />
      <Img src={redoDrawing.src} />
      <Img src={binBlue.src} />
      <Img src={bin.src} />
    </PreloadBackgroundImg>
  );
}

const createElement = (
  id: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type: string,
  color: string
) => {
  switch (type) {
    case "line":
    case "rectangle":
      const roughElement =
        type === "line"
          ? generator.line(x1, y1, x2, y2, {
              stroke: color,
            })
          : generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
              fill: color,
            });
      return { id, x1, y1, x2, y2, type, roughElement, color };
    case "pencil":
      return { id, type, points: [{ x: x1, y: y1 }] };

    default:
      throw new Error(`Type not recognised: ${type}`);
  }
};

const nearPoint = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  name: string
) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

const onLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
  y: number,
  maxDistance = 1
) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? "inside" : null;
};

const positionWithinElement = (x: number, y: number, element: any) => {
  const { type, x1, x2, y1, y2 } = element;
  switch (type) {
    case "line":
      const on = onLine(x1, y1, x2, y2, x, y);
      const start = nearPoint(x, y, x1, y1, "start");
      const end = nearPoint(x, y, x2, y2, "end");
      return start || end || on;
    case "rectangle":
      const topLeft = nearPoint(x, y, x1, y1, "tl");
      const topRight = nearPoint(x, y, x2, y1, "tr");
      const bottomLeft = nearPoint(x, y, x1, y2, "bl");
      const bottomRight = nearPoint(x, y, x2, y2, "br");
      const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
      return topLeft || topRight || bottomLeft || bottomRight || inside;
    case "pencil":
      const betweenAnyPoint = element.points.some(
        (point: any, index: number) => {
          const nextPoint = element.points[index + 1];
          if (!nextPoint) return false;
          return (
            onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 1) != null
          );
        }
      );
      return betweenAnyPoint ? "inside" : null;
    default:
      throw new Error(`Type not recognised: ${type}`);
  }
};

const distance = (a: any, b: any) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const getElementAtPosition = (x: number, y: number, elements: any) => {
  return elements
    .map((element: any) => ({
      ...element,
      position: positionWithinElement(x, y, element),
    }))
    .find((element: any) => element.position !== null);
};

const adjustElementCoordinates = (element: any) => {
  const { type, x1, y1, x2, y2 } = element;
  if (type === "rectangle") {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    //regardless of which direction the element is drawn, update x1, x2, y1, y2 according to the current shape
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }
};

const cursorForPosition = (position: string) => {
  switch (position) {
    case "tl":
    case "br":
    case "start":
    case "end":
      return "nwse-resize";
    case "tr":
    case "bl":
      return "nesw-resize";
    default:
      return "move";
  }
};

const resizedCoordinates = (
  pageX: number,
  pageY: number,
  position: string,
  color: string,
  coordinates: { x1: number; y1: number; x2: number; y2: number }
) => {
  const { x1, y1, x2, y2 } = coordinates;
  switch (position) {
    case "tl":
    case "start":
      return { x1: pageX, y1: pageY, x2, y2 };
    case "tr":
      return { x1, y1: pageY, x2: pageX, y2 };
    case "bl":
      return { x1: pageX, y1, x2, y2: pageY };
    case "br":
    case "end":
      return { x1, y1, x2: pageX, y2: pageY };
    default:
      return { x1, y1, x2, y2 };
  }
};

const useHistory = (initialState: any) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (action: any, overwrite = false) => {
    const newState =
      typeof action === "function" ? action(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex((prevState) => prevState + 1);
    }
  };

  const undo = () => index > 0 && setIndex((prevState) => prevState - 1);
  const redo = () =>
    index < history.length - 1 && setIndex((prevState) => prevState + 1);

  return [history[index], setState, undo, redo];
};

const getSvgPathFromStroke = (stroke: any) => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc: any, [x0, y0]: [x0: number, y0: number], i: number, arr: any) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
};

const drawElement = (roughCanvas: any, context: any, element: any) => {
  switch (element.type) {
    case "line":
    case "rectangle":
      roughCanvas.draw(element.roughElement);
      break;
    case "pencil":
      const stroke = getSvgPathFromStroke(
        getStroke(element.points, {
          size: 21,
          smoothing: 0.36,
          thinning: 0.47,
          streamline: 0.56,
          easing: (t) =>
            t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
          start: {
            taper: 18,
            cap: true,
          },
          end: {
            taper: 15,
            cap: true,
          },
        })
      );
      context.fill(new Path2D(stroke));
      break;

    default:
      throw new Error(`Type not recognised: ${element.type}`);
  }
};

const adjustmentRequired = (type: string) =>
  ["line", "rectangle"].includes(type);

const colors = [
  "#a13b34",
  "#d39a72",
  "#E77136",
  "#ffc87c",
  "#F2C641",
  "#Ffe9a1",
  "#8aa56e",
  "#B1C0A4",
  "#49626B",
  "#A0BCB8",
  "#595775",
  "#ABa6bf",
];

const toolbarButtons = [
  {
    label: "Select",
    filled: selectionToolBlue.src,
    unfilled: selectionTool.src,
    value: "selection",
  },
  {
    label: "Line",
    filled: drawLineBlue.src,
    unfilled: drawLine.src,
    value: "line",
  },
  {
    label: "Rectangle",
    filled: drawRectangleBlue.src,
    unfilled: drawRectangle.src,
    value: "rectangle",
  },
  {
    label: "Pencil",
    filled: pencilToolBlue.src,
    unfilled: pencilTool.src,
    value: "pencil",
  },
];

export default function Drawing() {
  const [elements, setElements, undo, redo] = useHistory([]);
  const [action, setAction] = useState<string>("none");
  const [tool, setTool] = useState<string>("rectangle");
  const { user } = useAuth();
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [showLabel, setShowLabel] = useState({
    label: " ",
    filled: " ",
    unfilled: " ",
    value: " ",
  });
  const [showFunction, setShowFunction] = useState({
    filled: " ",
    unfilled: " ",
    function: " ",
    label: "",
  });
  const router = useRouter();
  useLayoutEffect(() => {
    const canvas = document.getElementById(
      "canvas"
    ) as HTMLCanvasElement | null;
    const context = canvas?.getContext("2d");
    context?.clearRect(
      0,
      0,
      canvas !== null ? canvas.width : 0,
      canvas !== null ? canvas.height : 0
    );

    const roughCanvas = rough?.canvas(canvas);
    elements.forEach((element: any) => {
      if (action === "writing" && selectedElement.id === element.id) return;
      drawElement(roughCanvas, context, element);
    });
  }, [elements, action, selectedElement]);

  useEffect(() => {
    const undoRedoFunction = (event: any) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "z") {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [undo, redo]);

  const updateElement = (
    id: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type: string,
    options: any,
    color: string
  ) => {
    const elementsCopy = [...elements];

    switch (type) {
      case "line":
      case "rectangle":
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type, color);
        break;
      case "pencil":
        elementsCopy[id].points = [
          ...elementsCopy[id].points,
          { x: x2, y: y2 },
        ];
        break;

      default:
        throw new Error(`Type not recognised: ${type}`);
    }
    setElements(elementsCopy, true);
  };

  function getMousePos(canvas: any, evt: any) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  }

  const handleMouseDown = (event: any) => {
    if (action === "writing") return;
    var canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
    var pos = getMousePos(canvas, event);
    if (tool === "selection") {
      const element = getElementAtPosition(pos.x, pos.y, elements);
      if (element) {
        if (element.type === "pencil") {
          const xOffsets = element.points.map((point: any) => pos.x - point.x);
          const yOffsets = element.points.map((point: any) => pos.y - point.y);
          setSelectedElement({ ...element, xOffsets, yOffsets });
        } else {
          const offsetX = pos.x - element.x1;
          const offsetY = pos.y - element.y1;
          setSelectedElement({ ...element, offsetX, offsetY });
        }
        setElements((prevState: any) => prevState);
        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      }
    } else {
      const id = elements.length;
      const element = createElement(
        id,
        pos.x,
        pos.y,
        pos.x,
        pos.y,
        tool,
        selectedColor
      );
      setElements((prevState: any) => [...prevState, element]);
      setSelectedElement(element);
      setAction(tool === "text" ? "writing" : "drawing");
    }
  };

  const handleMouseMove = (event: any) => {
    var canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
    var pos = getMousePos(canvas, event);
    if (tool === "selection") {
      const element = getElementAtPosition(pos.x, pos.y, elements);
      event.target.style.cursor = element
        ? cursorForPosition(element.position)
        : "default";
    }

    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, pos.x, pos.y, tool, Option, selectedColor);
    } else if (action === "moving") {
      if (selectedElement?.type === "pencil") {
        const newPoints = selectedElement.points.map((_: any, index: any) => ({
          x: pos.x - selectedElement.xOffsets[index],
          y: pos.y - selectedElement.yOffsets[index],
        }));
        const elementsCopy = [...elements];
        elementsCopy[selectedElement.id] = {
          ...elementsCopy[selectedElement.id],
          points: newPoints,
        };
        setElements(elementsCopy, true);
      } else {
        const { id, x1, x2, y1, y2, type, offsetX, offsetY, color } =
          selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = pos.x - offsetX;
        const newY1 = pos.y - offsetY;
        const newColor = color;
        const options = type === "text" ? { text: selectedElement?.text } : {};
        updateElement(
          id,
          newX1,
          newY1,
          newX1 + width,
          newY1 + height,
          type,
          options,
          newColor
        );
      }
    } else if (action === "resizing") {
      const { id, type, position, color, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = resizedCoordinates(
        pos.x,
        pos.y,
        position,
        color,
        coordinates
      );
      updateElement(id, x1, y1, x2, y2, type, Option, color);
    }
  };

  const handleMouseUp = () => {
    if (selectedElement) {
      const index = selectedElement.id;
      const { id, type, color } = elements[index];
      if (
        (action === "drawing" || action === "resizing") &&
        adjustmentRequired(type)
      ) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updateElement(id, x1, y1, x2, y2, type, Option, color);
      }
    }

    if (action === "writing") return;

    setAction("none");
    setSelectedElement(null);
  };

  const download = async () => {
    if (elements.length === 0) return;
    else if (elements.length > 0 && canvasRef.current !== null) {
      const image = canvasRef.current.toDataURL("image/png");
      const blob = await (await fetch(image)).blob();
      const blobURL = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobURL;
      link.download = "healing-museum-drawing-board.png";
      link.click();
    }
  };

  const upload = async () => {
    const sendImage = async () => {
      if (canvasRef.current !== null) {
        const image = canvasRef.current.toDataURL("image/png");
        const blob = await (await fetch(image)).blob();
        return new Promise((resolve) => {
          const imageRef = ref(storage, `${user?.uid}/${Date.now()}`);

          const uploadTask = uploadBytesResumable(imageRef, blob);

          uploadTask.on(
            "state_changed",
            () => {},
            () => {},
            async () => {
              const res = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(res);
            }
          );
        });
      }
    };
    const newRes = await sendImage();
    await sendDrawing(newRes);
  };

  const sendDrawing = async (url: any) => {
    const IDRef = doc(db, "users", user?.uid);
    await updateDoc(IDRef, {
      drawings: arrayUnion(url),
    });
  };

  const clear = () => {
    const canvas = document.getElementById(
      "canvas"
    ) as HTMLCanvasElement | null;
    const context = canvas?.getContext("2d");
    if (canvas !== null) {
      context?.clearRect(0, 0, canvas.width, canvas.height);
      setElements([]);
    }
  };

  const functionBarButtons = [
    {
      filled: downloadImageBlue.src,
      unfilled: downloadImage.src,
      function: download,
      label: "Download",
    },
    {
      filled: undoDrawingBlue.src,
      unfilled: undoDrawing.src,
      function: undo,
      label: "Undo",
    },
    {
      filled: redoDrawingBlue.src,
      unfilled: redoDrawing.src,
      function: redo,
      label: "Redo",
    },
    {
      filled: binBlue.src,
      unfilled: bin.src,
      function: clear,
      label: "Clear",
    },
  ];
  const toNextPage = () => {
    if (elements.length === 0) {
      toast(() => (
        <AlertMessageWrapper>
          <AlertMessage>
            Your canvas is still blank, are you sure you want to skip this
            experience?
          </AlertMessage>
          <AlertButtonWrapper>
            <div>
              <AlertButton onClick={() => router.push("/quiz")}>
                Yes
              </AlertButton>
              <AlertButton>No</AlertButton>
            </div>
          </AlertButtonWrapper>
        </AlertMessageWrapper>
      ));
    } else {
      upload();
      router.push("/quiz");
    }
  };
  return (
    <Wrapper>
      <InstructionText>
        Drawing provides a way to express feelings without words, and is
        frequently used in art therapy sessions to release stress. What have
        been on your mind recently, which bring you joy, or sorrow?&nbsp;
        <strong>How about leaving them on this canvas?</strong>
      </InstructionText>
      <div onClick={toNextPage}>
        <SignpostButton href=" ">
          All done? Time for an art quiz!
        </SignpostButton>
      </div>
      <ColorPicker>
        {colors.map((color) => (
          <ColorOption
            $colorBorder={color == selectedColor ? "3px solid #275FCF" : "none"}
            $bgColor={color}
            key={color}
            role="button"
            onClick={() => setSelectedColor(color)}
          ></ColorOption>
        ))}
      </ColorPicker>

      <ToolBar>
        <ButtonWrapper>
          {toolbarButtons.map((toolbarButton) => (
            <div key={toolbarButton.value}>
              <FunctionButtonLabel
                $showLabel={
                  toolbarButton.label === showLabel.label ? "initial" : "none"
                }
              >
                {toolbarButton.label}
              </FunctionButtonLabel>
              <FunctionButton
                onMouseEnter={() => setShowLabel(toolbarButton)}
                onMouseLeave={() =>
                  setShowLabel({
                    label: " ",
                    filled: " ",
                    unfilled: " ",
                    value: " ",
                  })
                }
                $bgImage={
                  tool === toolbarButton.value
                    ? `${toolbarButton.filled}`
                    : `${toolbarButton.unfilled}`
                }
                $bgImageHover={`${toolbarButton.filled}`}
                onClick={() => setTool(toolbarButton.value)}
              />
            </div>
          ))}
        </ButtonWrapper>

        <ButtonWrapper>
          {functionBarButtons.map((functionBarButton) => (
            <div key={functionBarButton.label}>
              <FunctionButtonLabel
                $showLabel={
                  functionBarButton.filled === showFunction.filled
                    ? "initial"
                    : "none"
                }
              >
                {functionBarButton.label}
              </FunctionButtonLabel>
              <FunctionButton
                onMouseEnter={() => setShowFunction(functionBarButton)}
                onMouseLeave={() =>
                  setShowFunction({
                    filled: " ",
                    unfilled: " ",
                    function: " ",
                    label: "",
                  })
                }
                $bgImageHover={`${functionBarButton.filled}`}
                $bgImage={`${functionBarButton.unfilled}`}
                onClick={functionBarButton.function}
              />
            </div>
          ))}
        </ButtonWrapper>
      </ToolBar>

      <canvas
        id="canvas"
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ background: "white" }}
        onPointerDown={handleMouseDown}
        onPointerMove={handleMouseMove}
        onPointerUp={handleMouseUp}
      >
        Canvas
      </canvas>
    </Wrapper>
  );
}
