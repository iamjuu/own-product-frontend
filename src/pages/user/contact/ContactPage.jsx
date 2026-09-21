import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ChevronDown } from 'lucide-react';

export const ContactPage = ({ onNavigate }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 4000);
  };

  const faqs = [
    {
      q: 'How fast is Local Run doorstep delivery?',
      a: 'Our average delivery time is 20 to 30 minutes. We utilize local fulfillment hubs and live GPS dispatched rider partners.'
    },
    {
      q: 'Are all chicken and beef products strictly Halal certified?',
      a: 'Yes, 100% of our poultry and meat cuts are certified Halal, humanely raised, free from growth hormones, and processed in hygienic cold facilities.'
    },
    {
      q: 'What happens if an item is out of stock or damaged?',
      a: 'We offer an instant refund or rider replacement guarantee. You can reach our 24/7 hotline or submit a claim directly in the app.'
    },
    {
      q: 'Is there a minimum order amount for free delivery?',
      a: 'All orders over ₹499 qualify for free home delivery. Smaller orders incur a low flat fee of ₹30.'
    }
  ];

  return (
    <div className="w-full bg-[#FAFAFA] font-sans selection:bg-[#FF7622]/20">
      
      {/* Header */}
      <div className="bg-[#FFF9F5] border-b border-orange-100/60 py-12 px-6 text-center space-y-2">
        <span className="text-xs font-black uppercase tracking-widest text-[#FF7622]">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1F2229]">
          Contact Local Run Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto font-medium">
          Have a question about your order, partner farms, or delivery fleet? We are here 24/7 to help.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 space-y-12">
        
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF7622] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-[#1F2229]">Central Hub</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              542, Halal Tower, 42nd St, Manhattan, New York, NY 10018
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF7622] flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-[#1F2229]">24/7 Phone Support</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              +1 (800) 425-2500 <br />
              Direct rider dispatch line
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF7622] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-[#1F2229]">Email Inquiries</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              support@localrun.com <br />
              halal@marketplace.com
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF7622] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-[#1F2229]">Operating Hours</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Monday – Sunday: <br />
              6:00 AM – 11:30 PM EST
            </p>
          </div>
        </div>

        {/* Form and FAQ 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 text-left">
            <div>
              <h3 className="text-xl font-black text-[#1F2229]">Send Us a Message</h3>
              <p className="text-xs text-slate-500 mt-0.5">We respond within 15 minutes during live hours.</p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-800">Message Received!</h4>
                <p className="text-xs text-emerald-600">
                  Thank you for reaching out. Our support specialist will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-600">YOUR NAME</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#FF7622] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-600">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#FF7622] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-600">PHONE NUMBER</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#FF7622] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-600">SUBJECT</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Order Inquiry / Quality / Delivery"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#FF7622] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600">YOUR MESSAGE</label>
                  <textarea
                    required
                    rows="4"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#FF7622] focus:bg-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#FF7622] hover:bg-[#E56314] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF7622]/25 transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4 text-left">
            <h3 className="text-xl font-black text-[#1F2229]">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-[#1F2229]">
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-[#FF7622]' : ''}`} />
                  </div>
                  {openFaq === idx && (
                    <p className="text-xs text-slate-500 leading-relaxed font-medium mt-2 pt-2 border-t border-slate-100">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
