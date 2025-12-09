
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHospitalById, getDoctors } from '../services/api';
import Card from '../components/ui/Card';
import DoctorCard from '../components/DoctorCard';
import { FaStar, FaMapMarkerAlt, FaPhone, FaClock, FaArrowLeft } from 'react-icons/fa';

const HospitalDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hospital, setHospital] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const hospitalRes = await getHospitalById(id);
                setHospital(hospitalRes.data);

                // Assuming hospital.name matches the doctor's 'hospital' field
                const doctorsRes = await getDoctors({ hospital: hospitalRes.data.name });
                setDoctors(doctorsRes.data);
            } catch (err) {
                console.error('Error fetching details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!hospital) {
        return <div className="text-center py-20">Hospital not found</div>;
    }

    return (
        <div className="animate-fade-in max-w-7xl mx-auto px-4 pb-12">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 transition-colors">
                <FaArrowLeft /> Back to Hospitals
            </button>

            {/* Hospital Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 mb-10 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">{hospital.name}</h1>
                            <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">{hospital.type}</span>
                        </div>

                        <div className="flex items-center gap-2 text-yellow-500 mb-4">
                            <span className="font-bold text-xl">{hospital.rating}</span>
                            <div className="flex"><FaStar /></div>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">({hospital.reviews} reviews)</span>
                        </div>

                        <div className="space-y-3 text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-3">
                                <FaMapMarkerAlt className="text-primary-500" />
                                <span>{hospital.address}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaPhone className="text-primary-500" />
                                <span>{hospital.phone || 'Phone not available'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaClock className="text-primary-500" />
                                <span className="text-green-600 font-medium">{hospital.hours}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Doctors Section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading mb-6">Available Doctors</h2>
                {doctors.length === 0 ? (
                    <p className="text-gray-500">No specific doctors listed for this hospital yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {doctors.map(doctor => (
                            <DoctorCard key={doctor._id} doctor={doctor} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HospitalDetails;
