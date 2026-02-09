import express from "express";
import cors from 'cors';
import * as fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import departmentRoutes from './routes/department.route';
import dtrRoutes from './routes/dtr.route';
import employeeRoutes from './routes/employee.route';
import holidayRoutes from './routes/holiday.route';
import siteRoutes from './routes/site.route';
import timeLogRoutes from './routes/timelogs.route';
import positionRoutes from './routes/position.route';
import roleRoutes from './routes/role.route';
import restdayRoutes from './routes/restday.route';
import userRoutes from './routes/user.route';
import obRoutes from './routes/ob.route';
import otRoutes from './routes/ot.route';
import scheduleRoutes from './routes/shiftSched.route';
import authRoutes from './routes/auth.route';
import leaveRoutes from './routes/leave.route';

const swaggerFile = path.join(__dirname, "../docs/swagger.json");
const swaggerData = JSON.parse(fs.readFileSync(swaggerFile, "utf-8"));

const app = express();

app.use(cors());
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerData));

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
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/request/ob", obRoutes);
app.use("/api/v1/request/ot", otRoutes);
app.use("/api/v1/schedule", scheduleRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/leave", leaveRoutes);

export default app;