import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { Task, TaskCard } from "./taskCard";
import { cva } from "class-variance-authority";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { GripVertical } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

export type ColumnType = "Column";

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  isOverlay?: boolean;
}

export function BoardColumn({ column, tasks, isOverlay }: BoardColumnProps) {
    const tasksIds = useMemo(() => tasks.map((task) => task.ID), [tasks]);
  
    const {
      setNodeRef,
      attributes,
      listeners,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: column.id,
      data: useMemo(() => ({ type: "Column", column }), [column]),
    });
  
    const style = useMemo(
      () => ({
        transition,
        transform: CSS.Translate.toString(transform),
      }),
      [transition, transform]
    );
  
    const variants = useMemo(
      () =>
        cva("h-full w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center", {
          variants: {
            dragging: {
              default: "border-2 border-transparent",
              over: "ring-2 opacity-30",
              overlay: "ring-2 ring-primary",
            },
          },
        }),
      []
    );
  
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className={variants({
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        })}
      >
        <CardHeader className="space-between flex flex-row items-center border-b-2 p-4 text-left font-semibold">
          <Button
            variant={"ghost"}
            {...attributes}
            {...listeners}
            className="relative -ml-2 h-auto cursor-grab p-1 text-primary/50"
          >
            <span className="sr-only">{`Move column: ${column.title}`}</span>
            <GripVertical />
          </Button>
          <span className="ml-auto"> {column.title}</span>
          <span className="ml-auto"> {tasks.length}</span>
        </CardHeader>
        <ScrollArea className="max-h-[50vh] overflow-y-auto ">
          <CardContent className="grid grid-cols-1 gap-4 p-2 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <SortableContext items={tasksIds}>
              {tasks.map((task) => (
                <TaskCard key={task.ID} data={task} />
              ))}
            </SortableContext>
          </CardContent>
        </ScrollArea>
      </Card>
    );
  }
  
  

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });

  return (
    <ScrollArea
      className={variations({
        dragging: dndContext.active ? "active" : "default",
      })}
    >
      <div className="grid h-screen w-screen grid-cols-2 gap-4 sm:p-6 md:p-8 lg:p-10 2xl:p-12">
        {children}        
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
