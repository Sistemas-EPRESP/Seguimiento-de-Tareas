export default function ReportesCard({ reportes, vencimientos }) {
  const categoriasCorrecciones =
    reportes.length > 0 ? Object.keys(reportes[0].Correcciones) : [];

  return (
    <div className="">
      {/* Total de tareas */}
      <div className="flex gap-4 mt-4">
        <div className="w-1/4 bg-gray-800 p-4 shadow-md rounded-lg">
          <h4 className="text-lg font-semibold text-gray-300">
            Total de Tareas
          </h4>
          <p className="text-xl font-bold text-white">{reportes.length}</p>
        </div>

        {/* Tareas por Estado */}
        <div className="w-1/4 bg-gray-800 p-4 shadow-md rounded-lg">
          <h4 className="text-lg font-semibold text-gray-300">
            Tareas por Estado
          </h4>
          <div className="flex justify-between mt-2">
            <p className="text-gray-300">En progreso:</p>
            <p className="font-semibold text-white">
              {vencimientos.tareasActivas.length}
            </p>
          </div>
          <div className="flex justify-between mt-1">
            <p className="text-gray-300">Completadas:</p>
            <p className="font-semibold text-white">
              {vencimientos.tareasCompletadas.length}
            </p>
          </div>
        </div>

        {/* Entregas Incompletas */}
        <div className="w-1/4 bg-gray-800 p-4 shadow-md rounded-lg">
          <h4 className="text-lg font-semibold text-gray-300">
            Tareas vencidas
          </h4>
          <p className="text-2xl font-bold text-white">
            {vencimientos.tareasVencidas.length}
          </p>
        </div>

        <div className="w-1/4 bg-gray-800 p-4 shadow-md rounded-lg">
          <h4 className="text-lg font-semibold text-gray-300">
            Tareas futuras
          </h4>
          <p className="text-2xl font-bold text-white">
            {vencimientos.tareasFuturas.length}
          </p>
        </div>
      </div>

      {/* Tabla de Correcciones */}
      <div className="col-span-14 mt-6">
        <h3 className="text-xl font-semibold text-gray-300 mb-4">
          Correcciones
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-800 rounded-lg border border-gray-700">
            <thead className="bg-gray-700">
              <tr className="text-left">
                <th className="p-3 border-b border-gray-600 text-gray-300">
                  Tarea
                </th>
                {categoriasCorrecciones.map((categoria, index) => (
                  <th
                    key={index}
                    className="p-3 border-b border-gray-600 text-gray-300 text-center"
                  >
                    {categoria}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportes.map((tarea) => (
                <tr
                  key={tarea.id}
                  className="text-center border-t border-gray-700"
                >
                  <td className="p-3 font-semibold text-gray-300">
                    {tarea.nombre}
                  </td>
                  {categoriasCorrecciones.map((categoria, index) => (
                    <td key={index} className="p-3 text-white">
                      {tarea.Correcciones[categoria]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
