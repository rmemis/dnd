import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ITEM_TYPES } from "./constants";

const Item = ({
  type,
  id,
  index,
  moveItem,
  isNewItemAdding,
  onHoveredIndex,
  onShouldAddBelow,
  isSelected,
  onClick
}) => {
  const itemRef = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: Object.keys(ITEM_TYPES),
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },
    hover(item, monitor) {
      // very dirty!!!
      // refactor

      if (!isNewItemAdding) {
        if (!itemRef.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = index;
        if (!isNewItemAdding && dragIndex === hoverIndex) {
          return;
        }
        const hoverBoundingRect = itemRef.current?.getBoundingClientRect();
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
        moveItem(dragIndex, hoverIndex);
        item.index = hoverIndex;
      } else {
        if (!itemRef.current) {
          return;
        }
        const hoverIndex = index;
        onHoveredIndex(hoverIndex);
        const { y } = monitor.getClientOffset();
        const { top, height } = itemRef.current.getBoundingClientRect();
        const belowThreshold = top + height / 2;
        const newShould = y >= belowThreshold;
        onShouldAddBelow(newShould);
      }
    }
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: type, id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });
  const opacity = isDragging ? 0.3 : 1;
  const border = isSelected ? "3px dashed blue" : "1px solid silver";
  drag(drop(itemRef));
  return (
    <div
      data-handler-id={handlerId}
      ref={itemRef}
      style={{
        padding: "10px",
        margin: "10px",
        opacity,
        border
      }}
      onClick={onClick}
    >
      {type}
    </div>
  );
};

export default Item;
