import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCreditCard, FaLock, FaMobileAlt } from 'react-icons/fa';
import { makePayment } from '../services/api';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' or 'card'
    const [formData, setFormData] = useState({
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        upiId: '',
    });
    const [loading, setLoading] = useState(false);
    const [fee, setFee] = useState(100);

    useEffect(() => {
        if (location.state?.fee) {
            setFee(location.state.fee);
        }
    }, [location.state]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (paymentMethod === 'card') {
            if (!formData.cardNumber || !formData.cvv || !formData.expiryDate) {
                alert('Please fill in all card details');
                return;
            }
        }

        setLoading(true);
        try {
            // In a real app, you'd send paymentMethod along with data
            await makePayment({ ...formData, method: paymentMethod, amount: fee });
            alert(`Payment of ₹${fee} Processed Successfully via ${paymentMethod === 'card' ? 'Credit Card' : 'UPI'}!`);
            navigate('/dashboard');
        } catch (err) {
            console.error('Payment failed:', err);
            alert('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="mb-6 p-4 bg-primary-50 rounded-lg flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Total Amount to Pay</span>
                    <span className="text-2xl font-bold text-primary-700">₹{fee}</span>
                </div>

                {/* Payment Method Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === 'upi'
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                            }`}
                    >
                        <FaMobileAlt />
                        <span className="font-medium">UPI</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === 'card'
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                            }`}
                    >
                        <FaCreditCard />
                        <span className="font-medium">Credit Card</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {paymentMethod === 'card' ? (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-700">Card Information</h3>
                                <FaLock className="text-gray-400" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                                <input
                                    type="text"
                                    name="cardName"
                                    placeholder="John Doe"
                                    value={formData.cardName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                <input
                                    type="text"
                                    name="cardNumber"
                                    placeholder="0000 0000 0000 0000"
                                    value={formData.cardNumber}
                                    onChange={handleChange}
                                    required
                                    maxLength="19"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                    <input
                                        type="text"
                                        name="expiryDate"
                                        placeholder="MM/YY"
                                        value={formData.expiryDate}
                                        onChange={handleChange}
                                        required
                                        maxLength="5"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                    <input
                                        type="text"
                                        name="cvv"
                                        placeholder="123"
                                        value={formData.cvv}
                                        onChange={handleChange}
                                        required
                                        maxLength="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-700">UPI Payment</h3>
                                <FaMobileAlt className="text-gray-400" />
                            </div>

                            {/* Scan and Pay Section */}
                            <div className="flex flex-col items-center justify-center mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                                <p className="text-sm font-medium text-gray-600 mb-3">Scan & Pay</p>
                                <div className="bg-white p-2 rounded shadow-sm mb-3">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=bavaharishkumar-9@okaxis&pn=Clinic Booking&am=${fee}&cu=INR`)}`}
                                        alt="UPI QR Code"
                                        className="w-32 h-32"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">UPI ID: <span className="font-mono font-medium text-gray-700">bavaharishkumar-9@okaxis</span></p>
                            </div>

                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OR ENTER UPI ID</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                                <input
                                    type="text"
                                    name="upiId"
                                    placeholder="username@bank"
                                    value={formData.upiId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                                />
                                <p className="text-xs text-gray-500 mt-2">Enter your Virtual Payment Address (VPA)</p>
                            </div>
                        </>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                <>
                                    <FaLock className="text-sm" />
                                    Pay ₹{fee} Now
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Payment;
