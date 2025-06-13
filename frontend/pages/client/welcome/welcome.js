import { worker } from '../mocks/browser.js';
import { getDrinks } from '../../../mocks/handlers.js';

worker.start().then(() => {
  getDrinks().then(data => {
    console.log('Datos simulados:', data);
  });
});
