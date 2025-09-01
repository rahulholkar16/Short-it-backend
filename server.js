import route from "./routes/UserRoute.js";
import cors from 'cors';
import { express, mongoose, cookieParser } from "./utils/ImortExport.js";

// DB Config
mongoose.connect(process.env.DB_URL)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB error:", err.message));

const app = express();

// ✅ CORS setup
app.use(cors({
    origin: [
        "http://localhost:5173",  // Vite frontend
        "http://localhost:3000",
        "https://short-it-one.vercel.app/"   // CRA frontend
    ],
    credentials: true, // allow cookies / auth headers
}));

app.use(express.json());
app.use(cookieParser());

// ----- Routes -----
app.use('/api/v1', route);
app.use('/url', route);

app.listen(process.env.PORT || 3000, () => {
    console.log("🚀 Server running on port", process.env.PORT || 3000);
});
