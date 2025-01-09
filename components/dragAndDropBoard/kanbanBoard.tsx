'use client';

// Import necessary hooks, components, and utilities
import { useMemo, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { BoardColumn, BoardContainer } from "./boardColumn";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  Announcements,
  UniqueIdentifier,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { type Task, TaskCard } from "./taskCard";
import type { Column } from "./boardColumn";
import { hasDraggableData } from "./utils";
import { coordinateGetter } from "./multipleContainersKeyboardPreset";

// Define default column structure
const defaultCols = [
  { id: "Skills-Modifiers", title: "Skills Modifiers" },
  { id: "Skill-Deck", title: "Skill Deck" },
  { id: "Player-Modifiers", title: "Player Modifiers" },
  { id: "Skill-Result", title: "Skill Result" },
] satisfies Column[];

export type columnId = (typeof defaultCols)[number]["id"];

// KanbanBoard component
export function KanbanBoard() {
  // State management for columns, tasks, and active drag items
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const pickedUpTaskColumn = useRef<columnId | null>(null); // Tracks the column a task is dragged from
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]); // Memoize column IDs for performance

  const [tasks, setTasks] = useState<Task[]>([]); // List of tasks
  const [activeColumn, setActiveColumn] = useState<Column | null>(null); // Active column being dragged
  const [activeTask, setActiveTask] = useState<Task | null>(null); // Active task being dragged
  const [isClient, setIsClient] = useState(false); // Tracks if the component is client-rendered

  // Define the base path for fetching data
  const PATH = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_PROD_PATH || ''
    : process.env.DEV_PATH || '';

  // Ensure `isClient` is true after mounting (for `createPortal` compatibility)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch task data from the server and set the tasks state
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${PATH}/json/Skills_Modifier.json`);
        const jsonData = await response.json();
        const newTasks = jsonData.data.map((item: any) => ({
          ID: item.ID,
          Effect: item.Effect,
          Description: item.Description,
          "Mechanic Description": item["Mechanic Description"],
          Modifier: item.Modifier,
          Scaling: item.Scaling,
          Unlocked: item.Unlocked,
          ColumnId: "Skills-Modifiers", // Default column for new tasks
          OriginColumnId: "Skills-Modifiers",
        }));
        // Update tasks only if the fetched data is different
        setTasks((prevTasks) =>
          JSON.stringify(prevTasks) === JSON.stringify(newTasks) ? prevTasks : newTasks
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  // Define sensors for drag-and-drop interactions
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    })
  );

  // Accessibility announcements for drag-and-drop actions
  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      const data = active.data.current;
      if (data?.type === "Column") {
        return `Picked up column: ${data.column.title}`;
      } else if (data?.type === "Task") {
        return `Picked up task: ${data.task.Description}`;
      }
    },
    onDragOver({ active, over }) {
      if (!over || !hasDraggableData(active) || !hasDraggableData(over)) {
        return;
      }
      const overData = over.data.current;
      if (overData?.type === "Column") {
        return `Dragging over column: ${overData.column.title}`;
      } else if (overData?.type === "Task") {
        return `Dragging over task: ${overData.task.Description}`;
      }
    },
    onDragEnd({ active, over }) {
      if (!over || !hasDraggableData(active)) {
        return `Drag action canceled.`;
      }
      const overData = over.data.current;
      if (overData?.type === "Column") {
        return `Dropped in column: ${overData.column.title}`;
      } else if (overData?.type === "Task") {
        return `Dropped on task: ${overData.task.Description}`;
      }
    },
    onDragCancel() {
      return `Drag action was canceled.`;
    },
  };

  // Handles drag start events
  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === "Column") {
      setActiveColumn(data.column); // Set the active column
      // console.log('Active column set:', data.column);
    } else if (data?.type === "Task") {
      setActiveTask(data.task); // Set the active task
      // console.log('Active task set:', data.task);
    }
  }

  // Handles drag over events
  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;

    // console.log('Drag over event triggered.');
    // console.log('Active element:', active);
    // console.log('Over element:', over);

    if (!over || !hasDraggableData(active) || !hasDraggableData(over)) {
      // console.log('Invalid drag over event, exiting.');
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    // console.log('Active data:', activeData);
    // console.log('Over data:', overData);

    // If a task is dragged over a column, update the task's column ID
    if (activeData?.type === "Task" && overData?.type === "Column") {
      setTasks((prev) => {
        const updatedTasks = [...prev];
        const taskIndex = updatedTasks.findIndex((t) => t.ID === active.id);

        // console.log('Task index:', taskIndex);

        if (taskIndex !== -1) {
          updatedTasks[taskIndex].ColumnId = String(overData.column.id);
          // console.log(`Updated task's ColumnId to ${overData.column.id}`);
        } else {
          // console.log('Task not found in the list.');
        }

        return updatedTasks;
      });
    } else if (activeData?.type === "Task" && overData?.type === "Task" && activeData?.task.ColumnId !== overData.task.ColumnId) {
      setTasks((prev) => {
        const updatedTasks = [...prev];
        const taskIndex = updatedTasks.findIndex((t) => t.ID === active.id);

        // console.log('Task index:', taskIndex);

        if (taskIndex !== -1) {
          updatedTasks[taskIndex].ColumnId = String(overData.task.ColumnId);
          // console.log(`Updated task's ColumnId to ${overData.task.ColumnId}`);
        } else {
          // console.log('Task not found in the list.');
        }
        return updatedTasks;
      });
    }
    // else {
    //   console.log('Drag event does not involve a task over a column.');
    // }
  }

  // Handles the end of a drag event
  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null); // Reset the active column
    // console.log('Active column reset');
    setActiveTask(null); // Reset the active task
    // console.log('Active task reset');
    const { active, over } = event;

    // console.log('Drag end event triggered');
    // console.log('Active element:', active);
    // console.log('Over element:', over);

    // If there's no element being dragged over or the active element has no draggable data, exit the function
    if (!over || !hasDraggableData(active)) {
      // console.log('Invalid drag end event, exiting.');
      return;
    }

    const activeData = active.data.current; // Data of the active (dragged) element
    const overData = over.data.current; // Data of the element being dragged over

    // console.log('Active data:', activeData);
    // console.log('Over data:', overData);

    // Handle column reordering
    if (activeData?.type === "Column" && overData?.type === "Column") {
      // console.log('Reordering columns');
      setColumns((prev) => {
        const activeIdx = prev.findIndex((col) => col.id === active.id); // Index of the active column
        const overIdx = prev.findIndex((col) => col.id === over.id); // Index of the column being dragged over
        // console.log('Active column index:', activeIdx);
        // console.log('Over column index:', overIdx);
        const reorderedColumns = arrayMove(prev, activeIdx, overIdx); // Reorder the columns
        // console.log('Reordered columns:', reorderedColumns);
        return reorderedColumns;
      });
    }
    // Handle task movement between columns
    else if (activeData?.type === "Task" && overData?.type === "Column") {
      // console.log('Moving task to a new column');
      setTasks((prev) => {
        const updatedTasks = [...prev]; // Create a copy of the current tasks array
        const taskIndex = updatedTasks.findIndex((t) => t.ID === active.id); // Find the index of the active task
        // console.log('Active task index:', taskIndex);
        if (taskIndex !== -1) {
          updatedTasks[taskIndex].ColumnId = overData.column.id; // Update the task's column ID
          // console.log(`Updated task's ColumnId to ${overData.column.id}`);
        } else {
          // console.log('Task not found in the list.');
        }
        // console.log('Updated tasks:', updatedTasks);
        return updatedTasks; // Return the updated tasks array
      });
    } else if (activeData?.type === "Task" && overData?.type === "Task") {
      // console.log('Moving task within the same column');
      setTasks((prev) => {
        // Create a copy of the current tasks array
        const updatedTasks = [...prev];
    
        // Find the index of the active task and the target task
        const activeTaskIndex = updatedTasks.findIndex((t) => t.ID === active.id);
        const overTaskIndex = updatedTasks.findIndex((t) => t.ID === over.id);
    
        // console.log('Active task index:', activeTaskIndex, 'Over task index:', overTaskIndex);
    
        // Ensure both tasks are found and in the same column
        if (
          activeTaskIndex !== -1 &&
          overTaskIndex !== -1 &&
          updatedTasks[activeTaskIndex].ColumnId === updatedTasks[overTaskIndex].ColumnId
        ) {
          // Move the active task to the new position within the same column
          const [movedTask] = updatedTasks.splice(activeTaskIndex, 1); // Remove the active task
          updatedTasks.splice(overTaskIndex, 0, movedTask); // Insert it at the new index
          // console.log('Task moved within the column:', movedTask);
        } else {
          // console.log('Tasks not in the same column or not found.');
        }
    
        // console.log('Updated tasks:', updatedTasks);
        return updatedTasks; // Return the updated tasks array
      });
    } 
    // else {
    //   console.log('Drag event does not involve column reordering or task movement.');
    // } 
  }

  // Render the Kanban board
  return (
    <DndContext
      accessibility={{ announcements }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <BoardContainer>
        {/* Render columns within a sortable context */}
        <SortableContext items={columnsId}>
          {columns.map((col) => (
            <BoardColumn
              key={col.id}
              column={col}
              tasks={tasks.filter((task) => task.ColumnId === col.id)}
            />
          ))}
        </SortableContext>
      </BoardContainer>

      {/* Render drag overlay when dragging */}
      {isClient &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                tasks={tasks.filter((task) => task.ColumnId === activeColumn.id)}
              />
            )}
            {activeTask && <TaskCard data={activeTask} isOverlay />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}
