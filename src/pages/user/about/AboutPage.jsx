import React from 'react';
import { 
  Sprout, 
  Truck, 
  ShieldCheck, 
  Award, 
  Users, 
  Heart, 
  ArrowRight, 
  CheckCircle2, 
  Star 
} from 'lucide-react';

export const AboutPage = ({ onNavigate }) => {
  return (
    <div className="w-full bg-white font-sans selection:bg-[#FF7622]/20">
      
      {/* Hero Header */}
      <section className="bg-[#FFF9F5] py-16 lg:py-20 border-b border-orange-100/60">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#FF7622]">
            About Local Run
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1F2229] tracking-tight max-w-2xl mx-auto leading-tight">
            Delivering Pure Nature &amp; Fresh Harvests Since 2020
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            We bridge local organic farmers, certified halal butchers, and coastal fishermen directly with your kitchen table with 30-minute doorstep delivery.
          </p>
        </div>
      </section>

      {/* Mission & Story */}
      <section className="py-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF7622]">
              Our Mission
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1F2229] leading-snug">
              Fresh Vegetables, Farm Chicken, Wild Fish, Prime Beef &amp; Pure Groceries
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              At Local Run, we believe food should be transparent, fresh, and free from synthetic preservatives. Every morning, our fleet inspects local greenhouses and coastal harbors to collect vegetables, meats, and seafood harvested only hours earlier.
            </p>
            
            <div className="space-y-3 pt-2">
              {[
                '100% Halal Slaughter & Certified Cold Chain Logistics',
                'Zero Artificial Preservatives & Chemical Sprays',
                'Hyperlocal 30-Minute Doorstep Rider Fleet',
                'Direct Farmer Profit Sharing & Fair Trade Guarantees'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-xs sm:text-sm font-bold text-stone-800">
                  <CheckCircle2 className="w-5 h-5 text-[#FF7622] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button 
                onClick={() => onNavigate?.('shop')}
                className="px-8 py-3.5 rounded-xl bg-[#FF7622] hover:bg-[#E56314] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF7622]/25 transition-all flex items-center space-x-2"
              >
                <span>Shop Fresh Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
                alt="Local Run Organic Farm"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-14 bg-[#FFF9F5] border-t border-b border-orange-100/60">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '45,000+', label: 'Delighted Customers' },
            { num: '120+', label: 'Organic Partner Farms' },
            { num: '30 Min', label: 'Average Delivery Time' },
            { num: '99.8%', label: 'Positive Freshness Rating' }
          ].map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-[#FF7622] font-mono">
                {stat.num}
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-10">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#FF7622]">
            What Our Food Lovers Say
          </span>
          <h3 className="text-3xl font-black text-[#1F2229] mt-1">
            Real Customer Reviews
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              name: 'Dr. Sarah Jenkins',
              role: 'Nutritionist, NYC',
              quote: 'The chicken and wild salmon cuts from Local Run are incomparably tender. The cold chain delivery was right on time within 25 minutes!',
              rating: 5
            },
            {
              name: 'Chef Tariq Mansoor',
              role: 'Executive Chef',
              quote: 'Finding 100% verified Halal beef steaks and organic heirloom vegetables with such consistency is a game changer for our weekend family dinners.',
              rating: 5
            },
            {
              name: 'Priya Sharma',
              role: 'Mother & Home Cook',
              quote: 'The raw wildflower honey and organic pantry staples are exceptional quality. The app and delivery riders are courteous and reliable.',
              rating: 5
            }
          ].map((rev, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center space-x-1">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                "{rev.quote}"
              </p>
              <div>
                <h4 className="font-extrabold text-xs text-stone-800">{rev.name}</h4>
                <span className="text-[11px] text-slate-400 font-semibold">{rev.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
