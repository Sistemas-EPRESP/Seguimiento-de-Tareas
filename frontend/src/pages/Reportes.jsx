import { useEffect, useState } from "react";
import Loading from "../layout/Loading";
import axios from "axios";
import config from "../api/config.js"; // Importa la configuración de la API
import { useFormik } from "formik";
import * as Yup from "yup";
import ReportesCard from "../components/ReportesCard";

export default function Reportes() {
  const [agentes, setAgentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportes, setReportes] = useState(null);
  const [vencimientos, setVencimientos] = useState(null);

  const obtenerAgentes = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No hay token disponible");
      return;
    }

    try {
      const { data } = await axios.get(`${config.apiUrl}/agentes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAgentes(data); // Guardamos los agentes en el state
    } catch (error) {
      console.error("Error al obtener los agentes", error);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      agenteSeleccionado: "",
      periodoSeleccionado: "",
    },
    validationSchema: Yup.object({
      periodoSeleccionado: Yup.string().required("Debe seleccionar un período"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No hay token disponible");
        return;
      }

      try {
        const { data } = await axios.get(`${config.apiUrl}/reportes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            agente: values.agenteSeleccionado || "todos",
            periodo: values.periodoSeleccionado,
          },
        });
        const response = await axios.get(
          `${config.apiUrl}/reportes/vencimientos`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              agente: values.agenteSeleccionado || "todos",
              periodo: values.periodoSeleccionado,
            },
          }
        );
        console.log(data);
        console.log(response);

        setReportes(data); // Guardamos las tareas en el state
        //setVencimientos(response.data)
      } catch (error) {
        console.error("Error al generar el reporte", error);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    obtenerAgentes(); // Llamamos a la función para obtener los agentes
  }, []);
  return (
    <div className="container mx-auto px-1">
      <h1 className="text-3xl font-semibold mb-4">Reportes</h1>
      <form onSubmit={formik.handleSubmit} className="flex items-center gap-2">
        <select
          id="agente"
          name="agenteSeleccionado"
          value={formik.values.agenteSeleccionado}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="px-3 py-1 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
        >
          <option value="">Seleccione un agente</option>
          {agentes.map((agente) => (
            <option key={agente.id} value={agente.id}>
              {agente.nombre} {agente.apellido}
            </option>
          ))}
        </select>
        <select
          id="periodo"
          name="periodoSeleccionado"
          value={formik.values.periodoSeleccionado}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="px-3 py-1 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
        >
          <option value="">Seleccione un período</option>
          <option value="semanal">Semana anterior</option>
          <option value="mensual">Mes anterior</option>
          <option value="anual">Año anterior</option>
        </select>
        <button
          type="submit"
          className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Generar Reporte
        </button>
      </form>
      {formik.touched.agenteSeleccionado && formik.errors.agenteSeleccionado ? (
        <div className="text-red-500 mt-2">
          {formik.errors.agenteSeleccionado}
        </div>
      ) : null}
      {formik.touched.periodoSeleccionado &&
      formik.errors.periodoSeleccionado ? (
        <div className="text-red-500 mt-2">
          {formik.errors.periodoSeleccionado}
        </div>
      ) : null}
      <Loading isVisible={loading} />
      {/* {reportes && <ReportesCard reportes={reportes} />} */}
    </div>
  );
}
