import axios from 'axios';
const URL = 'http://localhost:3000/lote';

export async function listarLotes(): Promise<string> {
  try {
    const { data } = await axios.get(`${URL}/listar`);
    if (!Array.isArray(data) || data.length === 0) return 'No hay lotes registrados.';
    const ordenados = data.sort((a, b) => a.id_lote_pk - b.id_lote_pk);
    return ordenados.map((l: any) => `ID: ${l.id_lote_pk}<br>
     Área: ${l.area_lote}<hr>`).join('');
  } catch (e) {
    console.error('Error al listar lotes:', e);
    return 'Error al listar los lotes.';
  }
}

export async function listarLotePorId(id: number): Promise<string> {
  if (isNaN(id) || id <= 0) return 'ID inválido.';
  try {
    const { data } = await axios.get(`${URL}/buscar/${id}`);
    const lote = Array.isArray(data) ? data[0] : data;
    if (!lote) return 'No se encontró el lote con ese ID.';
    return `ID: ${lote.id_lote_pk} <br> Área: ${lote.area_lote}<hr>`;
  } catch (e) {
    console.error(`Error al buscar lote con ID ${id}:`, e);
    return 'Error al buscar el lote.';
  }
}

export async function registrarLote(area: string): Promise<string> {
  const n = parseFloat(area);
  if (isNaN(n) || n <= 0) return 'Área inválida.';
  try {
    await axios.post(`${URL}/registrar`, { area_lote: n });
    return 'Lote registrado correctamente.';
  } catch (e: any) {
    console.error('Error al registrar lote:', e.response?.data || e.message);
    return 'Error al registrar el lote.';
  }
}

export async function actualizarLote(id: number, area: string): Promise<string> {
  const n = parseFloat(area);
  if (isNaN(id) || id <= 0 || isNaN(n) || n <= 0) return 'Datos inválidos.';
  try {
    await axios.put(`${URL}/actualizar/${id}`, { area_lote: n });
    return 'Lote actualizado correctamente.';
  } catch (e) {
    console.error(`Error al actualizar lote con ID ${id}:`, e);
    return 'Error al actualizar el lote.';
  }
}

export async function eliminarLote(id: number): Promise<string> {
  if (isNaN(id) || id <= 0) return 'ID inválido.';
  try {
    await axios.delete(`${URL}/eliminar/${id}`);
    return 'Lote eliminado correctamente.';
  } catch (e) {
    console.error(`Error al eliminar lote con ID ${id}:`, e);
    return 'Error al eliminar el lote.';
  }
}
