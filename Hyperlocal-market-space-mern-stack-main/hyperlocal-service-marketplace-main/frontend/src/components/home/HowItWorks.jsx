import { Search, Calendar, UserCheck, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Search Service",
      description: "Browse through our wide range of professional services.",
      icon: <Search className="h-8 w-8 text-indigo-600" />,
    },
    {
      id: 2,
      title: "Book Appointment",
      description: "Select your preferred date and time for the service.",
      icon: <Calendar className="h-8 w-8 text-indigo-600" />,
    },
    {
      id: 3,
      title: "Get Matched",
      description: "We'll connect you with a verified service professional.",
      icon: <UserCheck className="h-8 w-8 text-indigo-600" />,
    },
    {
      id: 4,
      title: "Service Completion",
      description: "Enjoy quality service and rate your experience.",
      icon: <CheckCircle className="h-8 w-8 text-indigo-600" />,
    },
  ];

  return (
    <section className="py-16 bg-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Getting the service you need is easy with our simple 4-step process.</p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-indigo-200 -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step) => (
              <div key={step.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center relative">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">{step.icon}</div>
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold py-1 px-3 rounded-full">Step {step.id}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">Book a Service Now</button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
