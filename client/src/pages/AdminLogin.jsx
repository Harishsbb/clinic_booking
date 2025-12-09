import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', formData);

            if (res.data.role === 'user') {
                alert('Access Denied: This login is for Hospital Staff only.');
                return;
            }

            localStorage.setItem('userId', res.data.userId);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('name', res.data.name);
            alert('Login Successful');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Invalid Credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50 animate-fade-in">
            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white w-full lg:w-1/2">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 font-heading">
                            Hospital Admin Login
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Authorized personnel only
                        </p>
                    </div>

                    <div className="mt-8">
                        <div className="mt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    label="Email address"
                                    placeholder="admin@medicare.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    label="Password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />

                                <div>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        isLoading={loading}
                                    >
                                        Sign in
                                    </Button>
                                </div>
                            </form>
                            <div className="mt-6 text-center">
                                <Link to="/login" className="text-sm text-gray-500 hover:text-primary-600">
                                    Back to Patient Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block relative w-0 flex-1">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                    alt="Hospital Admin"
                />
                <div className="absolute inset-0 bg-blue-900 opacity-30 mix-blend-multiply"></div>
            </div>
        </div>
    );
};

export default AdminLogin;
