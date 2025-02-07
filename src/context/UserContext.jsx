import React, { createContext, useContext, useState, useEffect } from 'react';
import { use } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    }

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            setUser(JSON.parse(user));
        }
    }, [])  

    return (
        <div>

        </div>
    )
}
