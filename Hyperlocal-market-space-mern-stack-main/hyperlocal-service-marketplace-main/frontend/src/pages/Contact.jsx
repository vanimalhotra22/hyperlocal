import { useState } from "react";
import Layout from "../components/layout/Layout.jsx";
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, ChevronUp } from "lucide-react";

const Contact = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I book a service?",
      answer:
        "You can easily book a service by browsing our available services, selecting your preferred date and time, and completing the booking process. Payment is only required after service completion.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, digital wallets (Apple Pay, Google Pay), and bank transfers. For certain services, cash payments are also available upon completion.",
    },
    {
      question: "How are your service providers vetted?",
      answer:
        "All our service providers undergo a rigorous verification process including background checks, skill assessment, and reference verification. We only partner with qualified and trusted professionals.",
    },
    {
      question: "What is your cancellation policy?",
      answer: "You can cancel or reschedule your booking up to 24 hours before the scheduled service time without any charges. Late cancellations may incur a small fee.",
    },
    {
      question: "Is there a satisfaction guarantee?",
      answer: "Yes! We offer a 100% satisfaction guarantee. If you're not completely satisfied with the service, we'll work to make it right or provide a refund.",
    },
  ];

  return (
    <Layout>
      {/* Section 1 - Let's Start a Conversation */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnptMC0xMmMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Let's Start a<span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">Conversation</span>
            </h1>
            <p className="text-xl text-indigo-100">Have questions or need assistance? We're here to help you with anything you need.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <form className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (Optional)</label>
              <input type="tel" className="w-full px-4 py-3 rounded-xl border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" placeholder="+1 (555) 000-0000" />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                placeholder="How can we help you?"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
              <textarea
                required
                rows={6}
                className="w-full px-4 py-3 rounded-xl border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                placeholder="Please describe your inquiry in detail..."></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center">
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Section 2 - Contact Information */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                      <Mail className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <a href="mailto:support@urbanpro.com" className="text-lg text-gray-900 hover:text-indigo-600">
                      support@urbanpro.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                      <Phone className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <a href="tel:+1-555-123-4567" className="text-lg text-gray-900 hover:text-indigo-600">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-lg text-gray-900">
                      123 Business Street
                      <br />
                      New York, NY 10001
                      <br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                      <Clock className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Business Hours</p>
                    <p className="text-lg text-gray-900">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1645564944227!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 - FAQs */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200">
                <button onClick={() => toggleFaq(index)} className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none">
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {openFaq === index ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-200 ${openFaq === index ? "max-h-48 pb-4" : "max-h-0"}`}>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
