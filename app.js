import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' with { type: 'json' };
import router from './src/router.js';
import { notFoundHandler, errorHandler } from './src/middleware/errors.js';

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Server is running' });
});

app.use(router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
