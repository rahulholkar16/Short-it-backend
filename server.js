import route from "./routes/UserRoute.js";
import cors from 'cors';
import { connectDB } from "./dbConfig.js"
import { express, cookieParser } from "./utils/ImortExport.js";

// DB config
await connectDB();

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



// ----- Routes -----
app.get('/', (req, res) => {
    res.json({
        msg: "Welcome!!"
    })
});
app.use('/api/v1', route);
app.use('/url', route);
