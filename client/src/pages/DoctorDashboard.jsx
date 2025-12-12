
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { FaUserInjured, FaCalendarCheck, FaClock } from 'react-icons/fa';

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const doctorName = localStorage.getItem('name');
    const doctorId = localStorage.getItem('doctorId');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                // Fetch appointments for this specific doctor
                // Note: We need to ensure the backend supports filtering by doctor ID in the query or body
                // For now, assuming GET /api/appointments?doctorId=... works or we filter client side if needed (not ideal for prod)
                // Let's assume we updated the backend to handle ?doctorId query param as per plan
                console.log("Fetching appointments for Doctor ID:", doctorId);
                const res = await API.get(`/appointments?doctorId=${doctorId}`);
                setAppointments(res.data);
            } catch (err) {
                console.error("Error fetching appointments", err);
            } finally {
                setLoading(false);
            }
        };

        if (!doctorId) {
            navigate('/doctor/login');
        } else {
            fetchAppointments();
        }
    }, [doctorId, navigate]);

    const handleStatusUpdate = async (id, status) => {
        try {
            await API.put(`/appointments/${id}/status`, { status });
            setAppointments(appointments.map(apt => apt._id === id ? { ...apt, status } : apt));
        } catch (err) {
            console.error("Error updating status", err);
            alert("Failed to update status");
        }
    };

    return (
        <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-heading">Welcome, {doctorName}</h1>
                    <p className="text-gray-500 mt-2">Here is your schedule for today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 flex items-center gap-4 border-l-4 border-blue-500 bg-white/80 backdrop-blur-md">
                        <div className="p-4 rounded-full bg-blue-100 text-blue-600">
                            <FaCalendarCheck className="text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Appointments</p>
                            <h3 className="text-2xl font-bold text-gray-900">{appointments.length}</h3>
                        </div>
                    </Card>
                    <Card className="p-6 flex items-center gap-4 border-l-4 border-green-500 bg-white/80 backdrop-blur-md">
                        <div className="p-4 rounded-full bg-green-100 text-green-600">
                            <FaUserInjured className="text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Unique Patients</p>
                            <h3 className="text-2xl font-bold text-gray-900">{new Set(appointments.map(a => a.user?._id)).size}</h3>
                        </div>
                    </Card>
                    <Card className="p-6 flex items-center gap-4 border-l-4 border-purple-500 bg-white/80 backdrop-blur-md">
                        <div className="p-4 rounded-full bg-purple-100 text-purple-600">
                            <FaClock className="text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Coming Up</p>
                            <h3 className="text-2xl font-bold text-gray-900">{appointments.filter(a => new Date(a.date) > new Date() && a.status !== 'completed' && a.status !== 'cancelled').length}</h3>
                        </div>
                    </Card>
                </div>

                <Card className="p-6 bg-white/90 backdrop-blur-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 font-heading">My Appointments</h2>
                    {loading ? (
                        <p>Loading schedule...</p>
                    ) : appointments.length === 0 ? (
                        <p className="text-gray-500">No appointments found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-400 text-sm border-b border-gray-100">
                                        <th className="pb-4 font-medium pl-2">Patient Name</th>
                                        <th className="pb-4 font-medium">Date & Time</th>
                                        <th className="pb-4 font-medium">Contact</th>
                                        <th className="pb-4 font-medium">Status</th>
                                        <th className="pb-4 font-medium text-right pr-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {appointments.map((apt) => (
                                        <tr key={apt._id} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 pl-2 font-medium text-gray-700">
                                                {apt.user ? apt.user.name : 'Unknown Patient'}
                                            </td>
                                            <td className="py-4 text-gray-600">
                                                {new Date(apt.date).toLocaleString()}
                                                {apt.status === 'completed' && apt.visitedAt && (
                                                    <div className="text-xs text-green-600 font-medium mt-1">
                                                        Visited: {new Date(apt.visitedAt).toLocaleString()}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4 text-gray-500">
                                                {apt.user?.email || 'N/A'}
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                                    apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-green-100 text-green-700'
                                                    }`}>
                                                    {apt.status || 'Confirmed'}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right pr-2">
                                                {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleStatusUpdate(apt._id, 'completed')}
                                                            className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase"
                                                        >
                                                            Complete
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(apt._id, 'cancelled')}
                                                            className="text-red-600 hover:text-red-800 text-xs font-bold uppercase"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default DoctorDashboard;
