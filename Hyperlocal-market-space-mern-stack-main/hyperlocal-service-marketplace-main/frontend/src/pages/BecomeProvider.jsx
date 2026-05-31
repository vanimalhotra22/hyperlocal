import Layout from "../components/layout/Layout.jsx";
import { Shield, Award, DollarSign, Users, Star, TrendingUp, ArrowRight } from "lucide-react";

const BecomeProvider = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="absolute inset-0 bg-grid-white/15 bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Grow Your Business With UrbanPro</h1>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of successful service providers who have expanded their business and increased their earnings on our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register?type=provider"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors">
                Start Earning Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <button
                onClick={() => document.getElementById("benefits")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-indigo-600 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Providers", value: "2,500+" },
              { label: "Monthly Bookings", value: "10,000+" },
              { label: "Average Rating", value: "4.8/5" },
              { label: "Monthly Earnings", value: "$2,500+" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose UrbanPro?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We provide everything you need to grow your business and deliver exceptional service to your customers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Access to Customers",
                description: "Get connected with thousands of potential customers actively looking for services in your area.",
              },
              {
                icon: DollarSign,
                title: "Flexible Earnings",
                description: "Set your own rates and work schedule. Earn more by providing quality service.",
              },
              {
                icon: Shield,
                title: "Secure Payments",
                description: "Get paid securely and on time through our platform with multiple payout options.",
              },
              {
                icon: Star,
                title: "Build Your Reputation",
                description: "Grow your business with ratings and reviews from satisfied customers.",
              },
              {
                icon: Award,
                title: "Professional Tools",
                description: "Access scheduling, payment processing, and business management tools.",
              },
              {
                icon: TrendingUp,
                title: "Business Growth",
                description: "Get marketing support, analytics, and insights to grow your business.",
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <Icon className="h-8 w-8 text-indigo-600" />
                    <h3 className="ml-3 text-xl font-semibold text-gray-900">{benefit.title}</h3>
                  </div>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Getting started is easy. Follow these simple steps to begin offering your services.</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-indigo-100"></div>
              {[
                {
                  title: "Create Your Profile",
                  description: "Sign up and complete your professional profile with your services, experience, and pricing.",
                },
                {
                  title: "Get Verified",
                  description: "Complete our verification process to build trust with potential customers.",
                },
                {
                  title: "Receive Bookings",
                  description: "Start receiving booking requests from customers in your area.",
                },
                {
                  title: "Deliver Great Service",
                  description: "Provide excellent service and build your reputation through reviews.",
                },
              ].map((step, index) => (
                <div key={index} className="relative flex items-center mb-8">
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">{index + 1}</span>
                  </div>
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12 ml-auto"}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Hear from providers who have grown their business with UrbanPro.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Home Cleaning Expert",
                image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
                quote: "Since joining UrbanPro, my business has grown exponentially. I now have a steady stream of clients and my income has doubled.",
              },
              {
                name: "Michael Chen",
                role: "Electrician",
                image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
                quote: "The platform makes it easy to manage bookings and communicate with clients. I love how professional and streamlined everything is.",
              },
              {
                name: "Emily Rodriguez",
                role: "Personal Trainer",
                image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
                quote: "UrbanPro has helped me build a strong client base and reputation. The support team is always there when I need them.",
              },
            ].map((story, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <img src={story.image} alt={story.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">{story.name}</h4>
                    <p className="text-gray-600 text-sm">{story.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{story.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Find answers to common questions about becoming a service provider.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "How much does it cost to join?",
                answer: "Joining UrbanPro is completely free. We only take a small commission on completed bookings.",
              },
              {
                question: "How do I get paid?",
                answer: "Payments are processed securely through our platform. You can receive payments via direct deposit, PayPal, or other supported methods.",
              },
              {
                question: "What kind of support do you provide?",
                answer: "We provide 24/7 customer support, business tools, marketing assistance, and resources to help you succeed.",
              },
              {
                question: "Can I set my own schedule?",
                answer: "Yes, you have complete flexibility to set your own schedule and choose which jobs to accept.",
              },
            ].map((faq, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Grow Your Business?</h2>
            <p className="text-xl text-indigo-100 mb-8">Join UrbanPro today and start connecting with customers in your area.</p>
            <a
              href="/register?type=provider"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BecomeProvider;
