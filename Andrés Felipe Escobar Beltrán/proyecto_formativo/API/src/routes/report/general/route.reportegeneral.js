import Router from 'express';
import {  generarReporteGeneral} from '../../../controllers/report/general/controller.reporte.general.js'; 
const router = Router();

router.get('/obtener', generarReporteGeneral);

export default router;
