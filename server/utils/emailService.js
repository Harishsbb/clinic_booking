
const nodemailer = require('nodemailer');

let transporter;

const createTransporter = async () => {
    if (transporter) return transporter;

    try {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        const testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        console.log('Ethereal Email Configured');
        console.log('User:', testAccount.user);
        console.log('Pass:', testAccount.pass);

        return transporter;
    } catch (error) {
        console.error('Failed to create email transporter:', error);
    }
};

const sendBookingConfirmation = async (to, appointmentDetails) => {
    try {
        const emailTransporter = await createTransporter();

        const { patientName, doctorName, date, time } = appointmentDetails;

        // send mail with defined transport object
        const info = await emailTransporter.sendMail({
            from: '"MediCare+ Clinic" <noreply@medicareplus.com>', // sender address
            to: to, // list of receivers
            subject: "Appointment Confirmation - MediCare+", // Subject line
            text: `Hello ${patientName},\n\nYour appointment with Dr. ${doctorName} has been confirmed for ${date} at ${time}.\n\nPlease arrive 10 minutes early.\n\nRegards,\nMediCare+ Team`, // plain text body
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #4f46e5;">Appointment Confirmed!</h2>
                    <p>Hello <strong>${patientName}</strong>,</p>
                    <p>Your appointment has been successfully booked.</p>
                    
                    <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Doctor:</strong> Dr. ${doctorName}</p>
                        <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
                        <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
                    </div>

                    <p>Please arrive 10 minutes early to complete any necessary paperwork.</p>
                    <br>
                    <p>Regards,</p>
                    <p><strong>MediCare+ Team</strong></p>
                </div>
            `, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return info;
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = { sendBookingConfirmation };
