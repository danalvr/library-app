import { useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import { registerRequest } from "../../api/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const toast = useRef(null);

  const handleSubmit = async () => {
    try {
      await registerRequest(email, password);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Register success!",
        life: 2000,
      });
      navigate("/login");
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.response?.data?.message || "Register failed",
        life: 2000,
      });
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-slate-100">
      <Toast ref={toast} />
      <div className="bg-white p-6 shadow-md rounded-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        <div className="flex flex-col gap-2">
          <InputText
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputText
            type="password"
            placeholder="Password"
            feedback={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full" label="Register" onClick={handleSubmit} />
        </div>

        <p className="text-center mt-2 text-sm">
          Already have account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
