import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  ArrowRight,
  UserPlus,
  LogIn,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function AdminAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  const toggleView = () => {
    setIsLogin(!isLogin);
    reset();
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        // Handle Login
        const response = await axios.post(
          "http://localhost:5000/auth/admin/login",
          {
            email: data.email,
            password: data.password,
          },
          { withCredentials: true } // Send session cookie
        );

        toast.success(response.data.message || "Logged in successfully!", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          closeButton: false,
          pauseOnHover: false,
          draggable: false,
          theme: "light",
          transition: Slide,
        });

        setTimeout(() => {
          navigate("/admin");
        }, 1100);
      } else {
        // Handle Signup
        const response = await axios.post(
          "http://localhost:5000/auth/admin/signup",
          {
            name: data.name,
            email: data.email,
            password: data.password,
          },
          { withCredentials: true } // Send session cookie
        );

        toast.success(
          response.data.message ||
            "Admin account created successfully! Please log in.",
          {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: false,
            closeButton: false,
            pauseOnHover: false,
            draggable: false,
            theme: "light",
            transition: Slide,
          }
        );
        setIsLogin(true);
        reset();
      }
    } catch (error) {
      console.error(`${isLogin ? "Login" : "Signup"} error:`, error);
      const errorMessage =
        error.response?.data?.message ||
        `An error occurred during ${isLogin ? "login" : "signup"}.`;
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        closeButton: false,
        pauseOnHover: false,
        draggable: false,
        theme: "light",
        transition: Slide,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Slide}
        />
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:shadow-xl">
          {/* Header */}
          <div className="bg-blue-600 p-6 transition-all duration-300">
            <h1 className="text-2xl font-bold text-white text-center">
              {isLogin ? "Admin Login" : "Create Admin Account"}
            </h1>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field (Signup only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-slate-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.name ? "border-red-500" : "border-slate-300"
                    }`}
                    placeholder="Enter your name"
                    {...register("name", {
                      required: !isLogin && "Name is required",
                    })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.email ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder="admin@company.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.password ? "border-red-500" : "border-slate-300"
                    }`}
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field (Signup only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-slate-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                    placeholder="••••••••"
                    {...register("confirmPassword", {
                      validate: (value) =>
                        !isLogin
                          ? value === watch("password") ||
                            "Passwords do not match"
                          : true,
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 mt-6 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <>
                    <span>{isLogin ? "Login" : "Create Account"}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Toggle between Login/Signup */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={toggleView}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200 flex items-center justify-center mx-auto space-x-1"
              >
                {isLogin ? <UserPlus size={16} /> : <LogIn size={16} />}
                <span>
                  {isLogin
                    ? "Create a new account"
                    : "Login to existing account"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Admin Portal Text */}
        <div className="text-center mt-6 text-slate-500">
          <p>Admin Portal - Secure Access Only</p>
        </div>
      </div>
    </div>
  );
}
