import { Router } from "express";
import { verificarToken } from '../../middlewares/authentication.js'
import {
    listarRol,
    buscarRolporid,
    registrarRol,
    actualizarRol,
    eliminarRol
} from '../../controllers/usuario/controller.roles.js';

const router = Router();

router.get('/listar', verificarToken, listarRol);
router.get('/buscar/:id_rol_pk', verificarToken, buscarRolporid);
router.post('/registrar', verificarToken, registrarRol);
router.put('/actualizar/:id_rol_pk', verificarToken, actualizarRol);
router.delete('/eliminar/:id_rol_pk', verificarToken, eliminarRol);


export default router;