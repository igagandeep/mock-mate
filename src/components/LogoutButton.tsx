'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/actions/auth.action';
import { toast } from 'sonner';

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
          
            await logout();
            toast.success('Logged out successfully.');

            router.push('/sign-in');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="btn-primary px-4 py-2 text-white bg-primary-500 hover:bg-primary-600 rounded"
        >
            Logout
        </button>
    );
};

export default LogoutButton;