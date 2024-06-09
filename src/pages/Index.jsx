import { useEffect, useRef, useState } from "react";
import { Container, Button, HStack } from "@chakra-ui/react";

const Index = () => {
  const canvasRef = useRef(null);
  const [shape, setShape] = useState("square");
  const [isResizing, setIsResizing] = useState(false);
  const [shapes, setShapes] = useState([]);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const drawShape = (x, y, width, height, shapeType) => {
      context.fillStyle = "blue";
      if (shapeType === "square" || shapeType === "rectangle") {
        context.fillRect(x, y, width, height);
      } else if (shapeType === "circle") {
        context.beginPath();
        context.arc(x, y, width / 2, 0, 2 * Math.PI);
        context.fill();
      }
    };

    const redrawShapes = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      shapes.forEach(({ x, y, width, height, shapeType }) => {
        drawShape(x, y, width, height, shapeType);
      });
    };

    const handleMouseDown = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (shape === "rectangle" || shape === "square") {
        setIsResizing(true);
        setStartPos({ x, y });
        setShapes((prevShapes) => [
          ...prevShapes,
          { x, y, width: 0, height: 0, shapeType: shape },
        ]);
      } else if (shape === "circle") {
        setShapes((prevShapes) => [
          ...prevShapes,
          { x, y, width: 100, height: 100, shapeType: shape },
        ]);
        redrawShapes();
      }
    };

    const handleMouseMove = (event) => {
      if (!isResizing) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const newWidth = x - startPos.x;
      const newHeight = y - startPos.y;

      setShapes((prevShapes) => {
        const updatedShapes = [...prevShapes];
        const currentShape = updatedShapes[updatedShapes.length - 1];
        currentShape.width = newWidth;
        currentShape.height = newHeight;
        return updatedShapes;
      });

      redrawShapes();
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [shape, isResizing, shapes]);

  return (
    <Container centerContent maxW="container.xl" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <HStack spacing={4} mb={4} position="absolute" top={4} zIndex={10}>
        <Button onClick={() => setShape("square")}>Square</Button>
        <Button onClick={() => setShape("rectangle")}>Rectangle</Button>
        <Button onClick={() => setShape("circle")}>Circle</Button>
      </HStack>
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} style={{ border: "1px solid black" }} />
    </Container>
  );
};

export default Index;