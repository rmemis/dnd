import React, { useCallback, useEffect, useMemo, useState } from "react";
import Item from "./Item";
import { ITEM_TYPES } from "./constants";
import update from "immutability-helper";
import { useDrop } from "react-dnd";
import isEqual from "lodash.isequal";

const Stage = ({ items, setItems, addNewItem, isNewItemAdding }) => {
  const [stageItems, setStageItems] = useState(items);
  const [selectedItemID, setSelectedItemID] = useState("");

  const [newAddingItemProps, setNewAddingItemProps] = useState({
    hoveredIndex: 0,
    shouldAddBelow: false
  });

  const { hoveredIndex, shouldAddBelow } = newAddingItemProps;

  const handleNewAddingItemPropsChange = useCallback(
    (updatedProps) => {
      setNewAddingItemProps({
        ...newAddingItemProps,
        ...updatedProps
      });
    },
    [setNewAddingItemProps]
  );

  useEffect(() => {
    if (!isEqual(stageItems, items)) {
      setStageItems(items);
    }
  }, [items]);

  const moveItem = useCallback(
    (dragIndex, hoverIndex) => {
      const dragItem = stageItems[dragIndex];
      setStageItems(
        update(stageItems, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragItem]
          ]
        })
      );
    },
    [stageItems, setStageItems]
  );

  const memoItems = useMemo(() => {
    return stageItems?.map((item, index) => {
      const { id, type } = item;
      return (
        <Item
          key={`id_${index}`}
          index={index}
          type={type}
          id={id}
          moveItem={moveItem}
          isNewItemAdding={isNewItemAdding}
          onClick={() => setSelectedItemID(id)}
          isSelected={selectedItemID === id}
          onNewAddingItemProps={handleNewAddingItemPropsChange}
        />
      );
    });
  }, [
    stageItems,
    moveItem,
    isNewItemAdding,
    selectedItemID,
    handleNewAddingItemPropsChange
  ]);

  const [{ isOver, draggingItemType }, dropRef] = useDrop({
    accept: Object.keys(ITEM_TYPES),
    drop: (droppedItem) => {
      const { type, id } = droppedItem;
      if (!id) {
        // a new item added
        addNewItem(type, hoveredIndex, shouldAddBelow);
      } else {
        // the result of sorting is applying the mock data
        setItems(stageItems);
      }
      console.log(
        "droppedItem: ",
        type,
        hoveredIndex,
        isNewItemAdding ? "new item added!" : ""
      );
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      draggingItemType: monitor.getItemType()
    })
  });

  useEffect(() => {
    if (isNewItemAdding) {
      const _stageItems = stageItems.filter(({ id }) => !!id);
      if (isOver && isNewItemAdding) {
        const startIndex = shouldAddBelow ? hoveredIndex + 1 : hoveredIndex;
        setStageItems([
          ..._stageItems.slice(0, startIndex),
          {
            type: draggingItemType
          },
          ..._stageItems.slice(startIndex)
        ]);
      } else {
        setStageItems(_stageItems);
      }
    }
  }, [isOver, draggingItemType, isNewItemAdding, shouldAddBelow, hoveredIndex]);

  return (
    <div
      ref={dropRef}
      style={{
        width: "400px",
        height: "auto",
        overflowY: "auto",
        padding: "10px",
        border: "1px solid silver"
      }}
    >
      {memoItems}
    </div>
  );
};

export default Stage;
