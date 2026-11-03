import './components';
import './tokens.css';
const app = document.querySelector<HTMLDivElement>('#app');
if (app)
  app.innerHTML =
    '<main style="max-width:900px;margin:80px auto;font:18px system-ui"><p>PRISM / COMPONENT WORKBENCH</p><h1>A clearer way to build.</h1><p>Twelve thoughtfully scoped Web Components. The interactive workbench is in development.</p><prism-button>Build with Prism</prism-button><prism-text-field label="Workspace name" placeholder="Your next idea"></prism-text-field></main>';
