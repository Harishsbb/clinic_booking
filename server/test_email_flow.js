
const { sendBookingConfirmation } = require('./utils/emailService');

const testEmail = async () => {
    console.log('Sending test email...');
    await sendBookingConfirmation('test@example.com', {
        patientName: 'Test Patient',
        doctorName: 'Test Doctor',
        date: '12/12/2025',
        time: '10:00 AM'
    });
    console.log('Test complete.');
};

testEmail();
