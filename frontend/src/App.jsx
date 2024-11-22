import "./App.css";
import Container from "./layout/Container";
import Menu from "./layout/Menu";
import AppRouter from "./Router/AppRouter";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Loading from "./layout/Loading"; // Importa tu componente loading

const App = () => {
  const { usuario, loading } = useContext(AuthContext);

  // Mostrar el modal de carga mientras se verifica el estado del usuario
  if (loading) {
    return <Loading />; // Usa el componente loading en lugar de solo "Cargando..."
  }

  return (
    <div className="flex">
      {usuario && <Menu />}
      <Container hasMenu={!!usuario}>
        <AppRouter />
      </Container>
    </div>
  );
};

export default App;
