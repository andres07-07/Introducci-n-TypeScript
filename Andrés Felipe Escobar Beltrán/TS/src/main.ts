import './style.css';
import { crearSidebar } from './components/sidebar.ts';

const app = document.getElementById('app')!;

app.innerHTML = `
  <div class="container">
    ${crearSidebar()}
    <main class="content">
      <h1>Bienvenido al sistema</h1>
      <p>Selecciona una opción desde la barra lateral.</p>
    </main>
  </div>
`;
