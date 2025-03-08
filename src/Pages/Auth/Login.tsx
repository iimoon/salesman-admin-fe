import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";


export default function Login() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);  
    const { login } = useApi();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await login({ name, password });
            console.log(response);

            const token = response;

            if (token) {
                localStorage.setItem("token", token);
                
                toast.success("Login successful! Redirecting...");
                setIsLoggedIn(true); 

            } else {
                toast.error("Login failed. No token received.");
            }
        } catch (error) {
            toast.error("Login Failed.");
        } finally {
            setIsLoading(false);
        }
    };

    
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");  
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="flex h-screen w-full">
            <div className="w-1/2 bg-[#094497] text-white flex flex-col items-center justify-center p-10">
                <div className="bg-white p-2 rounded-lg mb-5">
                    <img src="/logo.png" className="w-30 h-30" />
                </div>
                <h1 className="text-3xl font-bold">Welcome to SalesManTracking Application</h1>
            </div>
            <div className="w-1/2 flex items-center justify-center bg-white">
                <Card className="w-[400px] shadow-lg rounded-lg border border-gray-200">
                    <CardHeader>
                        <h2 className="text-2xl font-bold text-center text-[#094497]">Admin Login</h2>
                        <p className="text-center text-gray-500">Sign in to manage your dashboard</p>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-6">
                            <div>
                                <Label className="text-sm font-semibold text-gray-700">Username</Label>
                                <Input
                                    type="text"
                                    placeholder="admin"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border-[#094497] focus:ring-[#072c66]"
                                    required
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-semibold text-gray-700">Password</Label>
                                <Input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border-[#094497] focus:ring-[#072c66]"
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4 mt-3">
                            <Button
                                type="submit"
                                className="bg-[#094497] hover:bg-[#072c66] text-white w-full flex items-center justify-center"
                                disabled={isLoading}
                            >
                                {isLoading ? <Spinner size="small" className="mr-2" /> : "Log in"}
                            </Button>
                            <p className="text-sm text-gray-500 text-center">Forgot your password?</p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
