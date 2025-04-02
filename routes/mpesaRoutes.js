// imports
const express = require("express");
const mpesaController = require("../controllers/mpesaController");

// initiate express router
const router = express.Router();

// REST API endpoint for initiating MPESA payment
router.post("/", async (req, res) => {
    console.log("Received request body:", req.body); // Debugging line
    try {
        // Validate request body
        const { phoneNumber, amount, accountReference, transactionDesc } = req.body;

        if (!phoneNumber || !amount || !accountReference || !transactionDesc) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Ensure amount is a number
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount. It must be a positive number." });
        }

        // Get the access token
        const accessToken = await mpesaController.getAccessToken();

        // Initiate payment
        const paymentResponse = await mpesaController.initiatePayment(
            accessToken, phoneNumber, amount, accountReference, transactionDesc
        );

        // Check for error in payment response (e.g., invalid request)
        if (paymentResponse.errorCode) {
            return res.status(400).json({
                message: `Payment initiation failed: ${paymentResponse.errorMessage}`,
                error: paymentResponse,
            });
        }

        // Send the response to the client
        res.status(200).json(paymentResponse);
    } catch (error) {
        console.error('Payment initiation failed:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});


// Callback required by Daraja API
router.post("/callback", (req, res) => {
    console.log("Callback received:", JSON.stringify(req.body, null, 2)); // Improved logging

    res.status(200).json({ message: "Callback received successfully" });
});



// exports
module.exports = router;
