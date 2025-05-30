import { useState } from "react";
import config from "../api/config";
import axios from "axios";

/**
 *
 * @param {string} url
 * @param {Record<string, any>} params - Un objeto con pares clave-valor para los parámetros de
 */
const useApiGet = (url, params = {}) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const parseParams = (params) => {
    if (params.length === 0) return "";
    let string = "?";
    Object.entries(params).forEach(([key, value], index, array) => {
      string += `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      if (index < array.length - 1) {
        string += "&";
      }
    });
    return string;
  };

  const get = async () => {
    if (!token) {
      setError({ message: "No hay token disponible" });
      console.error("No hay token disponible");
    }

    try {
      const paramsString = parseParams(params);
      const { data } = await axios.get(
        `${config.apiUrl}/${url}${paramsString}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResult(data);
    } catch (error) {
      setError({ message: "Error al realizar GET " + "url", details: error });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  get();

  return { result, loading, error };
};

export default useApiGet;
