import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import { FaEdit, FaTrash } from 'react-icons/fa';

const DoctorCard = ({ doctor, onEdit, onDelete }) => {
    return (
        <Card className="p-6 hover:shadow-md transition-shadow duration-300 relative group">
            <div className="absolute top-4 right-4 flex gap-2">
                <button
                    onClick={() => onEdit(doctor)}
                    className="p-2 bg-white text-blue-600 rounded-full shadow-sm hover:bg-blue-50 transition-colors"
                    title="Edit"
                >
                    <FaEdit />
                </button>
                <button
                    onClick={() => onDelete(doctor._id)}
                    className="p-2 bg-white text-red-600 rounded-full shadow-sm hover:bg-red-50 transition-colors"
                    title="Delete"
                >
                    <FaTrash />
                </button>
            </div>

            <div className="h-48 overflow-hidden bg-gray-100 relative mb-4 rounded-lg">
                {doctor.image ? (
                    <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-500 text-4xl font-bold">
                        {doctor.name.charAt(0)}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Available</span>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">ID: {doctor.docId}</span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 font-heading">
                {doctor.name.startsWith('Dr.')
                    ? `Dr. ${doctor.initial ? doctor.initial + '.' : ''} ${doctor.name.replace('Dr.', '').trim()}`
                    : `${doctor.initial ? doctor.initial + '.' : ''} ${doctor.name}`}
            </h3>
            <p className="text-primary-600 dark:text-primary-400 font-medium text-sm mb-1">{doctor.specialty}</p>
            {doctor.hospital && (
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1 font-medium">{doctor.hospital}{doctor.district ? `, ${doctor.district}` : ''}</p>
            )}
            <p className="text-gray-900 dark:text-white font-bold text-sm mb-3">₹{doctor.fee || 0} / Visit</p>

            {doctor.availability && doctor.availability.length > 0 && (
                <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Availability</p>
                    <div className="flex flex-wrap gap-2">
                        {doctor.availability.filter(Boolean).map((slot, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 text-xs rounded-md border border-blue-100 dark:border-blue-800">
                                {slot}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2">
                {doctor.bio || 'Experienced specialist dedicated to providing the best patient care with years of medical practice.'}
            </p>

            <Link to="/booking" state={{ doctorId: doctor.docId, fee: doctor.fee || 0, availability: doctor.availability }}>
                <Button size="sm" className="w-full">
                    Book Now
                </Button>
            </Link>
        </Card>
    );
};

export default DoctorCard;
