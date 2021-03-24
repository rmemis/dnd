import React, { useCallback, useState } from "react";
import { ITEM_TYPES } from "./constants";
import LeftPanel from "./LeftPanel";
import Stage from "./Stage";

const Builder = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      type: ITEM_TYPES.FORM
    },
    {
      id: 2,
      type: ITEM_TYPES.LINK
    },
    {
      id: 3,
      type: ITEM_TYPES.PARAGRAPH
    },
    {
      id: 4,
      type: ITEM_TYPES.DOCUMENT
    },
    {
      id: 5,
      type: ITEM_TYPES.IMAGE
    },
    {
      id: 6,
      type: ITEM_TYPES.HEADING
    }
  ]);

  const [isNewItemAdding, setNewItemAdding] = useState(false);

  const handleAddNewItem = useCallback(
    (type, hoveredIndex = items.length, shouldAddBelow = true) => {
      const startIndex = shouldAddBelow ? hoveredIndex + 1 : hoveredIndex;
      setItems([
        ...items.slice(0, startIndex),
        { id: items.length + 1, type: type },
        ...items.slice(startIndex)
      ]);
    },
    [items]
  );

  const MemoLeftPanel = useCallback(
    () => (
      <LeftPanel
        addNewItem={handleAddNewItem}
        onNewItemAdding={setNewItemAdding}
      />
    ),
    [handleAddNewItem]
  );

  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <MemoLeftPanel />
      <Stage
        items={items}
        setItems={setItems}
        addNewItem={handleAddNewItem}
        isNewItemAdding={isNewItemAdding}
        onNewItemAdding={setNewItemAdding}
      />
    </div>
  );
};

export default Builder;
