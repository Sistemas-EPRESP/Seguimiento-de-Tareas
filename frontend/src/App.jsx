import "./App.css";
import Menu from "./layout/Menu";
import AppRouter from "./Router/AppRouter";

const App = () => {
  return (
    <div className="flex">
      <Menu />
      <div className="w-5/6 ml-[16.6667%]">
        <AppRouter />
      </div>
    </div>
  );
};

export default App;
