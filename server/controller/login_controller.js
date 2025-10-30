const bcrypt_functions = require("../functions/bcrypt");
const { generateToken, remember_me_token } = require("../functions/token_generator");


const BASEROW_TOKEN = "lZKMA5NZ8oqLQLZe1ANET6at4juhCQBK"; // baserow token
const BASEROW_TABLE_URL = "https://api.baserow.io/api/database/rows/table/722198/?user_field_names=true";


const loginController = async (req, res) => {
    try {
        const { email, password, remember_me } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Fetch user from Baserow using email filter
        const response = await fetch(
            `${BASEROW_TABLE_URL}&filter__email__equal=${encodeURIComponent(email)}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Token ${BASEROW_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Baserow API error:", data);
            return res.status(400).json({ error: data.error || "Failed to fetch user" });
        }

        if (data.count === 0) {
            return res.status(404).json({ error: "Invalid email or password" });
        }

        //Extracting user from response
        const user = data.results[0];

        const isPasswordValid = await bcrypt_functions.compare(password, user.password);

        if (!isPasswordValid){
            return res.status(401).json({ error: "Invalid email or password" });
        }


        const token = generateToken(user);
        var remember_me_token = null;

        if(remember_me){
            remember_me_token = generateToken(user);
        }

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
            },
            user_token: remember_me?remember_me_token:token,
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { loginController };
