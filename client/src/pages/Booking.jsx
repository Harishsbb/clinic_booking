import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking, getDoctors } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { isSlotAvailable } from '../utils/availabilityValidator';

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        doctorId: '',
        date: '',
    });
    const [fee, setFee] = useState(100); // Default fee
    const [loading, setLoading] = useState(false);
    const [doctorAvailability, setDoctorAvailability] = useState([]);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctorsData = async () => {
            try {
                const res = await getDoctors();
                setDoctors(res.data);
            } catch (err) {
                console.error("Failed to fetch doctors", err);
            }
        };
        fetchDoctorsData();
    }, []);

    useEffect(() => {
        if (location.state?.doctorId) {
            setFormData(prev => ({ ...prev, doctorId: location.state.doctorId }));
        }
        if (location.state?.fee) {
            setFee(location.state.fee);
        }
        if (location.state?.availability) {
            setDoctorAvailability(location.state.availability);
        }
    }, [location.state]);

    // Update fee and availability when doctorId changes (e.g. manual entry or after fetch)
    useEffect(() => {
        if (formData.doctorId && doctors.length > 0) {
            // Find doctor by docId (assuming input is docId) or _id
            // The input placeholder says "Enter Doctor ID", usually people enter the visible ID (docId)
            // But let's check both or stick to docId as per DoctorCard display
            const doctor = doctors.find(d =>
                String(d.docId) === String(formData.doctorId) ||
                d._id === formData.doctorId
            );

            if (doctor) {
                setFee(doctor.fee || 100);
                setDoctorAvailability(doctor.availability || []);
            }
        }
    }, [formData.doctorId, doctors]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Get userId from localStorage
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('Please login to book an appointment');
                navigate('/login');
                return;
            }

            // Validate Availability
            if (doctorAvailability && doctorAvailability.length > 0) {
                const isValid = isSlotAvailable(formData.date, doctorAvailability);
                if (!isValid) {
                    alert(`Doctor is not available at this time. Available: ${doctorAvailability.join(', ')}`);
                    setLoading(false);
                    return;
                }
            }

            await createBooking({ ...formData, userId });
            alert('Appointment booked successfully! Proceeding to payment.');
            navigate('/payment', { state: { fee } });
        } catch (err) {
            console.error('Error booking appointment:', err);
            alert('Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10 text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 font-heading tracking-tight">Book Appointment</h2>
                    <p className="text-lg text-gray-600 mt-2">Schedule a consultation with one of our expert specialists.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-primary-600 px-8 py-6">
                        <h3 className="text-white text-xl font-bold">Appointment Details</h3>
                        <p className="text-primary-100 text-sm mt-1">Please fill in the information below to secure your slot.</p>
                    </div>

                    <form className="p-8 space-y-8" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor ID / Reference</label>
                                <div className="relative rounded-md shadow-sm">
                                    <Input
                                        id="doctorId"
                                        name="doctorId"
                                        placeholder="Enter Doctor ID"
                                        value={formData.doctorId}
                                        onChange={handleChange}
                                        required
                                        readOnly={!!location.state?.doctorId}
                                        className={location.state?.doctorId ? "bg-gray-50" : ""}
                                    />
                                    {location.state?.doctorId && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">Locked</span>
                                        </div>
                                    )}
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                    {location.state?.doctorId
                                        ? "You selected this doctor from the list."
                                        : "Enter the ID of the doctor you wish to see."}
                                </p>
                            </div>

                            {doctorAvailability && doctorAvailability.length > 0 && (
                                <div className="sm:col-span-6 bg-blue-50 p-5 rounded-lg border border-blue-100">
                                    <h4 className="text-sm font-bold text-blue-800 mb-3 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" /></svg>
                                        Doctor's Availability
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {doctorAvailability.map((slot, index) => (
                                            <span key={index} className="px-3 py-1 bg-white text-blue-700 text-xs font-semibold rounded-full border border-blue-200 shadow-sm">
                                                {slot}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-xs text-blue-600 mt-3 font-medium">Please select a time within these slots.</p>
                                </div>
                            )}

                            <div className="sm:col-span-6">
                                <Input
                                    id="date"
                                    name="date"
                                    type="datetime-local"
                                    label="Desired Date & Time"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
                            <Button
                                type="submit"
                                className="w-full sm:w-auto px-8 py-3 text-lg"
                                size="lg"
                                isLoading={loading}
                            >
                                Confirm Booking
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Booking;
