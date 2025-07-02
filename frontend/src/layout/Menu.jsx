import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Loading from "../layout/Loading";
import Logo512 from "../img/Logo512.svg";
import menuItems from "./menuItems.json";
import MenuItemSet from "./MenuItemSet";
import CerrarSesion from "../components/CerrarSesion";

const Menu = () => {
  const { usuario } = useContext(AuthContext);
  const [cargando, setCargando] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Menú lateral */}
      <div
        ref={menuRef}
        className={`h-screen bg-gray-800 text-white p-4 flex fixed flex-col overflow-y-auto custom-scrollbar transition-transform md:translate-x-0 
        ${
          isOpen ? "translate-x-0 w-52 z-40" : "-translate-x-full w-64 md:z-40 "
        } md:w-1/6 -mr-[260px] md:mr-0`}
      >
        <div>
          <div className="flex flex-col items-center mt-2 mb-3">
            <div className="bg-gray-700 rounded-full flex justify-center items-center h-[130px] w-5/6 max-w-[150px] md:h-[160px]">
              <img
                src={Logo512}
                className="h-[130px] pr-4 md:h-[180px]"
                alt="Logo"
              />
            </div>
          </div>
          <Loading isVisible={cargando} />

          {usuario?.rol === "Administrador" ? (
            <MenuItemSet
              menuItems={menuItems}
              adminMode
              onClick={() => setIsOpen(false)}
            />
          ) : (
            <MenuItemSet
              menuItems={menuItems}
              onClick={() => setIsOpen(false)}
            />
          )}
        </div>
        <CerrarSesion setCargando={setCargando} />
      </div>
    </>
  );
};

export default Menu;
