import HomeIcon from "@mui/icons-material/Home";
import TaskIcon from "@mui/icons-material/Task";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

export function mapURItoIcon(to) {
  switch (to) {
    case "/":
      return <HomeIcon />;
    case "/crear-tarea":
      return <AddIcon />;
    case "/buscar":
      return <SearchIcon />;
    case "/mis-tareas":
      return <TaskIcon />;
    default:
      return <div></div>;
  }
}
