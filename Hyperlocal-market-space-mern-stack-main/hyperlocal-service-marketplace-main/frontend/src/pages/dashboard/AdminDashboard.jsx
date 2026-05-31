import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout.jsx";
import { Users, Briefcase, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle, XCircle, Settings, FileText, Bell, Search, Star } from "lucide-react";
import DashboardStats from "../../components/dashboard/DashboardStats.jsx";
import BookingList from "../../components/dashboard/BookingList.jsx";
import ServiceManagement from "../../components/dashboard/ServiceManagement.jsx";
import CategoryManagement from "../../components/dashboard/CategoryManagement.jsx";
import PendingProviders from "../../components/dashboard/PendingProviders.jsx";
import { api } from "../../utils/api.js";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // API State
  const [dbBookings, setDbBookings] = useState([]);
  const [dbProviders, setDbProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const bookingsRes = await api.bookings.getAll();
      const providersRes = await api.users.getAllProviders();
      if (bookingsRes.success) {
        setDbBookings(bookingsRes.data || []);
      }
      if (providersRes.success) {
        setDbProviders(providersRes.data || []);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
      setError(err.message || "Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleStatusChange = async (bookingId, status) => {
    try {
      const res = await api.bookings.updateStatus(bookingId, status);
      if (res.success) {
        alert("Booking status updated successfully!");
        fetchAdminData();
      }
    } catch (err) {
      alert(err.message || "Failed to update booking status");
    }
  };

  const mapDbBookingToAdminUi = (dbBooking) => {
    if (!dbBooking) return null;
    let dateStr = "2026-05-31";
    let timeStr = "12:00 PM";
    if (dbBooking.scheduledTime) {
      try {
        const d = new Date(dbBooking.scheduledTime);
        dateStr = d.toISOString().split('T')[0];
        timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch (e) {
        console.error(e);
      }
    }
    return {
      id: dbBooking._id || dbBooking.id,
      service: dbBooking.serviceId?.name || "Service",
      customer: {
        name: dbBooking.userId?.name || "Customer",
        address: dbBooking.address ? `${dbBooking.address.street}, ${dbBooking.address.city}` : "N/A"
      },
      provider: {
        name: dbBooking.providerId?.name || "Unassigned"
      },
      date: dateStr,
      time: timeStr,
      status: dbBooking.status,
      price: dbBooking.amount || 0
    };
  };

  const recentBookings = dbBookings.map(mapDbBookingToAdminUi).filter(Boolean);

  const stats = [
    {
      name: "Total Users",
      value: `${new Set(dbBookings.map(b => b.userId?.email)).size + dbProviders.length}`,
      change: "+12%",
      icon: Users
    },
    {
      name: "Active Providers",
      value: `${dbProviders.filter(p => p.providerProfile?.isVerified).length}`,
      change: "+8%",
      icon: Briefcase
    },
    {
      name: "Total Bookings",
      value: `${dbBookings.length}`,
      change: "+23%",
      icon: Calendar
    },
    {
      name: "Revenue",
      value: `$${dbBookings.filter(b => b.status === "completed" || b.paymentStatus === "paid").reduce((sum, b) => sum + (b.amount || 0), 0)}`,
      change: "+15%",
      icon: DollarSign
    },
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <span>{error}</span>
        </div>
      );
    }
    switch (activeTab) {
      case "services":
        return <ServiceManagement />;
      case "categories":
        return <CategoryManagement />;
      case "overview":
        return (
          <>
            <DashboardStats stats={stats} />

            <div className="mt-8">
              <PendingProviders />
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Recent Bookings</h2>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  View all
                </a>
              </div>
              <BookingList bookings={recentBookings} onStatusChange={handleStatusChange} userType="admin" />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Users</h3>
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {[
                      { name: "John Doe", email: "john@example.com", joined: "2 days ago" },
                      { name: "Jane Smith", email: "jane@example.com", joined: "3 days ago" },
                      { name: "Mike Johnson", email: "mike@example.com", joined: "5 days ago" },
                    ].map((user, index) => (
                      <li key={index} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">{user.name[0]}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                          </div>
                          <div className="flex-shrink-0 text-sm text-gray-500">{user.joined}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Providers</h3>
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {[
                      {
                        name: "Clean Pro Services",
                        service: "Cleaning",
                        rating: "4.8",
                        jobs: "156",
                      },
                      {
                        name: "Quick Fix Plumbers",
                        service: "Plumbing",
                        rating: "4.7",
                        jobs: "98",
                      },
                      {
                        name: "Power Solutions",
                        service: "Electrical",
                        rating: "4.9",
                        jobs: "203",
                      },
                    ].map((provider, index) => (
                      <li key={index} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <span className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">{provider.name[0]}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{provider.name}</p>
                            <p className="text-sm text-gray-500 truncate">{provider.service}</p>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>⭐ {provider.rating}</span>
                            <span>•</span>
                            <span>{provider.jobs} jobs</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </>
        );

      case "users":
        return (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <div className="flex flex-wrap items-center justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Users</h3>
                <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
                  <div className="max-w-lg w-full lg:max-w-xs">
                    <label htmlFor="search" className="sr-only">
                      Search users
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="search"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Search users"
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    {
                      name: "John Doe",
                      email: "john@example.com",
                      status: "Active",
                      joined: "Mar 15, 2024",
                    },
                    {
                      name: "Jane Smith",
                      email: "jane@example.com",
                      status: "Active",
                      joined: "Mar 14, 2024",
                    },
                    {
                      name: "Mike Johnson",
                      email: "mike@example.com",
                      status: "Inactive",
                      joined: "Mar 13, 2024",
                    },
                  ].map((user, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <span className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">{user.name[0]}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joined}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "providers":
        return (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <div className="flex flex-wrap items-center justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Service Providers</h3>
                <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
                  <div className="max-w-lg w-full lg:max-w-xs">
                    <label htmlFor="search" className="sr-only">
                      Search providers
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="search"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Search providers"
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jobs</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    {
                      name: "Clean Pro Services",
                      category: "Cleaning",
                      rating: 4.8,
                      jobs: 156,
                      status: "Active",
                    },
                    {
                      name: "Quick Fix Plumbers",
                      category: "Plumbing",
                      rating: 4.7,
                      jobs: 98,
                      status: "Active",
                    },
                    {
                      name: "Power Solutions",
                      category: "Electrical",
                      rating: 4.9,
                      jobs: 203,
                      status: "Pending",
                    },
                  ].map((provider, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <span className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">{provider.name[0]}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{provider.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900">{provider.rating}</span>
                          <Star className="h-4 w-4 text-yellow-400 ml-1" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{provider.jobs}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            provider.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                          {provider.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
                        <button className="text-red-600 hover:text-red-900">Suspend</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "bookings":
        return (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <div className="flex flex-wrap items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">All Bookings</h3>
                  <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
                    <div className="max-w-lg w-full lg:max-w-xs">
                      <label htmlFor="search" className="sr-only">
                        Search bookings
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="search"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Search bookings"
                          type="search"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <BookingList bookings={recentBookings} onStatusChange={handleStatusChange} userType="admin" />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Today's Bookings", value: "24" },
                  { label: "Pending Approval", value: "12" },
                  { label: "Completed Today", value: "18" },
                  { label: "Cancelled Today", value: "3" },
                ].map((stat, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Platform Settings</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Booking Settings</h4>
                    <div className="mt-4 space-y-4">
                      {["Allow instant booking", "Require payment before confirmation", "Send automated reminders", "Allow provider rating"].map((setting, index) => (
                        <div key={index} className="flex items-start">
                          <div className="flex items-center h-5">
                            <input type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                          </div>
                          <div className="ml-3 text-sm">
                            <label className="font-medium text-gray-700">{setting}</label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Commission Settings</h4>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Platform Commission (%)</label>
                      <input
                        type="number"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        defaultValue="15"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Notification Settings</h4>
                    <div className="mt-4 space-y-4">
                      {["Email notifications for new bookings", "SMS notifications for booking updates", "Push notifications for messages", "Daily report emails"].map(
                        (setting, index) => (
                          <div key={index} className="flex items-start">
                            <div className="flex items-center h-5">
                              <input type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                            </div>
                            <div className="ml-3 text-sm">
                              <label className="font-medium text-gray-700">{setting}</label>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Admin Dashboard</h2>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Export
                </button>
                <button className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Add New
                </button>
              </div>
            </div>

            <div className="mt-6">
              <nav className="flex space-x-4" aria-label="Tabs">
                {[
                  { key: "overview", label: "Overview", icon: FileText },
                  { key: "users", label: "Users", icon: Users },
                  { key: "providers", label: "Providers", icon: Briefcase },
                  { key: "bookings", label: "Bookings", icon: Calendar },
                  { key: "services", label: "Services", icon: Settings },
                  { key: "categories", label: "Categories", icon: FileText },
                  { key: "settings", label: "Settings", icon: Settings },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`${
                      activeTab === tab.key ? "bg-indigo-100 text-indigo-700" : "text-gray-500 hover:text-gray-700"
                    } px-3 py-2 font-medium text-sm rounded-md flex items-center`}>
                    <tab.icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-6">{renderContent()}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
