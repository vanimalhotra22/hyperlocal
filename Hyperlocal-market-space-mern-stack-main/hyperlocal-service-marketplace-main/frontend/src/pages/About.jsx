import Layout from "../components/layout/Layout.jsx";
import { Shield, Award, Users, Globe, Star, CheckCircle, TrendingUp, Heart } from "lucide-react";

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,...')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Transforming Lives Through
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">Quality Service</span>
            </h1>
            <p className="text-xl text-indigo-100">Our journey of connecting exceptional service providers with customers who deserve nothing but the best.</p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <div className="inline-flex items-center bg-indigo-100 rounded-full px-4 py-1 text-indigo-600 font-medium text-sm mb-6">Our Story</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">From Vision to Reality: Building Trust Since 2020</h2>
            <div className="prose prose-lg text-gray-600">
              <p className="mb-4">
                What started as a simple idea in a small office has grown into a thriving platform connecting thousands of skilled professionals with customers who need their
                expertise.
              </p>
              <p>Today, we're proud to have built a community where trust, quality, and customer satisfaction are at the heart of everything we do.</p>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg" alt="Team Meeting" className="w-full h-[500px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-xl">
              <div className="flex items-center space-x-3">
                <Award className="h-8 w-8 text-indigo-600" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">Trusted by 10,000+</p>
                  <p className="text-sm text-gray-600">Satisfied Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">Our Journey</h3>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-indigo-100"></div>
            {[
              {
                year: "2020",
                title: "The Beginning",
                description: "Founded with a vision to revolutionize service delivery",
                image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
              },
              {
                year: "2021",
                title: "Rapid Growth",
                description: "Expanded to 5 major cities with 1,000+ service providers",
                image: "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg",
              },
              {
                year: "2022",
                title: "Technology Innovation",
                description: "Launched mobile app and real-time booking system",
                image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg",
              },
              {
                year: "2023",
                title: "Market Leader",
                description: "Became the most trusted service platform in the region",
                image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
              },
            ].map((milestone, index) => (
              <div key={milestone.year} className={`relative flex items-center mb-12 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className="flex-1 md:w-1/2" />
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-indigo-600 z-10" />
                <div className="flex-1 md:w-1/2">
                  <div className={`bg-white rounded-xl shadow-sm p-6 mx-4 ${index % 2 === 0 ? "md:ml-12" : "md:mr-12"}`}>
                    <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium mb-4">{milestone.year}</span>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h4>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Heart,
              title: "Customer First",
              description: "Every decision we make is centered around providing the best experience for our customers.",
            },
            {
              icon: Shield,
              title: "Trust & Safety",
              description: "We maintain the highest standards of verification and quality assurance.",
            },
            {
              icon: Star,
              title: "Excellence",
              description: "We strive for excellence in every service delivery and customer interaction.",
            },
          ].map((value, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-6">
                <value.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-12 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">What Our Community Says</h3>
            <blockquote className="text-xl text-gray-600 italic mb-8">
              "UrbanPro has transformed how I run my business. The platform's commitment to quality and customer satisfaction aligns perfectly with my values."
            </blockquote>
            <div className="flex items-center justify-center">
              <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" alt="John Smith" className="w-12 h-12 rounded-full object-cover" />
              <div className="ml-4 text-left">
                <p className="font-medium text-gray-900">John Smith</p>
                <p className="text-sm text-gray-600">Professional Plumber, 3 years with UrbanPro</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Join Our Growing Community</h2>
          <p className="text-xl text-gray-600 mb-8">Whether you're looking for quality services or want to grow your business, UrbanPro is here to help you succeed.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/services"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent rounded-xl text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm">
              Find Services
            </a>
            <a
              href="/become-provider"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-indigo-600 rounded-xl text-base font-medium text-indigo-600 hover:bg-indigo-50 transition-colors">
              Become a Provider
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
