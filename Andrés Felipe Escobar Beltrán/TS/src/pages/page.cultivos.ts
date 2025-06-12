import "../style.css";
import { crearSidebar } from "../components/sidebar.ts";
import {
  listarCultivos,
  buscarCultivoPorId,
  registrarCultivo,
  actualizarCultivo,
  eliminarCultivo,
} from "../bases/conexion.cultivo.ts";

const app = document.getElementById("app")!;
app.innerHTML = `
  <div class="container">
    ${crearSidebar()}
    <main class="content">
      <h1>Cultivos</h1>

      <section>
        <h2>Listar cultivos</h2>
        <button id="btn-listar">Listar Cultivos</button>
      </section>

      <section>
        <h2>Buscar por ID</h2>
        <input type="number" id="input-id-buscar" placeholder="ID del cultivo" /><br>
        <button id="btn-buscar">Buscar</button>
      </section>


<section>
  <h2>Registrar Cultivo</h2>
  <input type="text" id="input-descripcion-registrar" placeholder="Descripción del cultivo" />
  <input type="number" id="input-precio-registrar" placeholder="Precio" />
  <input type="text" id="input-presentacion-registrar" placeholder="Presentación" />
  <input type="date" id="input-fecha-inicio-registrar" placeholder="Fecha de inicio" />
  <input type="date" id="input-fecha-fin-registrar" placeholder="Fecha de fin" />
  <input type="number" id="input-sublote-registrar" placeholder="ID Sublote" />
  <input type="number" id="input-tipo-cultivo-registrar" placeholder="ID Tipo Cultivo" /><br>
  <button id="btn-registrar">Registrar</button>
</section>


<section>
  <h2>Actualizar Cultivo</h2>
  <input type="number" id="input-id-actualizar" placeholder="ID del cultivo" />
  <input type="text" id="input-descripcion-actualizar" placeholder="Nueva descripción" />
  <input type="number" id="input-precio-actualizar" placeholder="Precio" />
  <input type="text" id="input-presentacion-actualizar" placeholder="Presentación" />
  <input type="date" id="input-fecha-inicio-actualizar" placeholder="Fecha de inicio" />
  <input type="date" id="input-fecha-fin-actualizar" placeholder="Fecha de fin" />
  <input type="number" id="input-sublote-actualizar" placeholder="ID Sublote" />
  <input type="number" id="input-tipo-cultivo-actualizar" placeholder="ID Tipo Cultivo" /><br>
  <button id="btn-actualizar">Actualizar</button>
</section>


      <section>
        <h2>Eliminar Cultivo</h2>
        <input type="number" id="input-id-eliminar" placeholder="ID del cultivo" /><br>
        <button id="btn-eliminar">Eliminar</button>
      </section>

      <h2>Resultados:</h2>
      <div id="resultado"></div>
    </main>
  </div>
`;

const res = document.getElementById("resultado")!;

document.getElementById("btn-listar")?.addEventListener("click", async () => {
  res.innerHTML = await listarCultivos();
});

document.getElementById("btn-buscar")?.addEventListener("click", async () => {
  const id = Number(
    (document.getElementById("input-id-buscar") as HTMLInputElement).value
  );
  res.innerHTML = await buscarCultivoPorId(id);
});

document.getElementById('btn-registrar')?.addEventListener('click', async () => {
  const descripcion = (document.getElementById('input-descripcion-registrar') as HTMLInputElement).value;
  const precio = Number((document.getElementById('input-precio-registrar') as HTMLInputElement).value);
  const presentacion = (document.getElementById('input-presentacion-registrar') as HTMLInputElement).value;
  const fechaInicio = (document.getElementById('input-fecha-inicio-registrar') as HTMLInputElement).value;
  const fechaFin = (document.getElementById('input-fecha-fin-registrar') as HTMLInputElement).value;
  const idSublote = Number((document.getElementById('input-sublote-registrar') as HTMLInputElement).value);
  const idTipoCultivo = Number((document.getElementById('input-tipo-cultivo-registrar') as HTMLInputElement).value);

  res.innerHTML = await registrarCultivo(descripcion, precio, presentacion, fechaInicio, fechaFin, idSublote, idTipoCultivo);
});

document.getElementById('btn-actualizar')?.addEventListener('click', async () => {
  const id = Number((document.getElementById('input-id-actualizar') as HTMLInputElement).value);
  const descripcion = (document.getElementById('input-descripcion-actualizar') as HTMLInputElement).value;
  const precio = Number((document.getElementById('input-precio-actualizar') as HTMLInputElement).value);
  const presentacion = (document.getElementById('input-presentacion-actualizar') as HTMLInputElement).value;
  const fechaInicio = (document.getElementById('input-fecha-inicio-actualizar') as HTMLInputElement).value;
  const fechaFin = (document.getElementById('input-fecha-fin-actualizar') as HTMLInputElement).value;
  const idSublote = Number((document.getElementById('input-sublote-actualizar') as HTMLInputElement).value);
  const idTipoCultivo = Number((document.getElementById('input-tipo-cultivo-actualizar') as HTMLInputElement).value);

  res.innerHTML = await actualizarCultivo(id, descripcion, precio, presentacion, fechaInicio, fechaFin, idSublote, idTipoCultivo);
});


document.getElementById("btn-eliminar")?.addEventListener("click", async () => {
  const id = Number(
    (document.getElementById("input-id-eliminar") as HTMLInputElement).value
  );
  res.innerHTML = await eliminarCultivo(id);
});
