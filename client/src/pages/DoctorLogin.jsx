
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { FaUserMd, FaLock } from 'react-icons/fa';

const DoctorLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/doctor/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('name', res.data.name);
            localStorage.setItem('role', 'doctor');
            localStorage.setItem('doctorId', res.data._id);
            navigate('/doctor/dashboard');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-transparent animate-fade-in">
            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white/90 backdrop-blur-sm w-full lg:w-1/2">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 font-heading">
                            Doctor Portal
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Please login to manage your appointments
                        </p>
                    </div>

                    <div className="mt-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUserMd className="text-gray-400" />
                                    </div>
                                    <Input
                                        name="email"
                                        type="email"
                                        required
                                        className="pl-10"
                                        placeholder="doctor@clinic.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400" />
                                    </div>
                                    <Input
                                        name="password"
                                        type="password"
                                        required
                                        className="pl-10"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    className="w-full justify-center py-3"
                                    isLoading={loading}
                                >
                                    Login
                                </Button>
                            </div>
                        </form>
                        <div className="mt-6 flex flex-col items-center gap-2">
                            <Link to="/login" className="text-sm text-gray-500 hover:text-primary-600">
                                Back to Patient Login
                            </Link>
                            <Link to="/admin/login" className="text-sm text-gray-500 hover:text-primary-600">
                                Hospital Staff Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block relative w-0 flex-1">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                    alt="Doctor Login Background"
                />
                <div className="absolute inset-0 bg-primary-900/40 mix-blend-multiply" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-10 text-center">
                    <h1 className="text-4xl font-bold mb-4 font-heading">Welcome Back, Doctor</h1>
                    <p className="text-lg max-w-lg">Access your schedule, patient records, and improve healthcare delivery efficiently.</p>
                </div>
            </div>
        </div>
    );
};

export default DoctorLogin;
