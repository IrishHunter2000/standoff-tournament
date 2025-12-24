import { useState } from 'react'
import { supabase } from "../supabaseClient";

export function AdminLogin({ setPage }: { setPage: (p: string) => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (!error) {
            setPage("admin");
        }
    };

    return (
        <div className="flex justify-center mt-10">
            <div className="w-[300px] p-4 border rounded">
                <h2 className="font-bold mb-2">Admin Login</h2>

                <input
                    className="w-full mb-2 p-2 border"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="w-full mb-3 p-2 border"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="w-full bg-blue-600 text-white py-2 rounded"
                    onClick={login}
                >
                    Login
                </button>
            </div>
        </div>
    );
}
