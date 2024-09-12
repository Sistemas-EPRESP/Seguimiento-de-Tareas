import Task from "./Task";

export default function Component({ tasks }) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
}
