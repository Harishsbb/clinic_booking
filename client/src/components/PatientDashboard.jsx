import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserAppointments, getDoctors } from '../services/api';
import Button from './ui/Button';
import Card from './ui/Card';

const PatientDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('name') || 'Patient';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const doctorsRes = await getDoctors();
                setDoctors(doctorsRes.data.slice(0, 4)); // Show top 4 doctors

                if (userId) {
                    const appointmentsRes = await getUserAppointments(userId);
                    setAppointments(appointmentsRes.data);
                }
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-heading">Welcome, {userName}</h1>
                        <p className="text-gray-500 mt-2">Manage your health and appointments.</p>
                    </div>
                    <Link to="/booking">
                        <Button size="lg">Book New Appointment</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Appointments Section */}
                    <Card className="lg:col-span-2 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 font-heading">My Appointments</h2>
                        {loading ? (
                            <p>Loading appointments...</p>
                        ) : appointments.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">You have no upcoming appointments.</p>
                                <Link to="/booking">
                                    <Button variant="outline">Book Now</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-gray-400 text-sm border-b border-gray-100">
                                            <th className="pb-4 font-medium pl-2">Doctor</th>
                                            <th className="pb-4 font-medium">Date & Time</th>
                                            <th className="pb-4 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {appointments.map((apt) => (
                                            <tr key={apt._id} className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors">
                                                <td className="py-4 pl-2 font-medium text-gray-700">
                                                    {apt.doctor ? apt.doctor.name : 'Unknown Doctor'}
                                                </td>
                                                <td className="py-4 text-gray-500">
                                                    {new Date(apt.date).toLocaleString()}
                                                </td>
                                                <td className="py-4">
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                        Upcoming
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>

                    {/* Recommended Doctors Section */}
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 font-heading">Recommended Doctors</h2>
                            <Link to="/doctors" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</Link>
                        </div>
                        {loading ? (
                            <p>Loading doctors...</p>
                        ) : (
                            <div className="space-y-6">
                                {doctors.map((doctor) => (
                                    <div key={doctor._id} className="flex items-center gap-4 p-3 bg-gray-50/50 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 transition-all duration-200 group">
                                        <div className="h-12 w-12 rounded-full bg-white border-2 border-primary-100 text-primary-600 flex-shrink-0 flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                                            {doctor.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-gray-900 font-bold truncate">{doctor.name}</h4>
                                            <p className="text-sm text-gray-500 truncate">{doctor.specialization || 'General'}</p>
                                        </div>
                                        <Link to="/booking" state={{ doctorId: doctor._id }}>
                                            <Button size="sm" variant="outline" className="whitespace-nowrap border-primary-200 text-primary-700 hover:bg-primary-50">Book</Button>
                                        </Link>
                                    </div>
                                ))}
                                {doctors.length === 0 && <p className="text-gray-500 text-sm">No doctors available.</p>}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
