import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ITEM_TYPES } from "./constants";

const Item = ({
  type,
  id,
  index,
  moveItem,
  isNewItemAdding,
  isSelected,
  onClick,
  onNewAddingItemProps
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
      if (!itemRef.current && !itemRef.current?.getBoundingClientRect) {
        return;
      }

      const { top, bottom, height } = itemRef.current.getBoundingClientRect();
      const { y } = monitor.getClientOffset();
      const hoverIndex = index;
      const dragIndex = item.index;

      if (!isNewItemAdding) {
        if (dragIndex === hoverIndex) {
          return;
        }
        const hoverMiddleY = (bottom - top) / 2;
        const hoverClientY = y - top;
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
        onNewAddingItemProps({ hoveredIndex: hoverIndex });
        moveItem(dragIndex, hoverIndex);
        item.index = hoverIndex;
      } else {
        const belowThreshold = (bottom - top) / 2;
        const itemClientY = y - top;
        const newShould = itemClientY >= belowThreshold;
        onNewAddingItemProps({
          hoveredIndex: hoverIndex,
          shouldAddBelow: newShould
        });
      }
    }
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: type, id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  drag(drop(itemRef));

  const border = isSelected ? "3px dashed blue" : "1px solid silver";
  const opacity = isNewItemAdding && !id ? "0.3" : "1";

  return (
    <div
      data-handler-id={handlerId}
      ref={itemRef}
      style={{
        padding: "10px",
        margin: "10px",
        border,
        opacity
      }}
      onClick={onClick}
    >
      {type}
    </div>
  );
};

export default Item;
