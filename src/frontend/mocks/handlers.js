import { rest } from 'msw';
import drinks from '../data/drinks.json';

export const handlers = [
  rest.get('/api/drinks', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(drinks));
  }),

//   rest.post('/api/pinturas', async (req, res, ctx) => {
//     const nuevaPintura = await req.json();
//     nuevaPintura.id = Date.now(); // simulamos un ID
//     pinturas.push(nuevaPintura); // modificamos el array simulado
//     return res(ctx.status(201), ctx.json(nuevaPintura));
//   })
];
