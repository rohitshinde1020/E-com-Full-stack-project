const axios = require('axios');

/**
 * CAPTCHA Verification Middleware
 * Validates Google reCAPTCHA v3 token received from frontend
 */
const verifyCaptcha = async (req, res, next) => {
    try {
        const { captchaToken } = req.body;

        // Check if captcha token exists
        if (!captchaToken) {
            return res.status(400).json({
                success: false,
                message: 'CAPTCHA token is missing. Please complete the CAPTCHA verification.'
            });
        }

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;

        if (!secretKey) {
            console.error('RECAPTCHA_SECRET_KEY is not configured');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error. CAPTCHA verification is not properly configured.'
            });
        }

        // Verify token with Google reCAPTCHA API
        const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
            {
                params: {
                    secret: secretKey,
                    response: captchaToken
                }
            }
        );

        const { success, score, action, challenge_ts, hostname, error_codes } = response.data;

        // Check if verification was successful
        if (!success) {
            console.warn('CAPTCHA verification failed:', {
                error_codes,
                action,
                score,
                hostname
            });

            return res.status(400).json({
                success: false,
                message: 'CAPTCHA verification failed. Please try again.',
                errors: error_codes
            });
        }

        // For reCAPTCHA v3, check the score (0.0 to 1.0)
        // Score of 1.0 is very likely a legitimate interaction, 0.0 is very likely a bot
        const scoreThreshold = parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD) || 0.5;

        if (score < scoreThreshold) {
            console.warn('CAPTCHA score too low:', {
                score,
                threshold: scoreThreshold,
                action,
                hostname
            });

            return res.status(400).json({
                success: false,
                message: 'CAPTCHA verification failed. Suspicious activity detected. Please try again.'
            });
        }

        // Verification successful - attach data to request for later use
        req.captchaData = {
            success: true,
            score,
            action,
            challenge_ts,
            hostname
        };

        next();
    } catch (error) {
        console.error('CAPTCHA verification error:', error.message);

        // Differentiate between network errors and validation errors
        if (error.response?.status) {
            return res.status(500).json({
                success: false,
                message: 'CAPTCHA service error. Please try again later.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'An error occurred during CAPTCHA verification.'
        });
    }
};

module.exports = verifyCaptcha;
