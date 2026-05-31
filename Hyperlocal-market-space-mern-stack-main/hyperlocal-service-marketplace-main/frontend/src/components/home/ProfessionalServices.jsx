import { Shield, Award, Clock, ThumbsUp } from "lucide-react";

const ProfessionalServices = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Section */}
          <div className="lg:w-1/2">
            <div className="relative">
              <img src="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg" alt="Professional Services" className="rounded-2xl shadow-2xl" />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Award className="h-6 w-6 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-900">Top Rated Professionals</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Experience Excellence with Our Professional Services</h2>
            <p className="text-gray-600 mb-8">
              We connect you with skilled professionals who are committed to delivering exceptional service. Our rigorous vetting process ensures you receive nothing but the best.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Verified Experts",
                  description: "All professionals undergo thorough background checks",
                },
                {
                  icon: Award,
                  title: "Quality Assured",
                  description: "Satisfaction guaranteed on every service",
                },
                {
                  icon: Clock,
                  title: "Timely Service",
                  description: "Punctual and efficient service delivery",
                },
                {
                  icon: ThumbsUp,
                  title: "Customer First",
                  description: "24/7 support for all your needs",
                },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalServices;
