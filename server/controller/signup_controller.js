const bcrypt_functions = require("../functions/bcrypt");
// const fetch = require("node-fetch"); // Ensure node-fetch is installed (npm install node-fetch)

// Environment variables (always store secrets here)
const BASEROW_TOKEN = process.env.BASEROW_TOKEN || "lZKMA5NZ8oqLQLZe1ANET6at4juhCQBK"; 
const BASEROW_TABLE_URL = "https://api.baserow.io/api/database/rows/table/722198/?user_field_names=true";

const signupController = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Validate inputs
        if (!fullname || !email || !password) {
            return res.status(400).json({ error: "Fullname, email, and password are required." });
        }

        console.log("Signup request:", { fullname, email });

        // Hash password
        const encrypted_password = await bcrypt_functions.encrypt(password);

        // Save to Baserow
        const result = await saveToBaserow(fullname, email, encrypted_password);

        if (result.success) {
            return res.status(201).json({
                message: "User created successfully",
                user: { fullname, email },
            });
        } else {
            return res.status(400).json({ error: result.error });
        }

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const saveToBaserow = async (fullname, email, encrypted_password) => {
    try {
        const response = await fetch(BASEROW_TABLE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${BASEROW_TOKEN}`,
            },
            body: JSON.stringify({
                fullname,
                email,
                password: encrypted_password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Baserow API error:", data);
            return {
                success: false,
                error: data.error || "Failed to create user in Baserow.",
            };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Error saving to Baserow:", error);
        return { success: false, error: "Failed to connect to Baserow." };
    }
};

module.exports = { signupController };
