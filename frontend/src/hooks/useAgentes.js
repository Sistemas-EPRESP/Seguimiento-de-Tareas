import useApiGet from "./useApiGet";

/**
 *
 * @returns Todos los agentes del sistema.
 */
const useAgentes = () => {
  const {
    result: agentes,
    loading: loadingAgentes,
    error: errorAgentes,
  } = useApiGet(`/agentes`);
  return { agentes, loadingAgentes, errorAgentes };
};

export default useAgentes;
