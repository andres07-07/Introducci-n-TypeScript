import { Router } from "express";
import { verificarToken } from '../../middlewares/authentication.js'
import {
    listartipoSensores,
    buscartipoSensorid,
    registrartiposSensores,
    actualizartipoSensor,
    eliminartipoSensor
} from '../../controllers/iot/controller.tipos_sensores.js';

const router = Router();

router.get('/listartipo', verificarToken, listartipoSensores);
router.get('/buscar/:id_tipo_sensor_pk', verificarToken, buscartipoSensorid);
router.post('/registrar', verificarToken, registrartiposSensores);
router.put('/actualizar/:id_tipo_sensor_pk', verificarToken, actualizartipoSensor);
router.delete('/eliminar/:id_tipo_sensor_pk', verificarToken, eliminartipoSensor);


export default router;