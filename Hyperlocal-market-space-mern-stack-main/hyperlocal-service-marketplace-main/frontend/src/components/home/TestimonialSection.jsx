import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Jennifer Wilson",
    role: "Homeowner",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    content: "The service quality exceeded my expectations. The professional was punctual, thorough, and paid attention to every detail. I've already booked multiple services!",
    rating: 5,
    location: "New York, NY",
    service: "Home Cleaning",
  },
  {
    id: 2,
    name: "Robert Chen",
    role: "Business Owner",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
    content: "As a business owner, I appreciate the reliability and professionalism. The platform makes it easy to find and book qualified service providers.",
    rating: 5,
    location: "San Francisco, CA",
    service: "Commercial Cleaning",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "Professional",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    content: "The quality of service is consistently outstanding. I've recommended UrbanPro to all my colleagues. It's transformed how I manage home services.",
    rating: 5,
    location: "Chicago, IL",
    service: "Appliance Repair",
  },
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16 bg-gradient-to-b from-indigo-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Real experiences from customers who have transformed their service experience with UrbanPro.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
              <Quote className="h-16 w-16 text-indigo-100 transform rotate-180" />
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <img src={currentTestimonial.image} alt={currentTestimonial.name} className="relative w-24 h-24 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-white" />
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                      <div className="bg-indigo-600 rounded-full p-1">
                        <Quote className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3 text-center md:text-left">
                  <div className="flex justify-center md:justify-start mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < currentTestimonial.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`} />
                    ))}
                  </div>

                  <blockquote className="text-gray-700 text-lg italic mb-6 relative">"{currentTestimonial.content}"</blockquote>

                  <div>
                    <h4 className="font-semibold text-gray-900">{currentTestimonial.name}</h4>
                    <p className="text-gray-500">{currentTestimonial.role}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <span>{currentTestimonial.location}</span>
                      <span className="mx-2">•</span>
                      <span>{currentTestimonial.service}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-center md:justify-end gap-4 mt-8">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors group"
                  aria-label="Previous testimonial">
                  <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors group"
                  aria-label="Next testimonial">
                  <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all ${index === currentIndex ? "w-8 bg-indigo-600" : "w-2 bg-gray-300"}`}
                    aria-label={`Go to testimonial ${index + 1}`}></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
