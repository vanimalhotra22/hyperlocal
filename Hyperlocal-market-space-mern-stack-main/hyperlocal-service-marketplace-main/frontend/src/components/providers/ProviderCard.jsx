import { Star, Award, Briefcase } from "lucide-react";

const ProviderCard = ({ provider }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img src={provider.avatar} alt={provider.name} className="w-16 h-16 rounded-full object-cover mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-amber-500 mr-1 fill-amber-500" />
              <span className="text-sm font-medium">{provider.rating}</span>
              <span className="mx-1 text-gray-400">•</span>
              <span className="text-gray-500 text-sm">{provider.reviews} reviews</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{provider.bio}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <Briefcase className="h-4 w-4 mr-1 text-indigo-500" />
            <span>{provider.experience} years experience</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Award className="h-4 w-4 mr-1 text-indigo-500" />
            <span>{provider.completedJobs} jobs completed</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <a href={`/providers/${provider.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
            View Profile
          </a>
          <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-600 text-sm font-medium py-2 px-4 rounded-lg transition-colors">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
