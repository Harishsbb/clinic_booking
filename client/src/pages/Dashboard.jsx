import React from 'react';
import PatientDashboard from '../components/PatientDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
    const role = localStorage.getItem('role');

    return (
        <div className="animate-fade-in">
            {role === 'admin' ? <AdminDashboard /> : <PatientDashboard />}
        </div>
    );
};

export default Dashboard;
