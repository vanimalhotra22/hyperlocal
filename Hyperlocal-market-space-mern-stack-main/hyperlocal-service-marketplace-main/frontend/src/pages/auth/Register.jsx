import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "../../components/layout/Layout.jsx";
import { api } from "../../utils/api.js";
import { useAuth } from "../../contexts/authContext.jsx";

// Base schema for common user fields
const baseUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

// Create user schema with password validation
const userSchema = baseUserSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Create provider schema by extending base schema and adding provider-specific fields
const providerSchema = baseUserSchema
  .extend({
    businessName: z.string().min(2, "Business name must be at least 2 characters"),
    serviceCategory: z.string().min(1, "Please select a service category"),
    experience: z.string().min(1, "Please enter years of experience"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const [isProvider, setIsProvider] = useState(false);
  const [servicesList, setServicesList] = useState([]);
  const { login } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.services.getAll();
        if (response.success) {
          setServicesList(response.data);
        }
      } catch (error) {
        console.error("Failed to load services for registration:", error);
      }
    };
    fetchServices();
  }, []);

  const {
    register: registerUser,
    handleSubmit: handleUserSubmit,
    formState: { errors: userErrors },
  } = useForm({
    resolver: zodResolver(userSchema),
  });

  const {
    register: registerProvider,
    handleSubmit: handleProviderSubmit,
    formState: { errors: providerErrors },
  } = useForm({
    resolver: zodResolver(providerSchema),
  });

  const onSubmitUser = async (data) => {
    try {
      const response = await api.auth.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: "user"
      });
      if (response.token) {
        login(response.data, response.token);
        window.location.href = "/dashboard";
      }
    } catch (error) {
      alert(error.message || "Registration failed");
    }
  };

  const onSubmitProvider = async (data) => {
    try {
      let matchedServiceId = null;
      if (servicesList.length > 0) {
        const matched = servicesList.find(
          s => s.category.toLowerCase().includes(data.serviceCategory.toLowerCase())
        );
        if (matched) matchedServiceId = matched._id;
      }
      if (!matchedServiceId && servicesList.length > 0) {
        matchedServiceId = servicesList[0]._id;
      }

      const providerData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: "provider",
        bio: `Business: ${data.businessName}. Category: ${data.serviceCategory}.`,
        experience: Number(data.experience) || 1,
        availability: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(day => ({
          day,
          fromTime: 8,
          toTime: 20
        })),
        serviceAreas: [
          {
            label: "NYC HQ",
            location: {
              type: "Point",
              coordinates: [-74.0060, 40.7128]
            },
            radiusMeters: 20000
          }
        ],
        servicesOfferedIds: matchedServiceId ? [matchedServiceId] : []
      };

      await api.auth.register(providerData);
      alert("Registration successful! Please wait for admin approval.");
      window.location.href = "/login";
    } catch (error) {
      alert(error.message || "Provider registration failed");
    }
  };

  const handleGoogleSuccess = async (googleResponse) => {
    try {
      const { credential } = googleResponse;
      const res = await api.auth.googleLogin(credential);
      if (res.token) {
        login(res.data, res.token);
        window.location.href = '/dashboard';
      }
    } catch (error) {
      alert(error.message || 'Google registration failed');
    }
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "512468543123-eg1a9hhqf95cqt29as1rg4nijscmeitn.apps.googleusercontent.com",
        callback: handleGoogleSuccess,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signup-button"),
        { theme: "outline", size: "large", width: "350px" }
      );
    }
  }, [isProvider]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Or{" "}
              <a href="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                sign in to your existing account
              </a>
            </p>
          </div>

          <div className="mt-8">
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => setIsProvider(false)}
                className={`px-4 py-2 rounded-md font-medium cursor-pointer transition-colors duration-200 ${!isProvider ? "bg-indigo-600 text-white shadow" : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-slate-700"}`}>
                Register as User
              </button>
              <button
                onClick={() => setIsProvider(true)}
                className={`px-4 py-2 rounded-md font-medium cursor-pointer transition-colors duration-200 ${isProvider ? "bg-indigo-600 text-white shadow" : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-slate-700"}`}>
                Register as Provider
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100 dark:border-slate-700">
              {!isProvider ? (
                <form className="space-y-6" onSubmit={handleUserSubmit(onSubmitUser)}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Full Name
                    </label>
                    <input
                      {...registerUser("name")}
                      className="mt-1 block w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {userErrors.name && <p className="mt-2 text-sm text-red-600">{userErrors.name.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Email address
                    </label>
                    <input
                      {...registerUser("email")}
                      type="email"
                      className="mt-1 block w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {userErrors.email && <p className="mt-2 text-sm text-red-600">{userErrors.email.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Phone Number
                    </label>
                    <input
                      {...registerUser("phone")}
                      type="tel"
                      className="mt-1 block w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {userErrors.phone && <p className="mt-2 text-sm text-red-600">{userErrors.phone.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Password
                    </label>
                    <input
                      {...registerUser("password")}
                      type="password"
                      className="mt-1 block w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {userErrors.password && <p className="mt-2 text-sm text-red-600">{userErrors.password.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Confirm Password
                    </label>
                    <input
                      {...registerUser("confirmPassword")}
                      type="password"
                      className="mt-1 block w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {userErrors.confirmPassword && <p className="mt-2 text-sm text-red-600">{userErrors.confirmPassword.message}</p>}
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition-colors duration-200">
                      Register
                    </button>
                  </div>
                </form>
              ) : (
                <form className="space-y-6" onSubmit={handleProviderSubmit(onSubmitProvider)}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Full Name
                    </label>
                    <input
                      {...registerProvider("name")}
                      className="mt-1 block w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {providerErrors.name && <p className="mt-2 text-sm text-red-600">{providerErrors.name.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Business Name
                    </label>
                    <input
                      {...registerProvider("businessName")}
                      className="mt-1 block w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {providerErrors.businessName && <p className="mt-2 text-sm text-red-600">{providerErrors.businessName.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Email address
                    </label>
                    <input
                      {...registerProvider("email")}
                      type="email"
                      className="mt-1 block w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {providerErrors.email && <p className="mt-2 text-sm text-red-600">{providerErrors.email.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Phone Number
                    </label>
                    <input
                      {...registerProvider("phone")}
                      type="tel"
                      className="mt-1 block w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {providerErrors.phone && <p className="mt-2 text-sm text-red-600">{providerErrors.phone.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="serviceCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Service Category
                    </label>
                    <select
                      {...registerProvider("serviceCategory")}
                      className="mt-1 block w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option value="">Select a category</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="salon">Salon & Spa</option>
                      <option value="appliance">Appliance Repair</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="painting">Painting</option>
                      <option value="pest control">Pest Control</option>
                      <option value="gardening">Gardening</option>
                    </select>
                    {providerErrors.serviceCategory && <p className="mt-2 text-sm text-red-600">{providerErrors.serviceCategory.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Years of Experience
                    </label>
                    <input
                      {...registerProvider("experience")}
                      type="number"
                      className="mt-1 block w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {providerErrors.experience && <p className="mt-2 text-sm text-red-600">{providerErrors.experience.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Password
                    </label>
                    <input
                      {...registerProvider("password")}
                      type="password"
                      className="mt-1 block w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {providerErrors.password && <p className="mt-2 text-sm text-red-600">{providerErrors.password.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Confirm Password
                    </label>
                    <input
                      {...registerProvider("confirmPassword")}
                      type="password"
                      className="mt-1 block w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {providerErrors.confirmPassword && <p className="mt-2 text-sm text-red-600">{providerErrors.confirmPassword.message}</p>}
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition-colors duration-200">
                      Register as Provider
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-slate-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">Or sign up with</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <div id="google-signup-button" className="w-full flex justify-center"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
