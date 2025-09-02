import route from "./routes/UserRoute.js";
import cors from 'cors';
import { connectDB } from "db.js";
import { express, cookieParser } from "./utils/ImortExport.js";


const app = express();

// ✅ CORS setup
app.use(cors({
    origin: [
        "http://localhost:5173",  // Vite frontend
        "https://shortit-tan.vercel.app"   // CRA frontend
    ],
    credentials: true, // allow cookies / auth headers
}));

app.use(express.json());
app.use(cookieParser());

// DB config
connectDB();

// ----- Routes -----
app.get('/', (req, res) => {
    res.json({
        msg: "Welcome!!"
    })
});
app.use('/api/v1', route);
app.use('/url', route);

app.listen(process.env.PORT || 3000, () => {
    console.log("🚀 Server running on port", process.env.PORT || 3000);
});
