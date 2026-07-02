import React, { useState } from 'react';
import { GovHeader } from './components/GovHeader';
import { GovFooter } from './components/GovFooter';
import { DynamicForm } from './components/DynamicForm';
import { udyamSchema } from './constants/schema';
import { apiClient } from './api/client';
import { CheckCircle2, ShieldCheck, FileText, ChevronRight } from 'lucide-react';

type WizardStep = 'aadhaar' | 'otp' | 'pan' | 'success';

export default function App() {
  const [step, setStep] = useState<WizardStep>('aadhaar');
  const [aadhaarData, setAadhaarData] = useState({
    aadhaarNumber: '',
    ownerName: '',
    aadhaarConsent: false,
  });
  const [otp, setOtp] = useState('');
  const [panData, setPanData] = useState({
    orgType: '',
    panNumber: '',
    panOwnerName: '',
    panOwnerDOB: '',
    panConsent: false,
    itrFiled: '',
    gstinAvailable: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiSuccess, setApiSuccess] = useState('');
  const [apiError, setApiError] = useState('');
  
  // Verification states
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [panVerified, setPanVerified] = useState(false);
  const [retrievedData, setRetrievedData] = useState<any>(null);

  // Field validation helper
  const validateFields = (fields: any[], data: Record<string, any>): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      const val = data[field.name];

      if (field.required && (val === undefined || val === null || val === '' || val === false)) {
        newErrors[field.name] = field.errorText || 'This field is required';
        isValid = false;
      } else if (val && field.validationRegex) {
        const regex = new RegExp(field.validationRegex);
        if (!regex.test(String(val))) {
          newErrors[field.name] = field.errorText || 'Invalid format';
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setApiSuccess('');

    const schemaFields = udyamSchema.step1;
    if (!validateFields(schemaFields, aadhaarData)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/send-otp', {
        aadhaarNumber: aadhaarData.aadhaarNumber,
        ownerName: aadhaarData.ownerName,
      });

      if (response.data.success) {
        setApiSuccess(response.data.message);
        setStep('otp');
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1.1: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setApiSuccess('');

    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'OTP must be exactly 6 digits' });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/verify-aadhaar', {
        aadhaarNumber: aadhaarData.aadhaarNumber,
        ownerName: aadhaarData.ownerName,
        otp,
      });

      if (response.data.success) {
        setAadhaarVerified(true);
        setApiSuccess(response.data.message);
        // Advance to Step 2 (PAN Verification)
        setTimeout(() => {
          setStep('pan');
          setApiSuccess('');
        }, 1500);
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Invalid OTP entered.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Validate PAN and Submit Form
  const handleSubmitPan = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setApiSuccess('');

    // Normalize PAN input to uppercase before validation
    const normalizedPanData = {
      ...panData,
      panNumber: panData.panNumber.toUpperCase(),
    };

    const schemaFields = udyamSchema.step2;
    if (!validateFields(schemaFields, normalizedPanData)) {
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Verify PAN first
      const panResponse = await apiClient.post('/verify-pan', {
        orgType: normalizedPanData.orgType,
        panNumber: normalizedPanData.panNumber,
      });

      if (panResponse.data.success) {
        setPanVerified(true);
        
        // 2. Submit the entire form to store in DB
        const submitResponse = await apiClient.post('/submit', {
          aadhaarNumber: aadhaarData.aadhaarNumber,
          ownerName: aadhaarData.ownerName,
          aadhaarVerified: true,
          orgType: normalizedPanData.orgType,
          panNumber: normalizedPanData.panNumber,
          panOwnerName: normalizedPanData.panOwnerName,
          panOwnerDOB: normalizedPanData.panOwnerDOB,
          panVerified: true,
          itrFiled: normalizedPanData.itrFiled,
          gstinAvailable: normalizedPanData.gstinAvailable,
        });

        if (submitResponse.data.success) {
          const createdRecord = submitResponse.data.data;

          // 3. Fetch the saved record with the secure x-api-key header to verify it
          const retrieveResponse = await apiClient.get(`/${createdRecord.id}`, {
            headers: {
              'x-api-key': 'udyam_secret_key_123', // Static API Key config from backend env
            },
          });

          if (retrieveResponse.data.success) {
            setRetrievedData(retrieveResponse.data.data);
          }

          setStep('success');
        }
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'PAN verification or submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <GovHeader />

      {/* Main container */}
      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-8">
        
        {/* Progress steps bar */}
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex justify-between items-center text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
              aadhaarVerified ? 'bg-green-600 text-white' : 'bg-blue-800 text-white'
            }`}>1</span>
            <span className="font-bold text-gray-700">Aadhaar Verification</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
              panVerified ? 'bg-green-600 text-white' : step === 'pan' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-600'
            }`}>2</span>
            <span className={`font-bold ${step === 'pan' ? 'text-gray-700' : 'text-gray-400'}`}>PAN Verification</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
              step === 'success' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>3</span>
            <span className={`font-bold ${step === 'success' ? 'text-gray-700' : 'text-gray-400'}`}>Complete</span>
          </div>
        </div>

        {/* Form panel container */}
        <div className="bg-white border border-gray-200 rounded shadow-md overflow-hidden">
          
          {/* Header of active form */}
          <div className="bg-[#1e3a8a] text-white px-5 py-3.5 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-bold tracking-wide uppercase text-sm">
              {step === 'aadhaar' || step === 'otp' ? 'Step 1: Aadhaar Verification' : step === 'pan' ? 'Step 2: PAN Verification' : 'Registration Complete'}
            </span>
          </div>

          {/* Form wrapper */}
          <div className="p-6">
            
            {step === 'aadhaar' && (
              <div>
                <p className="text-sm text-gray-500 mb-6 font-semibold border-b border-gray-100 pb-2">
                  Please validate the entrepreneur's Aadhaar to begin registration.
                </p>
                <DynamicForm
                  fields={udyamSchema.step1}
                  formData={aadhaarData}
                  errors={errors}
                  onChange={(name, val) => setAadhaarData(prev => ({ ...prev, [name]: val }))}
                  onSubmit={handleSendOtp}
                  submitButtonLabel="Validate & Generate OTP"
                  isSubmitting={isSubmitting}
                  errorMessage={apiError}
                  successMessage={apiSuccess}
                />
              </div>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-2">Enter OTP Sent to Mobile</h3>
                  <p className="text-xs text-gray-500 mb-4">
                    An OTP has been sent to the mobile number registered with Aadhaar <span className="font-bold text-gray-800">{aadhaarData.aadhaarNumber}</span>.
                  </p>
                  
                  {apiError && (
                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-semibold rounded">
                      {apiError}
                    </div>
                  )}

                  {apiSuccess && (
                    <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-xs font-semibold rounded">
                      {apiSuccess}
                    </div>
                  )}

                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-Digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    disabled={isSubmitting}
                    className={`w-full p-2.5 text-sm bg-white border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.otp ? 'border-red-500 focus:ring-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.otp && (
                    <span className="text-xs font-bold text-red-600 block mt-1">
                      {errors.otp}
                    </span>
                  )}
                  
                  <span className="text-[10px] text-gray-400 block mt-2">
                    * Hint: Use the simulated OTP code <strong className="text-gray-600">123456</strong> to proceed.
                  </span>
                </div>

                <div className="pt-4 flex justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('aadhaar')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded text-sm hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-sm transition shadow-md"
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              </form>
            )}

            {step === 'pan' && (
              <div>
                <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs font-bold rounded mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Aadhaar verified successfully for {aadhaarData.ownerName}. Proceeding to PAN validation.
                </div>

                <DynamicForm
                  fields={udyamSchema.step2}
                  formData={panData}
                  errors={errors}
                  onChange={(name, val) => setPanData(prev => ({ ...prev, [name]: val }))}
                  onSubmit={handleSubmitPan}
                  submitButtonLabel="Validate PAN"
                  isSubmitting={isSubmitting}
                  errorMessage={apiError}
                  successMessage={apiSuccess}
                />
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 mb-2">Registration Verification Complete!</h2>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-8">
                  Your Aadhaar and PAN details have been successfully verified and saved to the registry database.
                </p>

                {retrievedData && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-left max-w-xl mx-auto shadow-sm">
                    <h3 className="font-bold text-gray-700 border-b border-gray-200 pb-2 mb-4 flex items-center gap-1.5 text-sm uppercase">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Submission Details (Fetched from Database)
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs md:text-sm">
                      <div>
                        <span className="text-gray-400 block font-semibold uppercase text-[10px]">Reference ID</span>
                        <span className="font-mono text-gray-700 break-all">{retrievedData.id}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-semibold uppercase text-[10px]">Entrepreneur Name</span>
                        <span className="font-bold text-gray-800">{retrievedData.ownerName}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-semibold uppercase text-[10px]">Aadhaar Number</span>
                        <span className="font-mono text-gray-700">{retrievedData.aadhaarNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-semibold uppercase text-[10px]">Organisation Type</span>
                        <span className="font-bold text-gray-800">{retrievedData.orgType}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-semibold uppercase text-[10px]">PAN Number</span>
                        <span className="font-mono font-bold text-gray-800">{retrievedData.panNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-semibold uppercase text-[10px]">PAN Holder Name</span>
                        <span className="font-bold text-gray-800">{retrievedData.panOwnerName}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-semibold uppercase text-[10px]">Aadhaar Verified</span>
                        <span className="text-green-600 font-bold">Yes</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-semibold uppercase text-[10px]">PAN Verified</span>
                        <span className="text-green-600 font-bold">Yes</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-4">
                  <button
                    onClick={() => {
                      setStep('aadhaar');
                      setAadhaarData({ aadhaarNumber: '', ownerName: '', aadhaarConsent: false });
                      setOtp('');
                      setPanData({
                        orgType: '',
                        panNumber: '',
                        panOwnerName: '',
                        panOwnerDOB: '',
                        panConsent: false,
                        itrFiled: '',
                        gstinAvailable: '',
                      });
                      setAadhaarVerified(false);
                      setPanVerified(false);
                      setRetrievedData(null);
                    }}
                    className="px-6 py-2.5 bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm rounded transition shadow-md"
                  >
                    Start New Verification
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  );
}
