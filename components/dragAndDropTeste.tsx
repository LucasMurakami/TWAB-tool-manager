'use client'

import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card, CardContent } from "@/components/ui/card"; // Adjust import based on your setup

const ItemType = {
  ITEM: "item",
};

interface DraggableItemProps {
  item: string;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, index, moveItem }) => {
  const [, ref] = useDrag({
    type: ItemType.ITEM,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType.ITEM,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => { ref(node); drop(node); }}>
      <Card className="mb-2 cursor-move">
        <CardContent>{item}</CardContent>
      </Card>
    </div>
  );
};

const DragAndDropList = () => {
  const [items, setItems] = React.useState(["Item 1", "Item 2", "Item 3", "Item 4"]);

  const moveItem = (fromIndex: number, toIndex: number) => {
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setItems(updatedItems);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        {items.map((item, index) => (
          <DraggableItem key={index} item={item} index={index} moveItem={moveItem} />
        ))}
      </div>
    </DndProvider>
  );
};

export default DragAndDropList;
