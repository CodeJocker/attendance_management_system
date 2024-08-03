import React, { useState } from 'react';
import api from "../api";
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

// eslint-disable-next-line react/prop-types
function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 
    
    const name = method === "login" ? "Login" : "Register"; 

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const res = await api.post(route, { username, password });
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/index"); 
            } else {
                navigate("/login");
            }
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center translate-y-5 translate-x-[-20px]">
            <div className="form card shrink-0 w-full max-w-sm">
                <fieldset className="form-control border shadow-2xl rounded-md p-3">
                    <header className="text-2xl font text-center font-bold">
                        {name}
                    </header>
                    <form onSubmit={handleSubmit} className='flex flex-col card-body'>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input
                                type="text"
                                name="slug"
                                className="input input-bordered bg-slate-200 placeholder:text-slate-800 placeholder:font text-slate-800"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="input input-bordered bg-slate-200 placeholder:text-slate-800 placeholder:font text-slate-800"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                        </div>
                        <div className="button py-5">
                            <button type="submit" className="btn btn-info btn-outline w-[470px]">{name}</button>
                        </div>
                    </form>
                </fieldset>
            </div>
        </div>
    );
}

export default Form;
