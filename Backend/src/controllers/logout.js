
export async function Logout(req, res) {
    res.clearCookie("jwt", {
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
}
