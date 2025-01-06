import DragDropV3 from "@/components/dragAndDropSkillsModifiers";
import TableSkillsModifiers from "@/components/table-skills-modifiers";

export default function skillModifiers() {
  return (
    <div>
      <h1 className="mt-4 text-center"> Skills Modifiers</h1>
      {/* <DragDropV3 /> */}
      <TableSkillsModifiers />
    </div>
  );
}
