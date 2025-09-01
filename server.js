import route from "./routes/UserRoute.js";
import cors from 'cors'
import { express, mongoose, cookieParser } from "./utils/ImortExport.js";
// import serverless from 'serverless-http';

// DB Config
mongoose.connect(process.env.DB_URL)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB error:", err.message));

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// ----- Route -----
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'index.html'));
// })

app.use('/api/v1', route);
app.use('/url', route);
app.listen(process.env.PORT);