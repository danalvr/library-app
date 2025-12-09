import { useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import { loginRequest } from "../../api/auth";

import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const navigate = useNavigate();

  const toast = useRef(null);

  const handleSubmit = async () => {
    try {
      const res = await loginRequest(email, password);
      login(res.data);
      navigate("/");
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.response?.data?.message || "Login failed",
        life: 2000,
      });
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-slate-100">
      <Toast ref={toast} />
      <div className="bg-white p-6 shadow-md rounded-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <div className="flex flex-col gap-2">
          <InputText
            className="w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputText
            type="password"
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
