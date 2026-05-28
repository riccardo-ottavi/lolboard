import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");

    console.log("TOKEN:", token);

    if (token) {
      localStorage.setItem("token", token);

      navigate("/dashboard");
    }
  }, []);

  return <h2>Login in corso...</h2>;
}