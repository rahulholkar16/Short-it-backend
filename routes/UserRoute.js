import { success } from "zod";
import { bcrypt, express, nanoid, UrlModel, UserModel, auth, jwt, path, fileURLToPath } from "../utils/ImortExport.js";
import { authValidationSchema } from "../Validation/authValidation.js";
import { UrlValidation } from "../Validation/UrlValidation.js";

const route = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

route.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    const result = authValidationSchema.safeParse({ name, email, password });
    if (!result.success) {
        return res.status(400).json({
            msg: "Validation failed!",
            error: result.error.issues.map(issue => ({
                path: issue.path.join('.'),
                message: issue.message
            }))
        });
    }

    try {
        // avoid duplicates users
        const exists = await UserModel.findOne({ email: result.data.email });
        if (exists) return res.status(400).json({ mag: "User alredy exist!" });

        // create hash for password
        const hash = await bcrypt.hash(result.data.password, 5);

        // add in db
        await UserModel.create({
            name: result.data.name,
            email: result.data.email,
            password: hash,
            userHistory: []
        });

        res.status(201).json({
            msg: "User added Successfully!"
        });
    } catch (error) {
        return res.status(500).json({ msg: "Error creating user", error: e.message });
    }
});

route.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid email and password!" });

        const ok = await bcrypt.compare(password, user?.password);
        if (!ok) return res.status(400).json({ msg: "Invalid Password!" });

        const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,         // Uncomment in Production(HTTPS)
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "None",
            path: "/"
        });

        return res.status(200).json({ msg: "Loging successfully!", token: token });
    } catch (error) {
        return res.status(500).json({ msg: "Error in Login: ", error: e.message });
    }
})

route.post('/logout', (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/'
    });
    return res.status(200).json({ success: true, msg: "Logged out successfully!" });
})

route.post('/isLog', auth, (req, res) => {
    return res.status(200).json({ success: true, msg: "user loggedin!" });
})

route.get('/dashboard', auth, (req, res) => {
    try {
        res.status(200).json({
            success: true,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: "Something wrong in Dashboard Route.!",
            error: error
        })
    }
});

route.get('/history', auth, async (req, res) => {
    try {
        const { userId } = req;

        // Find the user and populate userHistory with full Url docs
        const user = await UserModel.findById(userId).populate('userHistory');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with the user's URL history
        res.json({ history: user.userHistory });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
})

route.post('/short', auth, async (req, res) => {
    const { userId } = req
    const { url } = req.body;
    console.log(userId);


    const result = UrlValidation.safeParse({ url });
    if (!result.success) {
        return res.status(400).json({
            msg: "Validation failed",
            errors: result.error.issues.map(issue => ({
                path: issue.path.join('.'),
                message: issue.message
            }))
        })
    }

    try {
        const shortUrl = nanoid(6);

        const response = await UrlModel.create({
            origenalUrl: url,
            sortUrl: shortUrl,
            user: userId
        })

        // add url in userHistory

        await UserModel.findByIdAndUpdate(userId, {
            $push: { userHistory: response._id }
        })

        return res.status(200).json({
            msg: "Url shorted!",
            data: response
        })
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ error: "Server error" });
    }
});

route.get('/:url', async (req, res) => {
    const { url } = req.params;

    try {
        const exist = await UrlModel.findOne({ sortUrl: url });
        if (!exist) return res.status(401).json({ msg: "Invalid credentials" });

        res.status(200).redirect(exist.origenalUrl);
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ error: "Server error" });
    }
})

export default route;