import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function ReportesCard({ reportes, vencimientos }) {
  const categoriasCorrecciones =
    reportes.length > 0 ? Object.keys(reportes[0].Correcciones) : [];

  const handleExportar = async () => {
    try {
      // Cargar la plantilla desde un archivo local
      const response = await fetch("/Plantilla_Tareas.xlsx");
      const arrayBuffer = await response.arrayBuffer();

      // Crear un libro de trabajo con ExcelJS
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(arrayBuffer);

      // Obtener las hojas
      const wsTareas = wb.getWorksheet("Tareas");
      const wsCorrecciones = wb.getWorksheet("Correcciones");

      // 📌 Verificar si las hojas existen
      if (!wsTareas || !wsCorrecciones) {
        console.error("Las hojas no se encontraron en la plantilla.");
        return;
      }

      // 📌 Rellenar la hoja "Tareas"
      reportes.forEach((tarea, index) => {
        const rowIndex = index + 2; // Empezar desde la fila 2
        const row = wsTareas.getRow(rowIndex);

        row.getCell(1).value = tarea.nombre;
        row.getCell(2).value = `${tarea.agenteNombre} ${tarea.agenteApellido}`;
        row.getCell(3).value = vencimientos.tareasCompletadas.some(
          (t) => t.id === tarea.id
        )
          ? "Sí"
          : "";
        row.getCell(4).value = vencimientos.tareasVencidas.some(
          (t) => t.id === tarea.id
        )
          ? "Sí"
          : "";
        row.getCell(5).value = vencimientos.tareasActivas.some(
          (t) => t.id === tarea.id
        )
          ? "Sí"
          : "";
        row.getCell(6).value = vencimientos.tareasFuturas.some(
          (t) => t.id === tarea.id
        )
          ? "Sí"
          : "";

        row.commit(); // Guardar los cambios en la fila
      });

      // 📌 Rellenar la hoja "Correcciones"
      reportes.forEach((tarea, index) => {
        const rowIndex = index + 2; // Empezar desde la fila 2
        const row = wsCorrecciones.getRow(rowIndex);

        row.getCell(1).value = tarea.nombre;
        row.getCell(2).value = `${tarea.agenteNombre} ${tarea.agenteApellido}`;

        categoriasCorrecciones.forEach((categoria, i) => {
          row.getCell(i + 3).value = tarea.Correcciones[categoria] ?? 0;
        });

        row.commit();
      });

      // 📌 Agregar el total de cada corrección
      const totalRowIndex = reportes.length + 2; // Fila después de los datos
      const totalRow = wsCorrecciones.getRow(totalRowIndex);
      totalRow.getCell(1).value = "Total";
      totalRow.getCell(2).value = ""; // Celda vacía para el nombre del agente

      categoriasCorrecciones.forEach((categoria, i) => {
        const total = reportes.reduce(
          (sum, tarea) => sum + (tarea.Correcciones[categoria] ?? 0),
          0
        );
        totalRow.getCell(i + 3).value = total;
      });

      totalRow.commit();

      // 📌 Guardar el archivo
      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, "Reporte_Tareas.xlsx");
    } catch (error) {
      console.error("Error exportando Excel:", error);
    }
  };
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
          <div className="grid grid-cols-2 gap-2">
            <div className="flex justify-between">
              <p className="text-gray-300">Sin comenzar:</p>
              <p className="font-semibold text-white">
                {vencimientos.tareasActivas.length}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-300">Curso:</p>
              <p className="font-semibold text-white">
                {vencimientos.tareasCompletadas.length}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-300">Revisión:</p>
              <p className="font-semibold text-white">
                {vencimientos.tareasCompletadas.length}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-300">Corrección:</p>
              <p className="font-semibold text-white">
                {vencimientos.tareasCompletadas.length}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-300">Bloqueada:</p>
              <p className="font-semibold text-white">
                {vencimientos.tareasCompletadas.length}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-300">Completada:</p>
              <p className="font-semibold text-white">
                {vencimientos.tareasCompletadas.length}
              </p>
            </div>
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
      <div className="col-span-14 mt-6 ">
        <h3 className="text-2xl font-semibold text-gray-300 mb-2">
          Correcciones
        </h3>
        <div className="overflow-x-auto rounded-xl bg-gray-800">
          <table className="w-full border border-gray-700">
            <thead className="">
              <tr className="text-left">
                <th className="p-3 text-lg border-b border-gray-600 text-gray-300">
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
                  className="text-center  border-t border-gray-600"
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
      <div className="flex justify-end">
        <button
          onClick={handleExportar}
          className="mt-2 bg-blue-600 text-white rounded-lg px-4 py-2 shadow-lg hover:bg-blue-700 transition-colors"
        >
          Exportar a excel
        </button>
      </div>
    </div>
  );
}
