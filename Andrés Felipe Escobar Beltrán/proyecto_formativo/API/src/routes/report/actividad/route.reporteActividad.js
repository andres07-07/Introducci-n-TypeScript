import { Router } from "express";
import { obtenerActividadesAgrupadas, reportarActividadExcel } from '../../../controllers/report/actividad/controller.reporte.actividad.js'; 
const router = Router();

router.get('/obtener', obtenerActividadesAgrupadas);
router.get('/obtener/excel', reportarActividadExcel);

export default router;


