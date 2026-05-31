import { Gift, ArrowRight } from "lucide-react";

const PromoSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700">
          {/* Background SVG Decoration */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnptMC0xMmMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-10" />

          {/* Main Content */}
          <div className="relative px-6 py-16 md:px-12 md:py-20 overflow-hidden">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-1 space-x-2 mb-8">
                <Gift className="h-5 w-5 text-pink-200" />
                <span className="text-pink-100 font-medium">Special Offer</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Get 25% Off Your First Service</h2>

              <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">Experience premium quality service from our verified professionals.</p>

              <a href="/services" className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-medium rounded-xl hover:bg-indigo-50 transition-colors">
                Book Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>

            {/* Decorative Gradients */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full opacity-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full opacity-20 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
