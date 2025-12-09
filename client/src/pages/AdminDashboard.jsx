import React, { useEffect, useState } from 'react';
import api, { createDoctor, updateDoctor, deleteDoctor, getAllAppointments } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { FaUserMd, FaUserInjured, FaCalendarCheck, FaEdit, FaTrash } from 'react-icons/fa';

const AdminDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentDoctorId, setCurrentDoctorId] = useState(null);
    const [newDoctor, setNewDoctor] = useState({
        name: '',
        specialty: '',
        fee: '',
        image: '',
        bio: '',
        availability: ''
    });

    const fetchData = async () => {
        try {
            const [doctorsRes, appointmentsRes] = await Promise.all([
                api.get('/doctors'),
                getAllAppointments()
            ]);
            setDoctors(doctorsRes.data);
            setAppointments(appointmentsRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        setNewDoctor({ ...newDoctor, [e.target.name]: e.target.value });
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            const doctorData = {
                ...newDoctor,
                availability: newDoctor.availability.split(',').map(item => item.trim())
            };

            if (isEditing) {
                await updateDoctor(currentDoctorId, doctorData);
                alert('Doctor updated successfully!');
            } else {
                await createDoctor(doctorData);
                alert('Doctor added successfully!');
            }
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (err) {
            console.error('Error saving doctor:', err);
            alert('Failed to save doctor');
        }
    };

    const handleEditDoctor = (doctor) => {
        setNewDoctor({
            name: doctor.name,
            specialty: doctor.specialty,
            fee: doctor.fee,
            image: doctor.image || '',
            bio: doctor.bio || '',
            availability: doctor.availability ? doctor.availability.join(', ') : ''
        });
        setCurrentDoctorId(doctor._id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDeleteDoctor = async (id) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                await deleteDoctor(id);
                alert('Doctor deleted successfully');
                fetchData();
            } catch (err) {
                console.error('Error deleting doctor:', err);
                alert('Failed to delete doctor');
            }
        }
    };

    const resetForm = () => {
        setNewDoctor({ name: '', specialty: '', fee: '', image: '', bio: '', availability: '' });
        setIsEditing(false);
        setCurrentDoctorId(null);
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    return (
        <div className="animate-fade-in">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 font-heading">Admin Dashboard</h2>
                        <p className="text-gray-500 mt-2">Manage doctors and view hospital statistics.</p>
                    </div>
                    <Button onClick={openAddModal}>Add New Doctor</Button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 flex items-center gap-4 border-l-4 border-blue-500">
                        <div className="p-4 rounded-full bg-blue-100 text-blue-600">
                            <FaUserMd className="text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Doctors</p>
                            <h3 className="text-2xl font-bold text-gray-900">{doctors.length}</h3>
                        </div>
                    </Card>
                    <Card className="p-6 flex items-center gap-4 border-l-4 border-green-500">
                        <div className="p-4 rounded-full bg-green-100 text-green-600">
                            <FaUserInjured className="text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Patients</p>
                            <h3 className="text-2xl font-bold text-gray-900">{new Set(appointments.map(a => a.user?._id)).size}</h3>
                        </div>
                    </Card>
                    <Card className="p-6 flex items-center gap-4 border-l-4 border-purple-500">
                        <div className="p-4 rounded-full bg-purple-100 text-purple-600">
                            <FaCalendarCheck className="text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Appointments</p>
                            <h3 className="text-2xl font-bold text-gray-900">{appointments.length}</h3>
                        </div>
                    </Card>
                </div>

                {/* Appointments Table */}
                <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 font-heading">Recent Appointments</h3>
                    {appointments.length === 0 ? (
                        <p className="text-gray-500">No appointments found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-400 text-sm border-b border-gray-100">
                                        <th className="pb-4 font-medium pl-2">Patient Name</th>
                                        <th className="pb-4 font-medium">Doctor</th>
                                        <th className="pb-4 font-medium">Date & Time</th>
                                        <th className="pb-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {appointments.map((apt) => (
                                        <tr key={apt._id} className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors">
                                            <td className="py-4 pl-2 font-medium text-gray-700">
                                                {apt.user ? apt.user.name : 'Unknown Patient'}
                                            </td>
                                            <td className="py-4 text-gray-600">
                                                {apt.doctor ? apt.doctor.name : 'Unknown Doctor'}
                                            </td>
                                            <td className="py-4 text-gray-500">
                                                {new Date(apt.date).toLocaleString()}
                                            </td>
                                            <td className="py-4">
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    Confirmed
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                {/* Doctors Table */}
                <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 font-heading">Manage Doctors</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-400 text-sm border-b border-gray-100">
                                    <th className="pb-4 font-medium pl-2">ID</th>
                                    <th className="pb-4 font-medium">Name</th>
                                    <th className="pb-4 font-medium">Specialty</th>
                                    <th className="pb-4 font-medium">Fee</th>
                                    <th className="pb-4 font-medium">Availability</th>
                                    <th className="pb-4 font-medium text-right pr-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {doctors.map((doctor) => (
                                    <tr key={doctor._id} className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors">
                                        <td className="py-4 pl-2 text-gray-500">#{doctor.docId}</td>
                                        <td className="py-4 font-medium text-gray-700">{doctor.name}</td>
                                        <td className="py-4 text-gray-500">{doctor.specialty}</td>
                                        <td className="py-4 text-gray-900 font-bold">₹{doctor.fee}</td>
                                        <td className="py-4 text-gray-500">
                                            {doctor.availability && doctor.availability.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {doctor.availability.map((slot, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">
                                                            {slot}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">Not set</span>
                                            )}
                                        </td>
                                        <td className="py-4 text-right pr-2">
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => handleEditDoctor(doctor)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDoctor(doctor._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Add/Edit Doctor Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md p-6 bg-white">
                        <h3 className="text-xl font-bold mb-4 font-heading">{isEditing ? 'Edit Doctor' : 'Add New Doctor'}</h3>
                        <form onSubmit={handleAddDoctor} className="space-y-4">
                            <Input
                                label="Name"
                                name="name"
                                value={newDoctor.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Dr. John Doe"
                            />
                            <Input
                                label="Specialty"
                                name="specialty"
                                value={newDoctor.specialty}
                                onChange={handleInputChange}
                                required
                                placeholder="Cardiology"
                            />
                            <Input
                                label="Consultation Fee (₹)"
                                name="fee"
                                type="number"
                                value={newDoctor.fee}
                                onChange={handleInputChange}
                                required
                                min="0"
                                placeholder="100"
                            />
                            <Input
                                label="Image URL"
                                name="image"
                                value={newDoctor.image || ''}
                                onChange={handleInputChange}
                                placeholder="https://example.com/doctor.jpg"
                            />
                            <Input
                                label="Duty Time (Availability)"
                                name="availability"
                                value={newDoctor.availability || ''}
                                onChange={handleInputChange}
                                placeholder="e.g., Mon-Fri 9am-5pm, Sat 10am-2pm"
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea
                                    name="bio"
                                    value={newDoctor.bio}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                    rows="3"
                                    placeholder="Short bio..."
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit">{isEditing ? 'Update Doctor' : 'Save Doctor'}</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
