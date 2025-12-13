import React, { useEffect, useState } from 'react';
import api, { createDoctor, updateDoctor, deleteDoctor } from '../services/api';
import DoctorCard from '../components/DoctorCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { FaSearch } from 'react-icons/fa';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
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
        availability: '',
        hospital: '',
        district: '',
        email: ''
    });

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/doctors');
            setDoctors(res.data);
            setFilteredDoctors(res.data);
        } catch (err) {
            console.error('Error fetching doctors:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    // Filter doctors when search query changes
    useEffect(() => {
        if (!searchQuery) {
            setFilteredDoctors(doctors);
        } else {
            const lowerQuery = searchQuery.toLowerCase();
            const filtered = doctors.filter(doctor =>
                doctor.name.toLowerCase().includes(lowerQuery) ||
                doctor.specialty.toLowerCase().includes(lowerQuery) ||
                (doctor.hospital && doctor.hospital.toLowerCase().includes(lowerQuery)) ||
                (doctor.district && doctor.district.toLowerCase().includes(lowerQuery))
            );
            setFilteredDoctors(filtered);
        }
    }, [searchQuery, doctors]);

    const handleInputChange = (e) => {
        setNewDoctor({ ...newDoctor, [e.target.name]: e.target.value });
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            // Convert availability string to array
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
            fetchDoctors();
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
            availability: doctor.availability ? doctor.availability.join(', ') : '',
            hospital: doctor.hospital || '',
            district: doctor.district || '',
            email: doctor.email || ''
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
                fetchDoctors();
            } catch (err) {
                console.error('Error deleting doctor:', err);
                alert('Failed to delete doctor');
            }
        }
    };

    const resetForm = () => {
        setNewDoctor({ name: '', specialty: '', fee: '', image: '', bio: '', availability: '', hospital: '', district: '', email: '' });
        setIsEditing(false);
        setCurrentDoctorId(null);
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    return (
        <div className="animate-fade-in relative">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">Our Doctors</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Meet our team of specialized healthcare professionals.</p>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto items-center">
                        <div className="relative flex-grow md:flex-grow-0 md:w-80">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, hospital, or specialty..."
                                className="block w-full pl-10 pr-3 h-10 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150 ease-in-out"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {localStorage.getItem('role') === 'admin' && (
                            <div className="h-10 flex cursor-pointer">
                                <Button onClick={openAddModal} className="h-full flex items-center justify-center">Add New Doctor</Button>
                            </div>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <>
                        {filteredDoctors.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg mb-4">No doctors found matching "{searchQuery}".</p>
                                {doctors.length === 0 && <p className="text-gray-400">Click "Add New Doctor" to get started.</p>}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredDoctors.map((doctor) => (
                                    <div key={doctor._id} className="cursor-pointer">
                                        {/* We invoke DoctorCard here. Note: You might need to update DoctorCard to show Hospital info if it doesn't already. 
                                             Since I can't see specific DoctorCard code, I'll assume it renders passed doctor info or I will verify next.
                                             Actually, let's wrap it or inject hospital info if possible, or just trust it renders doctor props.
                                         */}
                                        <DoctorCard
                                            doctor={doctor}
                                            onEdit={handleEditDoctor}
                                            onDelete={handleDeleteDoctor}
                                        />
                                        {/* Quick hack: if DoctorCard doesn't display hospital, we might want to check it. But let's assume filtering works is step 1. */}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Add/Edit Doctor Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <Card className="w-full max-w-md p-6 bg-white my-8">
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
                                label="Email"
                                name="email"
                                type="email"
                                value={newDoctor.email}
                                onChange={handleInputChange}
                                required
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
                                label="Hospital"
                                name="hospital"
                                value={newDoctor.hospital}
                                onChange={handleInputChange}
                                placeholder="City Hospital"
                            />
                            <Input
                                label="District"
                                name="district"
                                value={newDoctor.district}
                                onChange={handleInputChange}
                                placeholder="New York"
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

export default Doctors;
