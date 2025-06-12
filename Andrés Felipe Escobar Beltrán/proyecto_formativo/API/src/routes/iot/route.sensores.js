import { Router } from "express";
import { verificarToken } from '../../middlewares/authentication.js'
import {
    listarSensores,
    buscarSensorporid,
    registrarSensores,
    actualizarSensor,
    eliminarSensor
} from '../../controllers/iot/controller.sensores.js';

const router = Router();

router.get('/listar', verificarToken, listarSensores);
router.get('/buscar/:id_sensor_pk', verificarToken, buscarSensorporid);
router.post('/registrar', verificarToken, registrarSensores);
router.put('/actualizar/:id_sensor_pk', verificarToken, actualizarSensor);
router.delete('/eliminar/:id_sensor_pk', verificarToken, eliminarSensor);


export default router;