import { useEffect, useRef, useState } from "react";
import { Container, Button, HStack } from "@chakra-ui/react";

const Index = () => {
  const canvasRef = useRef(null);
  const [shape, setShape] = useState("square");
  const [isResizing, setIsResizing] = useState(false);
  const [resizeRect, setResizeRect] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const drawShape = (x, y, width = 100, height = 50) => {
      context.fillStyle = "blue";
      context.fillRect(x, y, width, height);
    };

    const handleMouseDown = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (shape === "rectangle") {
        setIsResizing(true);
        setResizeRect({ x, y, width: 100, height: 50 });
        setStartPos({ x, y });
      }
    };

    const handleMouseMove = (event) => {
      if (!isResizing) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const newWidth = x - startPos.x;
      const newHeight = y - startPos.y;

      setResizeRect((prev) => ({
        ...prev,
        width: newWidth,
        height: newHeight,
      }));

      context.clearRect(0, 0, canvas.width, canvas.height);
      drawShape(resizeRect.x, resizeRect.y, newWidth, newHeight);
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
  }, [isResizing, resizeRect]);

  return (
    <Container centerContent maxW="container.xl" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <HStack spacing={4} mb={4} position="absolute" top={4} zIndex={1}>
        <Button onClick={() => setShape("square")}>Square</Button>
        <Button onClick={() => setShape("rectangle")}>Rectangle</Button>
        <Button onClick={() => setShape("circle")}>Circle</Button>
      </HStack>
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} style={{ border: "1px solid black" }} />
    </Container>
  );
};

export default Index;