import React, { useEffect, useState } from 'react';

const Theme = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className='bg-white dark:bg-slate-900 h-screen w-full flex items-center justify-center'>
            <button onClick={toggleTheme} className='text-slate-900 dark:text-slate-200 border border-slate-300 p-3 rounded-md'>
                Change Theme
            </button>
        </div>
    );
};

export default Theme;
