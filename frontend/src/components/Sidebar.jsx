import React from "react";

export default function Component() {
  return (
    <div className="w-64 bg-gray-800 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Task Tracker</h1>
      <nav>
        <ul className="space-y-2">
          <li>
            <a href="#" className="block py-2 px-4 hover:bg-gray-700 rounded">
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 px-4 hover:bg-gray-700 rounded">
              Todas las tareas
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 px-4 hover:bg-gray-700 rounded">
              Tareas pendientes
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 px-4 hover:bg-gray-700 rounded">
              Tareas completadas
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
