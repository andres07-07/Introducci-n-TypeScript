import { Router } from "express";
import { verificarToken } from '../../middlewares/authentication.js';
import {
  listarTipoCultivos,
  buscarTipoCultivoPorId,
  registrarTipoCultivo,
  actualizarTipoCultivo,
  eliminarTipoCultivo
} from '../../controllers/cultivo/controller.tipoCultivo.js';

const router = Router();

router.get('/listar', verificarToken, listarTipoCultivos);
router.get('/buscar/:id_tipo_cultivo_pk', verificarToken, buscarTipoCultivoPorId);
router.post('/registrar', registrarTipoCultivo);
router.put('/actualizar/:id_tipo_cultivo_pk', verificarToken, actualizarTipoCultivo);
router.delete('/eliminar/:id_tipo_cultivo_pk', verificarToken, eliminarTipoCultivo);


export default router;
