import { useEffect, useRef, useState } from "react";
import { Container, Button, HStack } from "@chakra-ui/react";

const Index = () => {
  const canvasRef = useRef(null);
  const [shape, setShape] = useState("square");

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const drawShape = (x, y) => {
      context.fillStyle = "blue";
      switch (shape) {
        case "square":
          context.fillRect(x, y, 50, 50);
          break;
        case "rectangle":
          context.fillRect(x, y, 100, 50);
          break;
        case "circle":
          context.beginPath();
          context.arc(x, y, 25, 0, 2 * Math.PI);
          context.fill();
          break;
        default:
          break;
      }
    };

    const handleCanvasClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      drawShape(x, y);
    };

    canvas.addEventListener("click", handleCanvasClick);

    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
    };
  }, [shape]);

  return (
    <Container centerContent maxW="container.xl" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <HStack spacing={4} mb={4}>
        <Button onClick={() => setShape("square")}>Square</Button>
        <Button onClick={() => setShape("rectangle")}>Rectangle</Button>
        <Button onClick={() => setShape("circle")}>Circle</Button>
      </HStack>
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} style={{ border: "1px solid black" }} />
    </Container>
  );
};

export default Index;