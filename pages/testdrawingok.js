//draw circle, change color, text...etc
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
// import rough from "roughjs/bundled/rough.esm";
import getStroke from "perfect-freehand";
import styled from "@emotion/styled";
import undoDrawing from "../asset/undo.png";
import drawRectangle from "../asset/rectangle.png";
import pencilTool from "../asset/sketching.png";
import selectionTool from "../asset/selection.png";
import drawLine from "../asset/diagonal-line.png";
import downloadImage from "../asset/download.png";

const FunctionButton = styled.div`
  // <{ $bgImage: string } >
  background-image: url(${(props) => props.$bgImage});
  width: 30px;
  height: 30px;
  background-size: cover;
  cursor: pointer;
  margin-right: 10px;
`;
// interface ILabel {
//   value: string | undefined;
//   filled: string | undefined;
//   unfilled: string | undefined;
// }

const emojis = [
  "I feel seen",
  "I can relate to the artist",
  "I feel supported",
  "I feel hopeful",
];
const rough = require("roughjs/bundled/rough.cjs");
const generator = rough.generator(); //rough js api

const createElement = (id, x1, y1, x2, y2, type, color) => {
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
            }); // generate the rectangle according to spec
      return { id, x1, y1, x2, y2, type, roughElement, color };
    case "pencil":
      return { id, type, points: [{ x: x1, y: y1 }] };
    case "text":
      return { id, type, x1, y1, x2, y2, text: "" };
    default:
      throw new Error(`Type not recognised: ${type}`);
  }
};

const nearPoint = (x, y, x1, y1, name) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

const onLine = (x1, y1, x2, y2, x, y, maxDistance = 1) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? "inside" : null;
};

const positionWithinElement = (x, y, element) => {
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
      const betweenAnyPoint = element.points.some((point, index) => {
        const nextPoint = element.points[index + 1];
        if (!nextPoint) return false;
        return (
          onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 1) != null
        );
      });
      return betweenAnyPoint ? "inside" : null;
    case "text":
      return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
    default:
      throw new Error(`Type not recognised: ${type}`);
  }
};

const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const getElementAtPosition = (x, y, elements) => {
  //check through each element to see if mouse is within it
  return (
    elements
      .map((element) => ({
        ...element,
        position: positionWithinElement(x, y, element),
        //return position of the element
      }))
      //return position within the element
      .find((element) => element.position !== null)
  );
};

const adjustElementCoordinates = (element) => {
  const { type, x1, y1, x2, y2 } = element;
  if (type === "rectangle") {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    //regardless of which direction i draw the element, update x1, x2, y1, y2 accoridng to the current shape
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }
};

const cursorForPosition = (position) => {
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

const resizedCoordinates = (pageX, pageY, position, coordinates) => {
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
      return null; //should not really get here...
  }
};

const useHistory = (initialState) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (action, overwrite = false) => {
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

const getSvgPathFromStroke = (stroke) => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
};

const drawElement = (roughCanvas, context, element) => {
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
    case "text":
      context.textBaseline = "top";
      context.font = "24px sans-serif";
      context.fillText(element.text, element.x1, element.y1);
      break;
    default:
      throw new Error(`Type not recognised: ${element.type}`);
  }
};

const adjustmentRequired = (type) => ["line", "rectangle"].includes(type);

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

const Drawing = () => {
  const [elements, setElements, undo, redo] = useHistory([]);
  const [action, setAction] = useState("none");
  const [tool, setTool] = useState("text");
  const [selectedElement, setSelectedElement] = useState(null);
  const textAreaRef = useRef();
  const canvasRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  console.log(selectedColor);
  useLayoutEffect(() => {
    ///for manipulating dom element, want it to be ready before you do anything
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => {
      if (action === "writing" && selectedElement.id === element.id) return;
      drawElement(roughCanvas, context, element);
    });
  }, [elements, action, selectedElement]);

  useEffect(() => {
    const undoRedoFunction = (event) => {
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

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (action === "writing") {
      textArea.focus();
      textArea.value = selectedElement.text;
    }
  }, [action, selectedElement]);

  const updateElement = (id, x1, y1, x2, y2, type, options, color) => {
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
      case "text":
        const textWidth = document
          .getElementById("canvas")
          .getContext("2d")
          .measureText(options.text).width;
        const textHeight = 24;
        elementsCopy[id] = {
          ...createElement(
            id,
            x1,
            y1,
            x1 + textWidth,
            y1 + textHeight,
            type,
            color
          ),
          text: options.text,
        };
        break;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }

    setElements(elementsCopy, true);
  };

  const handleMouseDown = (event) => {
    if (action === "writing") return;

    const { pageX, pageY } = event;
    if (tool === "selection") {
      const element = getElementAtPosition(pageX, pageY, elements);
      if (element) {
        if (element.type === "pencil") {
          const xOffsets = element.points.map((point) => pageX - point.x);
          const yOffsets = element.points.map((point) => pageY - point.y);
          setSelectedElement({ ...element, xOffsets, yOffsets });
        } else {
          const offsetX = pageX - element.x1;
          const offsetY = pageY - element.y1;
          setSelectedElement({ ...element, offsetX, offsetY });
        }
        setElements((prevState) => prevState);

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
        pageX,
        pageY,
        pageX,
        pageY,
        tool,
        selectedColor
      );
      setElements((prevState) => [...prevState, element]);
      setSelectedElement(element);

      setAction(tool === "text" ? "writing" : "drawing");
    }
  };

  const handleMouseMove = (event) => {
    const { pageX, pageY } = event;

    if (tool === "selection") {
      const element = getElementAtPosition(pageX, pageY, elements); //getElementAtPosition()??
      event.target.style.cursor = element
        ? cursorForPosition(element.position)
        : "default";
    }

    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index]; //get x and y from the last element
      updateElement(index, x1, y1, pageX, pageY, tool, Option, selectedColor);
    } else if (action === "moving") {
      if (selectedElement.type === "pencil") {
        const newPoints = selectedElement.points.map((_, index) => ({
          x: pageX - selectedElement.xOffsets[index],
          y: pageY - selectedElement.yOffsets[index],
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
        const newX1 = pageX - offsetX;
        const newY1 = pageY - offsetY;
        const newColor = color;
        const options = type === "text" ? { text: selectedElement.text } : {};
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
      const { id, type, position, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = resizedCoordinates(
        pageX,
        pageY,
        position,
        coordinates
      );
      updateElement(id, x1, y1, x2, y2, type, Option);
    }
  };

  const handleMouseUp = (event) => {
    const { pageX, pageY } = event;
    if (selectedElement) {
      if (
        selectedElement.type === "text" &&
        pageX - selectedElement.offsetX === selectedElement.x1 &&
        pageY - selectedElement.offsetY === selectedElement.y1
      ) {
        setAction("writing");
        return;
      }

      const index = selectedElement.id;
      const { id, type } = elements[index];
      if (
        (action === "drawing" || action === "resizing") &&
        //both needs to update coordinates after actions.
        adjustmentRequired(type)
      ) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updateElement(id, x1, y1, x2, y2, type, Option, selectedColor);
      }
    }

    if (action === "writing") return;

    setAction("none");
    setSelectedElement(null);
  };

  const handleBlur = (event) => {
    const { id, x1, y1, type } = selectedElement;
    setAction("none");
    setSelectedElement(null);
    updateElement(id, x1, y1, null, null, type, { text: event.target.value });
  };

  const download = async () => {
    const image = canvasRef.current.toDataURL("image/png");
    const blob = await (await fetch(image)).blob();
    const blobURL = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobURL;
    link.download = "healing-museum-drawing-board.png";
    link.click();
  };

  return (
    <div>
      <div style={{ position: "fixed", display: "flex" }}>
        <FunctionButton
          $bgImage={`${selectionTool.src}`}
          onClick={() => setTool("selection")}
        />
        <FunctionButton
          $bgImage={`${drawLine.src}`}
          onClick={() => setTool("line")}
        />
        <FunctionButton
          $bgImage={`${drawRectangle.src}`}
          onClick={() => setTool("rectangle")}
        />
        <FunctionButton
          $bgImage={`${pencilTool.src}`}
          onClick={() => setTool("pencil")}
        />
        {/* <FunctionButton
          $bgImage={`${undoDrawing.src}`}
          onClick={() => setTool("text")}
        /> */}

        {colors.map((color) => (
          <div
            key={color}
            role="button"
            style={{ background: `${color}`, width: "20px", height: "20px" }}
            onClick={() => setSelectedColor(color)}
          ></div>
        ))}
        <FunctionButton $bgImage={`${undoDrawing.src}`} onClick={undo} />

        <FunctionButton
          $bgImage={`${undoDrawing.src}`}
          style={{ transform: "scaleX(-1)" }}
          onClick={redo}
        />

        {/* <button onClick={clear}>Clear</button> */}
        <FunctionButton $bgImage={`${downloadImage.src}`} onClick={download} />
      </div>

      {action === "writing" ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          style={{
            position: "fixed",
            top: selectedElement.y1 - 2,
            left: selectedElement.x1,
            font: "24px sans-serif",
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            resize: "auto",
            overflow: "hidden",
            whiteSpace: "pre",
            background: "transparent",
          }}
        />
      ) : null}
      <canvas
        id="canvas"
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        Canvas
      </canvas>
    </div>
  );
};

export default Drawing;

// import { useCallback, useEffect, useRef, useState } from "react";

// function DrawingBoard() {
//   const canvasRef = useRef(null);
//   const ctx = useRef(null); //context of the canvas

//   const [mouseDown, setMouseDown] = useState(false);
//   const [lastPosition, setPosition] = useState({
//     x: 0,
//     y: 0,
//   });

//   useEffect(() => {
//     if (canvasRef.current) {
//       //when the canvas is mounted
//       ctx.current = canvasRef.current.getContext("2d"); ///getting 2d context to draw; don't setState becasue we don't want instance to constantly change
//     }
//   }, []);

//   const draw = useCallback(
//     //use state var inside it, so need this function to be redefined when the state changes
//     (x, y) => {
//       if (mouseDown) {
//         ctx.current.beginPath();
//         ctx.current.strokeStyle = selectedColor;
//         ctx.current.lineWidth = 5;
//         ctx.current.lineJoin = "round"; //sharp, meter
//         ctx.current.moveTo(lastPosition.x, lastPosition.y);
//         ctx.current.lineTo(x, y); //last position to new position
//         ctx.current.closePath();
//         ctx.current.stroke(); //stroke the line for it to be visible

//         setPosition({
//           x,
//           y,
//         });
//       }
//     },
//     [lastPosition, mouseDown, selectedColor, setPosition]
//   );

//   const clear = () => {
//     ctx.current.clearRect(
//       0,
//       0,
//       ctx.current.canvas.width,
//       ctx.current.canvas.height
//     );
//   };

//   return (
//     <div>
//       <canvas

//         width={400}
//         height={400}

//       />
