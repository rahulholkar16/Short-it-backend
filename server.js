import route from "./routes/UserRoute.js";
import cors from 'cors'
import { express, mongoose, fileURLToPath, path, auth, cookieParser } from "./utils/ImortExport.js";
// import serverless from 'serverless-http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// DB Config
mongoose.connect(process.env.DB_URL)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB error:", err.message));

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // your frontend URL
    credentials: true, // allow cookies
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// ----- Route -----
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'index.html'));
// })

app.use('/api/v1', route);
app.use('/url', route);
app.listen(process.env.PORT);