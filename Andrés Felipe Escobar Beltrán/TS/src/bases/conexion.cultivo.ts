import axios from 'axios';
const URL = 'http://localhost:3000/cultivo';

export async function listarCultivos(): Promise<string> {
  try {
    const { data } = await axios.get(`${URL}/listar`);
    if (!Array.isArray(data) || data.length === 0) return 'No hay cultivos registrados.';
    const ordenados = data.sort((a, b) => a.id_cultivo_pk - b.id_cultivo_pk);
    return ordenados.map((c: any) =>
      `ID: ${c.id_cultivo_pk}<br>
       Descripción: ${c.descripcion_cultivo}<br>
       Precio: $${c.precio_cultivo}<br>
       Presentación: ${c.presentacion_cultivo}<br>
       Fecha inicio: ${c.fecha_inicio_cultivo}<br>
       Fecha fin: ${c.fecha_fin_cultivo}<br>
       ID Sublote: ${c.id_sublote_fk}<br>
       ID Tipo Cultivo: ${c.id_tipo_cultivo_fk}<hr>`
    ).join('');
  } catch (e) {
    console.error('Error al listar cultivos:', e);
    return 'Error al listar los cultivos.';
  }
}

export async function buscarCultivoPorId(id: number): Promise<string> {
  if (isNaN(id) || id <= 0) return 'ID inválido.';
  try {
    const { data } = await axios.get(`${URL}/buscar/${id}`);
    const cultivo = Array.isArray(data) ? data[0] : data;
    if (!cultivo) return 'No se encontró el cultivo con ese ID.';
    return `ID: ${cultivo.id_cultivo_pk}<br>
            Descripción: ${cultivo.descripcion_cultivo}<br>
            Precio: $${cultivo.precio_cultivo}<br>
            Presentación: ${cultivo.presentacion_cultivo}<br>
            Fecha inicio: ${cultivo.fecha_inicio_cultivo}<br>
            Fecha fin: ${cultivo.fecha_fin_cultivo}<br>
            ID Sublote: ${cultivo.id_sublote_fk}<br>
            ID Tipo Cultivo: ${cultivo.id_tipo_cultivo_fk}<hr>`;
  } catch (e) {
    console.error(`Error al buscar cultivo con ID ${id}:`, e);
    return 'Error al buscar el cultivo.';
  }
}

export async function registrarCultivo(
  descripcion: string,
  precio: number,
  presentacion: string,
  fechaInicio: string,
  fechaFin: string,
  idSublote: number,
  idTipoCultivo: number
): Promise<string> {
  const p = parseFloat(precio.toString());
  const sid = parseInt(idSublote.toString());
  const tid = parseInt(idTipoCultivo.toString());

  if (!descripcion.trim() || !presentacion.trim()) return 'Descripción o presentación inválida.';
  if (isNaN(p) || p <= 0) return 'Precio inválido.';
  if (isNaN(sid) || isNaN(tid) || sid <= 0 || tid <= 0) return 'ID de sublote o tipo de cultivo inválido.';
  if (!fechaInicio || !fechaFin) return 'Fechas inválidas.';

  try {
    await axios.post(`${URL}/registrar`, {
      descripcion_cultivo: descripcion,
      precio_cultivo: p,
      presentacion_cultivo: presentacion,
      fecha_inicio_cultivo: fechaInicio,
      fecha_fin_cultivo: fechaFin,
      id_sublote_fk: sid,
      id_tipo_cultivo_fk: tid
    });
    return 'Cultivo registrado correctamente.';
  } catch (e: any) {
    console.error('Error al registrar cultivo:', e.response?.data || e.message);
    return 'Error al registrar el cultivo.';
  }
}


export async function actualizarCultivo(
  id: number,
  descripcion: string,
  precio: number,
  presentacion: string,
  fechaInicio: string,
  fechaFin: string,
  idSublote: number,
  idTipoCultivo: number
): Promise<string> {
  try {
    await axios.put(`${URL}/actualizar/${id}`, {
      descripcion_cultivo: descripcion,
      precio_cultivo: precio,
      presentacion_cultivo: presentacion,
      fecha_inicio_cultivo: fechaInicio,
      fecha_fin_cultivo: fechaFin,
      id_sublote_fk: idSublote,
      id_tipo_cultivo_fk: idTipoCultivo
    });
    return 'Cultivo actualizado correctamente.';
  } catch (e) {
    console.error('Error al actualizar cultivo:', e);
    return 'Error al actualizar el cultivo.';
  }
}


export async function eliminarCultivo(id: number): Promise<string> {
  if (isNaN(id) || id <= 0) return 'ID inválido.';
  try {
    await axios.delete(`${URL}/eliminar/${id}`);
    return 'Cultivo eliminado correctamente.';
  } catch (e) {
    console.error(`Error al eliminar cultivo con ID ${id}:`, e);
    return 'Error al eliminar el cultivo.';
  }
}
