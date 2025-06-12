import '../style.css';
import { crearSidebar } from '../components/sidebar.ts';
import {
  listarLotes,
  listarLotePorId,
  registrarLote,
  actualizarLote,
  eliminarLote
} from '../bases/conexion.lote.ts';

const app = document.getElementById('app')!;
app.innerHTML = `
  <div class="container">
    ${crearSidebar()}
    <main class="content">
      <h1>Lotes</h1>

      <section>
      <h2>Listar lotes</h2>
        <button id="btn-listar">Listar Lotes</button>
      </section>

      <section>
        <h2>Buscar por ID</h2>
        <input type="number" id="input-id-buscar" placeholder="ID del lote" /><br>
        <button id="btn-buscar">Buscar</button>
      </section>

      <section>
        <h2>Registrar Lote</h2>
        <input type="text" id="input-area-registrar" placeholder="Área del lote" /><br>
        <button id="btn-registrar">Registrar</button>
      </section>

      <section>
        <h2>Actualizar Lote</h2>
        <input type="number" id="input-id-actualizar" placeholder="ID del lote" /><br>
        <input type="text" id="input-area-actualizar" placeholder="Nueva área" /><br>
        <button id="btn-actualizar">Actualizar</button>
      </section>

      <section>
        <h2>Eliminar Lote</h2>
        <input type="number" id="input-id-eliminar" placeholder="ID del lote" /><br>  
        <button id="btn-eliminar">Eliminar</button>
      </section>
        <h2>Resultados:</h2>
      <div id="resultado"></div>
    </main>
  </div>
`;

const res = document.getElementById('resultado')!;

document.getElementById('btn-listar')?.addEventListener('click', async () => {
  res.innerHTML = await listarLotes();
});

document.getElementById('btn-buscar')?.addEventListener('click', async () => {
  const id = Number((document.getElementById('input-id-buscar') as HTMLInputElement).value);
  res.innerHTML = await listarLotePorId(id);
});

document.getElementById('btn-registrar')?.addEventListener('click', async () => {
  const area = (document.getElementById('input-area-registrar') as HTMLInputElement).value;
  res.innerHTML = await registrarLote(area);
});

document.getElementById('btn-actualizar')?.addEventListener('click', async () => {
  const id = Number((document.getElementById('input-id-actualizar') as HTMLInputElement).value);
  const area = (document.getElementById('input-area-actualizar') as HTMLInputElement).value;
  res.innerHTML = await actualizarLote(id, area);
});

document.getElementById('btn-eliminar')?.addEventListener('click', async () => {
  const id = Number((document.getElementById('input-id-eliminar') as HTMLInputElement).value);
  res.innerHTML = await eliminarLote(id);
});
