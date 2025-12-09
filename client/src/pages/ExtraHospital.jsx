import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { FaStar, FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';
import { getHospitals } from '../services/api';

const ExtraHospital = () => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const res = await getHospitals();
                setHospitals(res.data);
            } catch (err) {
                console.error('Error fetching hospitals:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHospitals();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-7xl mx-auto px-4 pb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-heading mb-8">Dindigul Hospitals</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hospitals.map((hospital, index) => (
                    <Card key={index} className="p-6 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1" title={hospital.name}>{hospital.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{hospital.type}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded text-yellow-700 dark:text-yellow-400 shrink-0">
                                <span className="font-bold text-sm">{hospital.rating}</span>
                                <FaStar className="text-xs" />
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({hospital.reviews})</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                <FaMapMarkerAlt className="text-primary-500 mt-1 shrink-0" />
                                <p className="text-sm line-clamp-2" title={hospital.address}>{hospital.address}</p>
                            </div>

                            {hospital.phone && (
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <FaPhone className="text-primary-500 shrink-0" />
                                    <p className="text-sm">{hospital.phone}</p>
                                </div>
                            )}

                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <FaClock className="text-primary-500 shrink-0" />
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">{hospital.hours}</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <button
                                onClick={() => navigate(`/hospitals/${hospital._id}`)}
                                className="w-full bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 py-2 rounded-lg font-medium hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                            >
                                View Details
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ExtraHospital;
