import { jwt, UserModel } from "../utils/ImortExport.js";

export async function auth(req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token) return res.status(401).json({ msg: "No token provide!", success: false });

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) return res.status(401).json({ msg: "Invalid User!", success: false });

        const user = await UserModel.findById(decode.id).select("-password"); // exclude password
        if (!user) {
            return res.status(401).json({ msg: "Unauthorized: User not found", success: false });
        }

        req.userId = decode.id;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ msg: "Unauthorized: Token expired", success: false });
        }

        return res.status(401).json({ msg: "Unauthorized: Invalid token", success: false });
    }
}