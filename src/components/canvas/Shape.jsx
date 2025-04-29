import React, { useRef, useEffect, useCallback } from "react";
import {
  Rect,
  Circle,
  Ellipse,
  Line,
  Text,
  Transformer,
  Image,
  Group,
} from "react-konva";
import { useImage } from "react-konva-utils";

const Shape = React.memo(({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  const { componentType, ...konvaProps } = shapeProps;

  // Configuramos el transformer cuando el nodo está seleccionado y montado
  // En Shape.jsx
  useEffect(() => {
    if (isSelected && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Y en el return:
  {
    isSelected && (
      <Transformer
        ref={trRef}
        boundBoxFunc={(oldBox, newBox) => {
          // Mantener un tamaño mínimo
          return newBox.width < 5 || newBox.height < 5 ? oldBox : newBox;
        }}
      />
    );
  }
  const handleDragEnd = useCallback(
    (e) => {
      onChange({
        ...shapeProps,
        x: e.target.x(),
        y: e.target.y(),
      });
    },
    [shapeProps, onChange]
  );

  const handleTransformEnd = useCallback(() => {
    const node = shapeRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    const baseUpdates = {
      ...shapeProps,
      rotation: node.rotation(),
      x: node.x(),
      y: node.y(),
    };

    const typeHandlers = {
      rectangle: () => ({
        ...baseUpdates,
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
      }),
      circle: () => ({
        ...baseUpdates,
        radius: Math.max(5, (node.radius() * (scaleX + scaleY)) / 2),
      }),
      ellipse: () => ({
        ...baseUpdates,
        radiusX: Math.max(5, node.radiusX() * scaleX),
        radiusY: Math.max(5, node.radiusY() * scaleY),
      }),
      line: () => {
        const points = node.points().reduce((acc, val, i) => {
          return i % 2 === 0 ? [...acc, val * scaleX] : [...acc, val * scaleY];
        }, []);
        return { ...baseUpdates, points };
      },
      text: () => ({
        ...baseUpdates,
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
      }),
    };

    onChange(typeHandlers[shapeProps.type]?.() || baseUpdates);
  }, [shapeProps, onChange]);

  const handleTextEdit = useCallback(() => {
    if (shapeProps.type !== "text") return;

    const newText = prompt("Editar texto:", shapeProps.text);
    if (newText !== null) {
      onChange({ ...shapeProps, text: newText });
    }
  }, [shapeProps, onChange]);

  const commonProps = {
    ref: shapeRef,
    draggable: shapeProps.draggable !== false,
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
    onDblClick: shapeProps.type === "text" ? handleTextEdit : undefined,
    ...konvaProps,
  };

  const renderWebComponent = () => {
    if (componentType) {
      switch (componentType) {
        case "button":
          return (
            <Group>
              <Rect
                {...commonProps}
                fill={shapeProps.fill || "#4f46e5"}
                cornerRadius={shapeProps.cornerRadius || 8}
              />
              <Text
                text={shapeProps.text || "Button"}
                x={shapeProps.x}
                y={
                  shapeProps.y +
                  shapeProps.height / 2 -
                  (shapeProps.fontSize || 14) / 2
                }
                width={shapeProps.width}
                align="center"
                fontSize={shapeProps.fontSize || 14}
                fontFamily={shapeProps.fontFamily || "Arial"}
                fill={shapeProps.fontColor || "white"}
                perfectDrawEnabled={false}
                listening={false}
              />
            </Group>
          );
        case "card":
          return (
            <Group>
              <Rect
                {...commonProps}
                fill={shapeProps.fill || "white"}
                cornerRadius={shapeProps.cornerRadius || 12}
                shadowColor={shapeProps.shadowColor || "black"}
                shadowBlur={shapeProps.shadowBlur || 15}
                shadowOpacity={shapeProps.shadowOpacity || 0.1}
              />
              {shapeProps.text && (
                <Text
                  text={shapeProps.text}
                  x={shapeProps.x + 10}
                  y={shapeProps.y + 10}
                  width={shapeProps.width - 20}
                  fontSize={shapeProps.fontSize || 14}
                  fontFamily={shapeProps.fontFamily || "Arial"}
                  fill={shapeProps.fontColor || "#374151"}
                  perfectDrawEnabled={false}
                  listening={false}
                />
              )}
            </Group>
          );
        case "input":
          return (
            <Group>
              <Rect
                {...commonProps}
                fill={shapeProps.fill || "white"}
                cornerRadius={shapeProps.cornerRadius || 6}
                stroke={shapeProps.stroke || "#d1d5db"}
                strokeWidth={shapeProps.strokeWidth || 1}
              />
              <Text
                text={shapeProps.text || ""}
                x={shapeProps.x + 8}
                y={
                  shapeProps.y +
                  shapeProps.height / 2 -
                  (shapeProps.fontSize || 14) / 2
                }
                width={shapeProps.width - 16}
                fontSize={shapeProps.fontSize || 14}
                fontFamily={shapeProps.fontFamily || "Arial"}
                fill={shapeProps.fontColor || "#374151"}
                perfectDrawEnabled={false}
                listening={false}
              />
            </Group>
          );
        default:
          return null;
      }
    }
    return null;
  };

  const shapeComponents = {
    rectangle: <Rect {...commonProps} />,
    circle: <Circle {...commonProps} />,
    ellipse: <Ellipse {...commonProps} />,
    line: (
      <Line
        {...commonProps}
        stroke={shapeProps.stroke || "#000"}
        strokeWidth={shapeProps.strokeWidth || 2}
      />
    ),
    text: (
      <Text
        {...commonProps}
        fontSize={shapeProps.fontSize || 16}
        fontFamily={shapeProps.fontFamily || "Arial"}
        fill={shapeProps.fill || "#000000"}
        align={shapeProps.textAlign || "left"}
        fontStyle={shapeProps.fontStyle || "normal"}
        textDecoration={shapeProps.textDecoration || "none"}
      />
    ),
    image: <ImageComponent src={shapeProps.src} {...commonProps} />,
  };

  return (
    <>
      {renderWebComponent() || shapeComponents[shapeProps.type] || (
        <Rect {...commonProps} />
      )}
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) =>
            newBox.width < 5 || newBox.height < 5 ? oldBox : newBox
          }
          enabledAnchors={
            shapeProps.type === "line"
              ? ["middle-left", "middle-right"]
              : undefined
          }
        />
      )}
    </>
  );
});

const ImageComponent = React.memo(({ src, ...props }) => {
  const [image] = useImage(src || "", "anonymous");
  return <Image image={image} {...props} />;
});

export default Shape;
