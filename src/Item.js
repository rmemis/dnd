import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ITEM_TYPES } from "./constants";

const Item = ({
  type,
  id,
  index,
  moveItem,
  isNewItemAdding,
  onNewAddingItemProps
}) => {
  const itemRef = useRef(null);

  //! Portal :: useDrop hook for builderItem
  // TODO :: refactor and split here while adding portal
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

      //! Position arrangement for item sorting and adding
      const { top, bottom, height } = itemRef.current.getBoundingClientRect();
      const { y } = monitor.getClientOffset();
      const hoverIndex = index;
      const dragIndex = item.index;

      const hoverMiddleY = (bottom - top) / 2;
      const hoverClientY = y - top;

      //! Portal :: compare id and tempID in here
      if (!id || (dragIndex === hoverIndex)) {
        return;
      }
      if (!isNewItemAdding) {
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
        const newShould = y - top >= belowThreshold;
        onNewAddingItemProps({
          hoveredIndex: hoverIndex,
          shouldAddBelow: newShould
        });
      }
    }
  });

  //! Portal :: isDragging prop. might be use for styling changes in dnd process or something like that purposes
  const [{ isDragging }, drag] = useDrag({
    item: { type: type, id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  //! Portal :: trigger the item as dnd object
  drag(drop(itemRef));

  const opacity = isNewItemAdding && !id ? "0.3" : "1";

  return (
    <div
      data-handler-id={handlerId}
      ref={itemRef}
      style={{
        padding: "10px",
        margin: "10px",
        opacity,
        border: "1px solid silver"
      }}
    >
      {type}
    </div>
  );
};

export default Item;
