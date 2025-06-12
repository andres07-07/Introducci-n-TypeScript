import { Router } from "express";
import { reportarFinanzasExcel } from '../../../controllers/report/finanzas/controller.finanzas.js';

const router = Router();

router.get('/reporte-finanzas-excel', reportarFinanzasExcel);

export default router;


