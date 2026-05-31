import { categories } from "../../data/mockData.js";
import { ChevronRight } from "lucide-react";

const CategorySection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Service Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover our wide range of professional services designed to meet all your needs.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <a key={category.id} href={`/categories/${category.id}`} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="relative h-40 overflow-hidden">
                <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold">{category.name}</h3>
                  <p className="text-indigo-100 text-sm">{category.services} services</p>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-indigo-600 font-medium text-sm">View Services</span>
                <ChevronRight className="h-4 w-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
