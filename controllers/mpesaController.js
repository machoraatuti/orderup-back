const fetch = require("node-fetch");

exports.getAccessToken = async () => {
    try {
        const credentials = Buffer.from(
            `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
        ).toString('base64');

        const response = await fetch(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                },
            }
        );

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Error fetching access token:", error.message);
        throw new Error('Failed to get access token');
    }
};

exports.initiatePayment = async (accessToken, phoneNumber, amount, accountReference, transactionDesc) => {
    console.log("Initiating payment with:", {
        accessToken,
        phoneNumber,
        amount,
        accountReference,
        transactionDesc
    });

    try {
        // Prepare the timestamp for the STK Push
        const timestamp = new Date().toISOString().replace(/[-:.T]/g, "").slice(0, 14);

        // Prepare the password for the request (Base64 encoded BusinessShortCode + Passkey + Timestamp)
        const password = Buffer.from(
            process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
        ).toString('base64');

        const paymentData = {
            BusinessShortCode: process.env.MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: phoneNumber,
            PartyB: process.env.MPESA_SHORTCODE,
            PhoneNumber: phoneNumber,
            AccountReference: accountReference,
            TransactionDesc: transactionDesc,
            CallBackURL: "https://4958-196-96-184-180.ngrok-free.app/api/checkout/callback", // Replace with actual callback URL
        };

        // Make the STK Push request to Daraja API
        const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
        });

        const data = await response.json();

        // Return data (response to the route)
        if (data.ResponseCode === '0') {
            return { message: 'Payment initiated successfully', data };
        } else {
            return { errorMessage: data.errorMessage };
        }
    } catch (error) {
        console.error("Error with STK Push:", error.message);
        throw new Error('Failed to initiate payment');
    }
};


