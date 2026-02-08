import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import "dotenv/config";

const URL = `${process.env.URL}:${process.env.PORT}`

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CHSI API',
            version: '1.0.0',
            description: 'API documentation for CHSI system',
        },
        servers: [
            {
                url: URL,
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
}