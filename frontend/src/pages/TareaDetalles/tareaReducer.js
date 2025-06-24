import { api } from "../../api/api";

export default async function tareaReducer(state, action) {
  switch (action.type) {
    case "delete": {
      await api.delete(`tareas/${action.idTarea}`);
      return tareas.filter((t) => t.id !== action.idTarea);
    }
  }
}
