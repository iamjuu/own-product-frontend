import React, { useState } from 'react';
import {
  Bike,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  User,
  Check,
  Zap,
  DollarSign,
  Clock,
  UploadCloud,
  FileCheck2,
  Trash2
} from 'lucide-react';
import ApiClient from '../../api/client';

export const DeliveryPartnerApplyModal = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleType: 'BIKE',
    vehicleNumber: '',
  });

  const [docFiles, setDocFiles] = useState({
    dl: null,
    aadhaar: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedPartner, setSubmittedPartner] = useState(null);

  const vehicleOptions = [
    { id: 'BIKE', label: 'Motorbike', icon: '🏍️', desc: 'Fast & standard' },
    { id: 'SCOOTER', label: 'Scooter', icon: '🛵', desc: 'City friendly' },
    { id: 'EV_BIKE', label: 'EV Bike', icon: '⚡', desc: 'Low cost & eco' },
    { id: 'CYCLE', label: 'Bicycle', icon: '🚲', desc: 'Short radius' },
    { id: 'CAR', label: 'Car', icon: '🚗', desc: 'Bulk catering' },
  ];

  const handleFileChange = (key, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError(`File '${file.name}' is too large. Max allowed size is 10MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setDocFiles((prev) => ({
        ...prev,
        [key]: {
          name: file.name,
          size: `${Math.round(file.size / 1024)} KB`,
          type: file.type,
          dataUrl: event.target.result,
        },
      }));
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (key) => {
    setDocFiles((prev) => ({
      ...prev,
      [key]: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setError('Please fill in your name, mobile number, and email.');
      return;
    }

    // Require Driving License and Aadhaar
    if (!docFiles.aadhaar) {
      setError('Please upload your Aadhaar Card (or National Photo ID) to continue.');
      return;
    }
    if (!docFiles.dl && formData.vehicleType !== 'CYCLE') {
      setError('Please upload your Driving License (DL) to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const documents = [
        {
          name: 'Driving License',
          status: 'PENDING',
          fileName: docFiles.dl?.name || 'driving_license.pdf',
          fileSize: docFiles.dl?.size || '210 KB',
          url: docFiles.dl?.dataUrl || 'https://example.com/docs/dl_sample.pdf',
        },
        {
          name: 'National Identity Proof (Aadhaar)',
          status: 'PENDING',
          fileName: docFiles.aadhaar?.name || 'aadhaar_card.pdf',
          fileSize: docFiles.aadhaar?.size || '245 KB',
          url: docFiles.aadhaar?.dataUrl || 'https://example.com/docs/id_sample.pdf',
        },
      ];

      const res = await ApiClient.post('/public/delivery-partners/apply', {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber.trim() || 'N/A',
        documents,
      });

      if (res.success) {
        setIsSuccess(true);
        setSubmittedPartner(res.data);
        if (onSuccess) onSuccess(res.data);
      } else {
        setError(res.message || 'Failed to submit application');
      }
    } catch (err) {
      setError(err.message || 'Submission failed. Please check your network and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setSubmittedPartner(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      vehicleType: 'BIKE',
      vehicleNumber: '',
    });
    setDocFiles({ dl: null, aadhaar: null });
    setError(null);
    onClose();
  };

  const uploadedCount = (docFiles.dl ? 1 : 0) + (docFiles.aadhaar ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#181829] via-[#241f3d] to-[#181829] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6339f4] to-[#10b981] flex items-center justify-center text-white shadow-md">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-black tracking-tight text-white">
                  Join Our Delivery Fleet
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ⚡ Rider Onboarding
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Earn competitive payouts with flexible duty hours & weekly settlements.
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[85vh] overflow-y-auto space-y-5 text-xs">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200 shadow-md">
                <CheckCircle2 className="w-9 h-9 animate-bounce" />
              </div>

              <div>
                <h3 className="text-lg font-black text-[#181829]">
                  Application Submitted Successfully!
                </h3>
                <p className="text-xs text-[#8a87a6] mt-1 max-w-md mx-auto">
                  Thank you, <span className="font-bold text-[#181829]">{submittedPartner?.name}</span>. Your KYC documents are currently in our Operations review queue.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-left max-w-md mx-auto space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Applicant Name:</span>
                  <span className="font-bold text-[#181829]">{submittedPartner?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Contact Email:</span>
                  <span className="font-bold text-[#181829]">{submittedPartner?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Vehicle Selected:</span>
                  <span className="font-bold text-[#6339f4]">{submittedPartner?.vehicleType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Plate Number:</span>
                  <span className="font-mono font-bold text-slate-700">{submittedPartner?.vehicleNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Verification Status:</span>
                  <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[10px]">
                    PENDING_VERIFICATION
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center space-x-2 max-w-md mx-auto">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Once our Operations Admin verifies your Driving License and Aadhaar, you will receive your login password directly at <strong>{submittedPartner?.email}</strong> via email!
                </span>
              </div>

              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-white font-bold text-xs shadow-lg shadow-[#6339f4]/25 transition-all"
              >
                Close & Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {/* Perks Strip */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-2xl bg-[#ece8ff]/60 border border-[#d8cfff] space-y-1">
                  <DollarSign className="w-4 h-4 text-[#6339f4] mx-auto" />
                  <p className="font-bold text-[#181829] text-[11px]">Weekly Payouts</p>
                  <p className="text-[9px] text-[#8a87a6]">Direct Bank Transfer</p>
                </div>
                <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <Clock className="w-4 h-4 text-emerald-600 mx-auto" />
                  <p className="font-bold text-[#181829] text-[11px]">Flexible Hours</p>
                  <p className="text-[9px] text-[#8a87a6]">Login when you want</p>
                </div>
                <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <ShieldCheck className="w-4 h-4 text-amber-600 mx-auto" />
                  <p className="font-bold text-[#181829] text-[11px]">Free Insurance</p>
                  <p className="text-[9px] text-[#8a87a6]">On-duty trip coverage</p>
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-3 pt-1">
                <h4 className="font-black text-[#181829] uppercase tracking-wider text-[11px]">
                  1. Personal & Contact Details (As per Aadhaar)
                </h4>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#181829] mb-1">
                      Full Legal Name (as per Aadhaar Card) *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#8a87a6] absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Muhammed Ajmal"
                        className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#181829] mb-1">
                        Mobile Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#8a87a6] absolute left-3 top-3" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98450 12345"
                          className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#181829] mb-1">
                        Email Address (Credentials will be sent here) *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#8a87a6] absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="ajmal@example.com"
                          className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs text-[#181829] focus:outline-none focus:border-[#6339f4]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Selection */}
              <div className="space-y-3 pt-2">
                <h4 className="font-black text-[#181829] uppercase tracking-wider text-[11px]">
                  2. Choose Your Delivery Vehicle
                </h4>

                <div className="grid grid-cols-5 gap-1.5">
                  {vehicleOptions.map((v) => {
                    const isSelected = formData.vehicleType === v.id;
                    return (
                      <button
                        type="button"
                        key={v.id}
                        onClick={() => setFormData({ ...formData, vehicleType: v.id })}
                        className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                          isSelected
                            ? 'border-[#6339f4] bg-[#ece8ff] text-[#6339f4] ring-2 ring-[#6339f4]/20 shadow-sm'
                            : 'border-slate-200 bg-[#f0f2fb]/70 text-[#181829] hover:border-slate-300'
                        }`}
                      >
                        <span className="text-lg">{v.icon}</span>
                        <span className="font-black text-[10px] mt-1">{v.label}</span>
                      </button>
                    );
                  })}
                </div>

                {formData.vehicleType !== 'CYCLE' && (
                  <div>
                    <label className="block text-[11px] font-bold text-[#181829] mb-1">
                      Vehicle Registration Plate Number *
                    </label>
                    <input
                      type="text"
                      required={formData.vehicleType !== 'CYCLE'}
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                      placeholder="e.g. KL-13-AW-4321"
                      className="w-full px-3 py-2.5 rounded-2xl bg-[#f0f2fb] border border-slate-200 text-xs uppercase font-mono font-bold text-[#181829] focus:outline-none focus:border-[#6339f4]"
                    />
                  </div>
                )}
              </div>

              {/* Real KYC Document File Uploads */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-[#181829] uppercase tracking-wider text-[11px]">
                    3. Upload Mandatory KYC Documents (Real File Upload)
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      uploadedCount >= 2
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {uploadedCount} of 2 Attached
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* 1. Aadhaar Card Upload */}
                  <div
                    className={`p-3.5 rounded-2xl border transition-all ${
                      docFiles.aadhaar
                        ? 'bg-emerald-50/50 border-emerald-300'
                        : 'bg-[#f0f2fb] border-slate-200 hover:border-[#6339f4]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            docFiles.aadhaar
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white text-[#6339f4] shadow-sm border border-slate-200'
                          }`}
                        >
                          {docFiles.aadhaar ? <FileCheck2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-[#181829] text-xs">
                            National Photo ID (Aadhaar / Passport) *
                          </p>
                          <p className="text-[10px] text-[#8a87a6]">
                            Must show full legal name for credential provisioning
                          </p>
                        </div>
                      </div>

                      {docFiles.aadhaar ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-mono font-bold text-emerald-700 bg-white px-2 py-1 rounded-lg border border-emerald-200">
                            {docFiles.aadhaar.name} ({docFiles.aadhaar.size})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile('aadhaar')}
                            className="p-1 rounded-lg hover:bg-rose-100 text-rose-600"
                            title="Remove file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label
                          htmlFor="file-aadhaar"
                          className="cursor-pointer px-3 py-1.5 rounded-xl bg-[#6339f4] hover:bg-[#5327ec] text-white font-bold text-[11px] flex items-center space-x-1.5 shadow-sm transition-all"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Upload Aadhaar</span>
                        </label>
                      )}
                      <input
                        id="file-aadhaar"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileChange('aadhaar', e)}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* 2. Driving License Upload */}
                  <div
                    className={`p-3.5 rounded-2xl border transition-all ${
                      docFiles.dl
                        ? 'bg-emerald-50/50 border-emerald-300'
                        : 'bg-[#f0f2fb] border-slate-200 hover:border-[#6339f4]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            docFiles.dl
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white text-[#6339f4] shadow-sm border border-slate-200'
                          }`}
                        >
                          {docFiles.dl ? <FileCheck2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-[#181829] text-xs">
                            Driving License (DL) *
                          </p>
                          <p className="text-[10px] text-[#8a87a6]">
                            Valid commercial or two-wheeler personal license
                          </p>
                        </div>
                      </div>

                      {docFiles.dl ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-mono font-bold text-emerald-700 bg-white px-2 py-1 rounded-lg border border-emerald-200">
                            {docFiles.dl.name} ({docFiles.dl.size})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile('dl')}
                            className="p-1 rounded-lg hover:bg-rose-100 text-rose-600"
                            title="Remove file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label
                          htmlFor="file-dl"
                          className="cursor-pointer px-3 py-1.5 rounded-xl bg-[#6339f4] hover:bg-[#5327ec] text-white font-bold text-[11px] flex items-center space-x-1.5 shadow-sm transition-all"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Upload License</span>
                        </label>
                      )}
                      <input
                        id="file-dl"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileChange('dl', e)}
                        className="hidden"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#6339f4] hover:bg-[#5327ec] text-white font-black text-xs shadow-lg shadow-[#6339f4]/30 hover:shadow-[#6339f4]/40 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <span>Submit Application with Attached KYC Files</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
