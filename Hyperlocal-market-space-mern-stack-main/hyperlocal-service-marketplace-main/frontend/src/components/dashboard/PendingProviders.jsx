import { useState, useEffect } from "react";
import { Check, X, User } from "lucide-react";
import { api } from "../../utils/api.js";

const PendingProviders = () => {
  const [pendingProviders, setPendingProviders] = useState([]);

  const loadPendingProviders = async () => {
    try {
      const res = await api.users.getAllProviders();
      if (res.success && res.data) {
        const pending = res.data
          .filter((p) => p.providerProfile && !p.providerProfile.isVerified)
          .map((p) => ({
            id: p._id || p.id,
            name: p.name,
            email: p.email,
            businessDetails: {
              businessName: p.name || "Provider Service",
              serviceCategory: p.providerProfile.servicesOfferedIds?.[0]?.category || "Services",
              experience: p.providerProfile.experience || 0,
            }
          }));
        setPendingProviders(pending);
      }
    } catch (err) {
      console.error("Failed to fetch pending providers:", err);
    }
  };

  useEffect(() => {
    loadPendingProviders();
  }, []);

  const handleApproval = async (providerId, approved) => {
    try {
      const res = await api.users.verifyProvider(providerId, approved);
      if (res.success) {
        setPendingProviders(pendingProviders.filter((p) => p.id !== providerId));
        alert(approved ? "Provider approved successfully" : "Provider rejected");
      }
    } catch (err) {
      alert(err.message || "Failed to update provider status");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Provider Approvals</h3>
      </div>

      <ul className="divide-y divide-gray-200">
        {pendingProviders.map((provider) => (
          <li key={provider.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                  <div className="text-sm text-gray-500">{provider.email}</div>
                  <div className="text-sm text-gray-500">
                    {provider.businessDetails.businessName} •{provider.businessDetails.serviceCategory} •{provider.businessDetails.experience} years experience
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApproval(provider.id, true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </button>
                <button
                  onClick={() => handleApproval(provider.id, false)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </button>
              </div>
            </div>
          </li>
        ))}

        {pendingProviders.length === 0 && <li className="p-4 text-center text-gray-500">No pending provider approvals</li>}
      </ul>
    </div>
  );
};

export default PendingProviders;
