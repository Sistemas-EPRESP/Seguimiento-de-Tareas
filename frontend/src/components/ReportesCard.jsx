export default function ReportesCard({ reportes }) {
  return (
    <div className="">
      {/* Total de tareas */}
      <div className="flex gap-4 mt-4">
        <div className="w-1/4 bg-gray-800 p-4 shadow-md rounded-lg">
          <h4 className="text-lg font-semibold text-gray-300">
            Total de Tareas
          </h4>
          <p className="text-2xl font-bold text-white">{reportes.total}</p>
        </div>

        {/* Tareas por Estado */}
        <div className="w-1/4 bg-gray-800 p-4 shadow-md rounded-lg">
          <h4 className="text-lg font-semibold text-gray-300">
            Tareas por Estado
          </h4>
          <div className="flex justify-between mt-2">
            <p className="text-gray-300">En progreso:</p>
            <p className="font-semibold text-white">{reportes["en proceso"]}</p>
          </div>
          <div className="flex justify-between mt-1">
            <p className="text-gray-300">Completadas:</p>
            <p className="font-semibold text-white">{reportes.completadas}</p>
          </div>
          <div className="flex justify-between mt-1">
            <p className="text-gray-300">Pendientes:</p>
            <p className="font-semibold text-white">
              {reportes.total - reportes.completadas - reportes["en proceso"]}
            </p>
          </div>
        </div>

        {/* Entregas Incompletas */}
        <div className="w-1/4 bg-gray-800 p-4 shadow-md rounded-lg">
          <h4 className="text-lg font-semibold text-gray-300">
            Entregas Incompletas
          </h4>
          <p className="text-2xl font-bold text-white">
            {reportes.incompletas}
          </p>
        </div>

        <div className="w-1/4 bg-gray-800 p-4 shadow-md rounded-lg">
          <h4 className="text-lg font-semibold text-gray-300">
            Entregas Incompletas
          </h4>
          <p className="text-2xl font-bold text-white">
            {reportes.incompletas}
          </p>
        </div>
      </div>

      {/* Tabla de Correcciones */}
      <div className="col-span-14 mt-6">
        <h3 className="text-xl font-semibold text-gray-300 mb-4">
          Tareas Finalizadas y Correcciones
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-800 rounded-lg ">
            <thead className="">
              <tr className="text-left">
                <th className="p-3  text-gray-400">Categoría</th>
                {reportes.Correcciones.map((correccion, index) => (
                  <th key={index} className="p-3 text-gray-400 text-center">
                    {correccion.tipo}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="text-center border-t">
                <td className="p-3 font-semibold text-white">Cantidad</td>
                {reportes.Correcciones.map((correccion, index) => (
                  <td key={index} className="p-3 text-white">
                    {correccion.cantidad}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
