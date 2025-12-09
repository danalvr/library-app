import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

import { loginRequest } from "../../api/auth";

import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await loginRequest(email, password);
      login(res.data);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-6 shadow-md rounded-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <div className="flex flex-col gap-2">
          <InputText
            className="w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Password
            toggleMask
            className="w-full"
            placeholder="Password"
            feedback={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full" label="Login" onClick={handleSubmit} />
        </div>

        <p className="text-center mt-2 text-sm">
          Don't have account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
