import * as Yup from "yup";

export const tareaSchema = Yup.object().shape({
  nombre: Yup.string().required("El nombre es obligatorio"),
  agentesSeleccionados: Yup.array().min(
    1,
    "Debe seleccionar al menos un agente"
  ),
  fecha_inicio: Yup.date().required("La fecha de inicio es obligatoria"),
  fecha_de_entrega: Yup.date()
    .required("La fecha de entrega es obligatoria")
    .min(
      Yup.ref("fecha_inicio"),
      "La fecha de entrega debe ser posterior o igual a la fecha de inicio"
    ),
  fecha_limite: Yup.date()
    .required("La fecha límite es obligatoria")
    .min(
      Yup.ref("fecha_de_entrega"),
      "La fecha límite debe ser posterior o igual a la fecha de entrega"
    ),
  fecha_vencimiento: Yup.date()
    .required("La fecha de vencimiento es obligatoria")
    .min(
      Yup.ref("fecha_limite"),
      "La fecha de vencimiento debe ser posterior o igual a la fecha límite"
    ),
  prioridad: Yup.string().required("Debe seleccionar una prioridad"),
  estado: Yup.string().required("Debe seleccionar un estado"),
});
