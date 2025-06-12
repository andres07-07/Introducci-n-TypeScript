import { Router } from "express";
import { iniciarSesion, verificarToken, cerrarSesion,solicitarRecuperacion,cambiarContrasenaConCodigo } from '../../middlewares/authentication.js'
import {
    listarUsuario,
    buscarUsuarioporid,
    registrarUsuario,
    actualizarUsuario,
    eliminarUsuario
} from '../../controllers/usuario/controller.usuario.js';

const router = Router();

router.get('/listar', verificarToken, listarUsuario);
router.get('/buscar/:dni_usuario_pk', verificarToken, buscarUsuarioporid);
router.post('/registrar', verificarToken, registrarUsuario);
router.put('/actualizar/:dni_usuario_pk', verificarToken, actualizarUsuario);
router.delete('/eliminar/:dni_usuario_pk', verificarToken, eliminarUsuario);

router.post('/iniciarSesion', iniciarSesion);
router.post('/cerrarSesion', cerrarSesion);

router.post('/recuperar', solicitarRecuperacion); // Solicita el código
router.post('/cambiar-contrasena', cambiarContrasenaConCodigo); // Cambia la contraseña


export default router;