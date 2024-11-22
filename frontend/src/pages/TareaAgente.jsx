import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import config from "../api/config";
import Loading from "../layout/Loading";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RevisionesAgente from "../components/RevisionesAgente";
import ModalInformativo from "../layout/ModalInformativo";

export const TareaAgente = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [tarea, setTarea] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [modalInfo, setModalInfo] = useState({
    tipo: "",
    titulo: "",
    mensaje: "",
  });
  const [modalVisible, setModalVisible] = useState(false); // Controla la visibilidad del modal

  const priorityColor = {
    Alta: "bg-[#EF4444] text-white",
    Media: "bg-[#F59E0B] text-black",
    Baja: "bg-[#10B981] text-white",
    Periódica: "bg-[#3B82F6] text-white",
  };

  const statusColor = {
    "Sin comenzar": "bg-[#64748B] text-white",
    Curso: "bg-green-500 text-white",
    Revisión: "bg-[#F59E0B] text-black",
    Bloqueado: "bg-red-100 text-red-800",
    Finalizado: "bg-[#10B981] text-white",
  };

  const fetchTareaData = useCallback(async () => {
    setCargando(true);
    try {
      const { data } = await axios.get(`${config.apiUrl}/tareas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTarea(data);
    } catch (error) {
      console.error("Error al obtener los detalles de la tarea", error);
    } finally {
      setCargando(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchTareaData();
  }, [fetchTareaData]);

  const finalizarTarea = async () => {
    // setCargando(true);
    // if (tarea.estado === "Sin comenzar") {
    //   const estado = { estado: "Curso" };
    //   try {
    //     const { data } = await axios.put(
    //       `${config.apiUrl}/tareas/${id}/cambiarEstado`,
    //       estado,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       }
    //     );
    //     console.log(data);
    //     // Actualiza el estado de la tarea directamente con la respuesta
    //     setTarea((prevTarea) => ({
    //       ...prevTarea,
    //       estado: data.tarea.estado,
    //     }));
    //     setModalInfo({
    //       tipo: "Exito",
    //       titulo: "Operación exitosa",
    //       mensaje: "Haz comenzado la tarea!",
    //     });
    //   } catch (error) {
    //     console.error(error);
    //   } finally {
    //     setCargando(false);
    //     setModalVisible(true);
    //   }
    // } else {
    //   setCargando(false);
    //   setModalVisible(true);
    //   setModalInfo({
    //     tipo: "Error",
    //     titulo: "Operación fallida",
    //     mensaje: "No se pudo realizar esta acción!",
    //   });
    // }
  };

  const comenzarTarea = async () => {
    setCargando(true);
    if (tarea.estado === "Sin comenzar") {
      const estado = { estado: "Curso" };
      try {
        const { data } = await axios.put(
          `${config.apiUrl}/tareas/${id}/cambiarEstado`,
          estado,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(data);

        // Actualiza el estado de la tarea directamente con la respuesta
        setTarea((prevTarea) => ({
          ...prevTarea,
          estado: data.tarea.estado,
        }));
        setModalInfo({
          tipo: "Exito",
          titulo: "Operación exitosa",
          mensaje: "Haz comenzado la tarea!",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
        setModalVisible(true);
      }
    } else {
      setCargando(false);
      setModalVisible(true);
      setModalInfo({
        tipo: "Error",
        titulo: "Operación fallida",
        mensaje: "No se pudo realizar esta acción!",
      });
    }
  };

  const handleCorreccionesEnviadas = () => {
    fetchTareaData();
  };

  if (cargando || !tarea) {
    return <Loading />;
  }

  return (
    <div className="flex gap-6 max-h-[350px]">
      <div
        id="Datos basicos"
        className="flex flex-col justify-between w-3/4 h-[350px] gap-4 bg-gray-800 text-gray-100 rounded-lg p-6"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-semibold">{tarea.nombre}</h1>
            <div className="flex items-start gap-2">
              <span
                className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  priorityColor[tarea.prioridad]
                }`}
              >
                {tarea.prioridad}
              </span>
              <span
                className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  statusColor[tarea.estado]
                }`}
              >
                {tarea.estado}
              </span>
            </div>
          </div>
          <div className="text-gray-300 max-h-24 overflow-y-auto">
            {tarea.descripcion ? (
              <p>{tarea.descripcion}</p>
            ) : (
              <p className="text-gray-400 italic">No hay descripción.</p>
            )}
          </div>
          <span className="flex items-center gap-2">
            <CalendarTodayIcon style={{ width: "20px" }} />
            <label>Asignada:</label>
            <span className="">
              {tarea.fecha_inicio
                ? format(
                    new Date(tarea.fecha_inicio),
                    "EEEE, d 'de' MMMM 'de' yyyy",
                    {
                      locale: es,
                    }
                  )
                : "Fecha no disponible"}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <CalendarTodayIcon style={{ width: "20px" }} />
            <label>Fecha de entrega:</label>
            <span className="">
              {tarea.fecha_de_entrega
                ? format(
                    new Date(tarea.fecha_de_entrega),
                    "EEEE, d 'de' MMMM 'de' yyyy",
                    {
                      locale: es,
                    }
                  )
                : "Fecha no disponible"}
            </span>
          </span>
        </div>
        <div className="flex justify-between">
          <button
            onClick={comenzarTarea}
            className="flex justify-center items-center py-2 px-6 gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white"
          >
            <PlayCircleOutlineIcon style={{ width: "20px", height: "20px" }} />
            <span className="">Comenzar</span>
          </button>

          <button
            onClick={finalizarTarea}
            className="flex justify-center items-center py-2 px-6 gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
          >
            <CheckCircleOutlineIcon style={{ width: "20px", height: "20px" }} />
            <span className="">Finalizar</span>
          </button>
        </div>
      </div>
      <RevisionesAgente
        tareaId={id}
        revisiones={tarea.Revisions}
        onCorreccionesEnviadas={handleCorreccionesEnviadas}
      />
      {modalVisible && (
        <ModalInformativo
          modalInfo={modalInfo}
          onClose={() => setModalVisible(false)} // Pasar la función de cierre
        />
      )}
    </div>
  );
};
