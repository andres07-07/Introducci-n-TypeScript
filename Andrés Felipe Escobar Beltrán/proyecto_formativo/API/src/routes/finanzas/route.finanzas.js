import { Router } from "express";
import { calcularRentabilidadCultivo } from "../../controllers/finanzas/controlador.finanzas.js";

const router = Router();

// Ruta para calcular la rentabilidad de un cultivo
router.get('/rentabilidad/:id_cultivo_pk', calcularRentabilidadCultivo);

export default router;