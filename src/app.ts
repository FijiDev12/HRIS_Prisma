import express from "express";
import cors from 'cors';
import { setupSwagger } from "./util/swagger.util";
import departmentRoutes from './routes/department.route';
import dtrRoutes from './routes/dtr.route';
import employeeRoutes from './routes/employee.route';
import holidayRoutes from './routes/holiday.route';
import siteRoutes from './routes/site.route';
import timeLogRoutes from './routes/timelogs.route';
import positionRoutes from './routes/position.route';
import roleRoutes from './routes/role.route';
import restdayRoutes from './routes/restday.route';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.status(200).json({
        code: 200,
        message: `🚀 API ${process.env.NODE_ENV} environment`
    });
});

app.use("/api/v1/department", departmentRoutes);
app.use("/api/v1/dtr", dtrRoutes);
app.use("/api/v1/employee", employeeRoutes);
app.use("/api/v1/holiday", holidayRoutes);
app.use("/api/v1/sites", siteRoutes);
app.use("/api/v1/time", timeLogRoutes);
app.use("/api/v1/position", positionRoutes);
app.use("/api/v1/role", roleRoutes);
app.use("/api/v1/restday", restdayRoutes);

setupSwagger(app);

export default app;