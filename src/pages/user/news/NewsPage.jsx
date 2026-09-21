import React, { useState } from 'react';
import { Calendar, Clock, ArrowRight, X, ChevronRight } from 'lucide-react';

export const NewsPage = ({ onNavigate }) => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articles = [
    {
      id: 'news-1',
      title: 'How to Choose the Freshest Seasonal Organic Fruits',
      date: 'Sep 21, 2026',
      readTime: '4 min read',
      category: 'Healthy Living',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&auto=format&fit=crop&q=80',
      summary: 'Learn the sensory markers for optimal fruit ripeness, sweetness, and nutritional density directly from our grower partners.',
      content: 'Seasonal organic fruits carry significantly higher concentrations of natural antioxidants, vitamins, and polyphenols compared to produce stored under artificial atmospheric nitrogen. Look for taut skins, vibrant natural coloring, and fragrant floral stems.'
    },
    {
      id: 'news-2',
      title: '5 Quick Healthy Breakfast Recipes for Busy Mornings',
      date: 'Sep 19, 2026',
      readTime: '6 min read',
      category: 'Recipes',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop&q=80',
      summary: 'Nutritious overnight oats, sourdough avocado toast, and green protein smoothies ready in under 7 minutes.',
      content: 'Starting your day with high-quality organic fuel stabilizes blood glucose and prevents mid-morning fatigue. Using farm-fresh cage-free eggs and whole grain bread provides long-lasting satiety.'
    },
    {
      id: 'news-3',
      title: 'The Superfood Benefits of Raw Forest Wildflower Honey',
      date: 'Sep 17, 2026',
      readTime: '5 min read',
      category: 'Nutrition',
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=700&auto=format&fit=crop&q=80',
      summary: 'Discover how unprocessed, unpasteurized honey preserves active enzymes, pollen, and natural antibacterial properties.',
      content: 'Raw honey has been revered for millennia for its medicinal properties. Unlike commercial processed syrups, raw wildflower honey preserves live propolis and pollen grains that naturally fortify your immune system.'
    },
    {
      id: 'news-4',
      title: 'Guide to Grilling Perfect Halal Angus Beef Steaks',
      date: 'Sep 14, 2026',
      readTime: '7 min read',
      category: 'Recipes',
      image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=700&auto=format&fit=crop&q=80',
      summary: 'Mastering skillet heat, sea salt crusting, and resting techniques for juicy, tender beef steaks.',
      content: 'To achieve a restaurant-grade sear on grass-fed beef, ensure the meat is brought to room temperature 30 minutes before hitting a smoking hot cast iron skillet. Baste with clarified butter and fresh rosemary.'
    },
    {
      id: 'news-5',
      title: 'Cooking Wild Salmon: Pan Sear vs Oven Bake',
      date: 'Sep 10, 2026',
      readTime: '5 min read',
      category: 'Recipes',
      image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=700&auto=format&fit=crop&q=80',
      summary: 'Comparing methods for crispy skin versus melt-in-your-mouth flakiness with fresh Atlantic salmon.',
      content: 'Wild salmon cooks significantly faster than farmed varieties due to its leaner muscle structure. Keep the skin crispy by pressing firmly onto the skillet for the first 3 minutes.'
    },
    {
      id: 'news-6',
      title: 'Why Cold Chain Logistics Matter for Fresh Chicken',
      date: 'Sep 06, 2026',
      readTime: '4 min read',
      category: 'Healthy Living',
      image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=700&auto=format&fit=crop&q=80',
      summary: 'How maintaining strict 2°C temperature throughout transit ensures unmatched poultry safety.',
      content: 'At Local Run, our insulated delivery bags with cooling gel packs keep farm cuts at optimal chilling temperature until they reach your refrigerator door.'
    }
  ];

  return (
    <div className="w-full bg-[#FAFAFA] font-sans selection:bg-[#FF7622]/20">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 py-8 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold">
            <span onClick={() => onNavigate?.('home')} className="hover:text-[#FF7622] cursor-pointer">Home</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-700">News &amp; Recipes</span>
          </div>
          <h1 className="text-3xl font-black text-[#1F2229]">
            Latest Kitchen News &amp; Farm Guides
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Explore delicious home recipes, health insights, and fresh food handling guides.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedArticle(item)}
              className="rounded-3xl border border-stone-200/80 overflow-hidden hover:shadow-xl transition-all group bg-white cursor-pointer flex flex-col justify-between"
            >
              <div className="h-52 overflow-hidden bg-stone-100 relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black text-[#FF7622] shadow-xs">
                  {item.category}
                </span>
              </div>

              <div className="p-6 space-y-3 text-left flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-[11px] text-stone-400 font-bold">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>{item.readTime}</span>
                  </div>

                  <h3 className="font-black text-base text-[#1F2229] group-hover:text-[#FF7622] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#FF7622]">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-64 rounded-2xl overflow-hidden">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3 text-xs text-slate-400 font-bold">
                <span className="text-[#FF7622] font-black">{selectedArticle.category}</span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>

              <h2 className="text-2xl font-black text-[#1F2229] leading-snug">
                {selectedArticle.title}
              </h2>

              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {selectedArticle.summary}
              </p>

              <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 text-xs text-stone-700 leading-relaxed">
                {selectedArticle.content}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate?.('shop')}
                className="w-full py-3.5 rounded-xl bg-[#FF7622] text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-[#E56314]"
              >
                Shop Related Ingredients Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
