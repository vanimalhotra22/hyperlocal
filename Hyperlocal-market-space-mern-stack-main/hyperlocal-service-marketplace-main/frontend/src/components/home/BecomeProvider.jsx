import { ArrowRight } from "lucide-react";

const BecomeProvider = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-indigo-50 to-white">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl overflow-hidden">
          <div className="relative px-8 py-12 md:p-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-2/3">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Turn Your Expertise Into A Thriving Business</h2>
                <p className="text-xl text-indigo-100 mb-8">Join thousands of successful service providers who have grown their business with us.</p>
                <a
                  href="/become-provider"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors">
                  Become a Provider
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>

              <div className="md:w-1/3">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "2,500+", label: "Active Providers" },
                    { value: "10,000+", label: "Monthly Bookings" },
                    { value: "4.8/5", label: "Provider Rating" },
                    { value: "$2,500", label: "Avg. Monthly Earnings" },
                  ].map((stat, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-indigo-200">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeProvider;
