import useApiGet from "./useApiGet";

const useTareas = (idAgente) => {
  const { result, loading, error } = useApiGet("tareas/incompletas", {
    idAgente,
  });
  return { tareas: result, loadingTareas: loading, errorTareas: error };
};
export default useTareas;
