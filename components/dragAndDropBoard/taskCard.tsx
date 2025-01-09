import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { GripVertical } from "lucide-react";
import { Badge } from "../ui/badge";
import { columnId } from "./kanbanBoard";

export interface Task {
  Effect: string;
  Description: string;
  "Mechanic Description": string;
  Modifier: string;
  Scaling: string;
  Unlocked: string;
  ID: UniqueIdentifier;
  ColumnId: columnId;
  OriginColumnId: string;
}

interface TaskCardProps {
  data: Task;
  isOverlay?: boolean;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ data, isOverlay }: TaskCardProps) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
      } = useSortable({
        id: data.ID,
        data: {
          type: "Task", // Use the correct type here
          task: data, // Pass the task data
        },
      });
      

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="space-between relative flex flex-row border-b-2 border-secondary p-3">
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className="-ml-2 h-auto cursor-grab p-1 text-secondary-foreground/50"
        >
          <span className="sr-only">Move effect</span>
          <GripVertical />
        </Button>
        <Badge
          variant={data.Unlocked === "True" ? "default" : "outline"}
          className="ml-auto font-semibold"
        >
          {data.Unlocked === "True" ? "Unlocked" : "Locked"}
        </Badge>
      </CardHeader>
      <CardContent className="whitespace-pre-wrap px-3 pb-6 pt-3 text-left">
        <h3 className="text-lg font-bold">{data.Effect}</h3>
        <p className="text-sm">{data.Description}</p>
        <p className="mt-2 text-xs">{data["Mechanic Description"]}</p>
        <div className="mt-4 flex space-x-4 text-sm">
          <div>
            <span className="font-bold">Modifier:</span> {data.Modifier}
          </div>
          <div>
            <span className="font-bold">Scaling:</span> {data.Scaling}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
