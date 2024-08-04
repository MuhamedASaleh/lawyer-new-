const axios = require('axios');
const asyncHandler = require('express-async-handler');

exports.createCharge = asyncHandler(async (req, res) => {
    try {
        console.log('Processing payment request...');

        // Extract necessary data from request body
        const { email, cartId, redirectUrl } = req.body;

        // Set up the request options for Tap Payments API
        const options = {
            method: 'POST',
            url: 'https://api.tap.company/v2/charges/',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'Authorization': `Bearer ${process.env.TAP_SECRET_KEY}`,
            },
            data: {
                amount: 100,  // Amount in the smallest currency unit (e.g., fils for KWD)
                currency: 'KWD',
                customer_initiated: true,
                threeDSecure: true,
                save_card: false,
                description: 'Test for payment',
                receipt: { email: true, sms: true },
                customer: {
                    first_name: 'Alo',
                    last_name: 'Fog',
                    email: email || 'test@test.com',
                },
                metadata: {
                    cartId: cartId || 'unknown',
                    currUserId: 1,
                },
                source: { id: 'src_all' },
                post: {
                    url: 'https://mhamapi.ma7am.com/api/tap/webhook',
                },
                redirect: { url: redirectUrl || 'http://your_website.com/redirect_url' },
            },
        };

        // Make the request to Tap Payments API
        const { data: createdCharge } = await axios.request(options);

        // Send the response back to the client
        console.log('Payment created successfully:', createdCharge);
        res.status(200).json(createdCharge);
    } catch (error) {
        console.error('Error creating payment:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({ error: 'Error creating payment' });
    }
});


exports.refund = asyncHandler(async (req, res) => {
    const { chargeId, amount, reason } = req.body;
console.log(chargeId)
    const options = {
        method: 'POST',
        url: 'https://api.tap.company/v2/refunds/',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.TAP_SECRET_KEY}` // Ensure TAP_SECRET_KEY is set in your .env file
        },
        data: {
            reason: reason || 'test reason',
            amount,
            charge_id: chargeId,
            currency: 'KWD',
            post: {
                url: 'https://acbe-41-233-45-100.ngrok-free.app/api/tap/webhook' // Replace with your actual webhook URL
            }
        }
    };
    console.log(options)
    try {
        const response = await axios.request(options);
        res.status(200).json({
            status: 'success',
            data: response.data
        });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({
                status: 'error',
                message: error.response.data,
            });
        } else if (error.request) {
            res.status(500).json({
                status: 'error',
                message: 'No response received from Tap API',
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }
});
