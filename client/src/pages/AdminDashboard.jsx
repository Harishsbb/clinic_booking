import React, { useEffect, useState } from 'react';
import api, { createDoctor, updateDoctor, deleteDoctor, getAllAppointments, deleteAppointment, updateAppointment } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { FaUserMd, FaUserInjured, FaCalendarCheck, FaEdit, FaTrash } from 'react-icons/fa';
import { isSlotAvailable } from '../utils/availabilityValidator';

const AdminDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentDoctorId, setCurrentDoctorId] = useState(null);
    const [newDoctor, setNewDoctor] = useState({
        name: 'Dr. ',
        initial: '',
        specialty: '',
        fee: '',
        image: '',
        bio: '',
        availability: ''
    });
    const [editAppointment, setEditAppointment] = useState(null);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [appointmentForm, setAppointmentForm] = useState({ date: '', status: '' });
    const [slotBuilder, setSlotBuilder] = useState({
        fromDay: 'Mon',
        toDay: '',
        startH: '1',
        startM: '00',
        startAmpm: 'am',
        endH: '1',
        endM: '00',
        endAmpm: 'pm'
    });

    const handleBuilderChange = (e) => {
        setSlotBuilder({ ...slotBuilder, [e.target.name]: e.target.value });
    };

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
                availability: newDoctor.availability.split(',').map(item => item.trim()).filter(item => item)
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
            initial: doctor.initial || '',
            email: doctor.email || '',
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

    const handleDeleteAppointment = async (id) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            try {
                await deleteAppointment(id);
                // Optimistic update or refetch
                setAppointments(appointments.filter(a => a._id !== id));
                alert('Appointment deleted');
            } catch (err) {
                console.error(err);
                alert('Failed to delete appointment');
            }
        }
    };

    const handleEditAppointment = (apt) => {
        setEditAppointment(apt);
        // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
        const dateObj = new Date(apt.date);
        // adjust for timezone offset if necessary or use ISO string slice, but simple way:
        const localIso = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

        setAppointmentForm({
            date: localIso,
            status: apt.status
        });
        setShowAppointmentModal(true);
    };

    const handleUpdateAppointment = async (e) => {
        e.preventDefault();
        try {
            // Validate in Admin Dashboard if doctor info is available
            if (editAppointment && editAppointment.doctor && editAppointment.doctor.availability) {
                const isValid = isSlotAvailable(appointmentForm.date, editAppointment.doctor.availability);
                if (!isValid) {
                    if (!window.confirm(`Warning: The selected time is outside the doctor's availability (${editAppointment.doctor.availability.join(', ')}). Continue anyway?`)) {
                        return;
                    }
                }
            }

            await updateAppointment(editAppointment._id, {
                date: appointmentForm.date,
                status: appointmentForm.status
            });
            alert('Appointment updated');
            setShowAppointmentModal(false);
            setEditAppointment(null);
            fetchData(); // Refetch to show changes
        } catch (err) {
            console.error(err);
            alert('Failed to update appointment');
        }
    };

    const resetForm = () => {
        setNewDoctor({ name: 'Dr. ', initial: '', email: '', specialty: '', fee: '', image: '', bio: '', availability: '' });
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
                                        <th className="pb-4 font-medium">Amount</th>
                                        <th className="pb-4 font-medium">Date & Time</th>
                                        <th className="pb-4 font-medium">Status</th>
                                        <th className="pb-4 font-medium text-right pr-2">Actions</th>
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
                                            <td className="py-4 text-gray-900 font-bold">
                                                ₹{apt.doctor ? apt.doctor.fee : '-'}
                                            </td>
                                            <td className="py-4 text-gray-500">
                                                {new Date(apt.date).toLocaleString()}
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                    apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-green-100 text-green-800'
                                                    }`}>
                                                    {apt.status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right pr-2">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => handleEditAppointment(apt)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                        title="Edit Appointment"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAppointment(apt._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                        title="Delete Appointment"
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
                                        <td className="py-4 font-medium text-gray-700">
                                            {doctor.name.startsWith('Dr.')
                                                ? `Dr. ${doctor.initial ? doctor.initial + '.' : ''} ${doctor.name.replace('Dr.', '').trim()}`
                                                : `${doctor.initial ? doctor.initial + '.' : ''} ${doctor.name}`}
                                        </td>
                                        <td className="py-4 text-gray-500">{doctor.specialty}</td>
                                        <td className="py-4 text-gray-900 font-bold">₹{doctor.fee}</td>
                                        <td className="py-4 text-gray-500">
                                            {doctor.availability && doctor.availability.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {doctor.availability.filter(Boolean).map((slot, i) => (
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
                                label="Initial"
                                name="initial"
                                value={newDoctor.initial || ''}
                                onChange={handleInputChange}
                                placeholder="K"
                            />
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={newDoctor.email || ''}
                                onChange={handleInputChange}
                                placeholder="doctor@clinic.com"
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Duty Time (Availability)</label>

                                {/* Availability Builder */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-2">
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        <div>
                                            <span className="text-xs text-gray-500 block mb-1">From Day</span>
                                            <select
                                                name="fromDay"
                                                value={slotBuilder.fromDay}
                                                onChange={handleBuilderChange}
                                                className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                            >
                                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500 block mb-1">To Day (Optional)</span>
                                            <select
                                                name="toDay"
                                                value={slotBuilder.toDay}
                                                onChange={handleBuilderChange}
                                                className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                            >
                                                <option value="">-</option>
                                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <span className="text-xs text-gray-500 block mb-1">Start Time</span>
                                            <div className="flex gap-1">
                                                <select name="startH" value={slotBuilder.startH} onChange={handleBuilderChange} className="w-full text-sm border-gray-300 rounded-md p-1">
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => <option key={h} value={h}>{h}</option>)}
                                                </select>
                                                <select name="startM" value={slotBuilder.startM} onChange={handleBuilderChange} className="w-full text-sm border-gray-300 rounded-md p-1">
                                                    {['00', '15', '30', '45'].map(m => <option key={m} value={m}>{m}</option>)}
                                                </select>
                                                <select name="startAmpm" value={slotBuilder.startAmpm} onChange={handleBuilderChange} className="w-full text-sm border-gray-300 rounded-md p-1">
                                                    <option value="am">AM</option>
                                                    <option value="pm">PM</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500 block mb-1">End Time</span>
                                            <div className="flex gap-1">
                                                <select name="endH" value={slotBuilder.endH} onChange={handleBuilderChange} className="w-full text-sm border-gray-300 rounded-md p-1">
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => <option key={h} value={h}>{h}</option>)}
                                                </select>
                                                <select name="endM" value={slotBuilder.endM} onChange={handleBuilderChange} className="w-full text-sm border-gray-300 rounded-md p-1">
                                                    {['00', '15', '30', '45'].map(m => <option key={m} value={m}>{m}</option>)}
                                                </select>
                                                <select name="endAmpm" value={slotBuilder.endAmpm} onChange={handleBuilderChange} className="w-full text-sm border-gray-300 rounded-md p-1">
                                                    <option value="am">AM</option>
                                                    <option value="pm">PM</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const { fromDay, toDay, startH, startM, startAmpm, endH, endM, endAmpm } = slotBuilder;

                                            const dayString = toDay && toDay !== fromDay ? `${fromDay}-${toDay}` : fromDay;
                                            const timeString = `${startH}:${startM}${startAmpm}-${endH}:${endM}${endAmpm}`;
                                            const newSlot = `${dayString} ${timeString}`;

                                            setNewDoctor(prev => {
                                                const currentSlots = prev.availability ? prev.availability.split(', ').filter(Boolean) : [];
                                                const updatedSlots = [...currentSlots, newSlot];
                                                return { ...prev, availability: updatedSlots.join(', ') };
                                            });
                                        }}
                                    >
                                        Add Slot
                                    </button>
                                </div>

                                {/* Active Slots List */}
                                <div className="space-y-2">
                                    {newDoctor.availability && newDoctor.availability.split(', ').filter(Boolean).map((slot, index) => (
                                        <div key={index} className="flex justify-between items-center bg-blue-50 px-3 py-2 rounded text-sm text-blue-700">
                                            <span>{slot}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const slots = newDoctor.availability.split(', ').filter(Boolean);
                                                    const newSlots = slots.filter((_, i) => i !== index);
                                                    setNewDoctor({ ...newDoctor, availability: newSlots.join(', ') });
                                                }}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))}
                                    {(!newDoctor.availability) && <p className="text-xs text-gray-500 italic">No availability slots added yet.</p>}
                                </div>
                            </div>
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

            {/* Edit Appointment Modal */}
            {showAppointmentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md p-6 bg-white">
                        <h3 className="text-xl font-bold mb-4 font-heading">Edit Appointment</h3>
                        <form onSubmit={handleUpdateAppointment} className="space-y-4">
                            <div className="mb-4 space-y-2 bg-gray-50 p-3 rounded-md border border-gray-100">
                                <p className="text-sm text-gray-600"><span className="font-semibold">Patient:</span> {editAppointment?.user?.name || 'Unknown'}</p>
                                <p className="text-sm text-gray-600"><span className="font-semibold">Doctor:</span> {editAppointment?.doctor?.name || 'Unknown'}</p>
                            </div>
                            <Input
                                type="datetime-local"
                                label="Date & Time"
                                value={appointmentForm.date}
                                onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={appointmentForm.status}
                                    onChange={(e) => setAppointmentForm({ ...appointmentForm, status: e.target.value })}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button type="button" variant="ghost" onClick={() => setShowAppointmentModal(false)}>Cancel</Button>
                                <Button type="submit">Update Appointment</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
