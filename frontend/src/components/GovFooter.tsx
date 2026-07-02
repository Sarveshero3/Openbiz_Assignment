import React from 'react';

export const GovFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#2d3748] text-white text-xs py-8 mt-12 border-t-4 border-orange-500">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-sm uppercase text-orange-400 mb-3">Office of DCMSME</h4>
          <p className="text-gray-300 leading-relaxed">
            Nirman Bhawan, Seventh Floor, Maulana Azad Road, New Delhi - 110108.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-sm uppercase text-orange-400 mb-3">Ministry of MSME</h4>
          <p className="text-gray-300 leading-relaxed">
            Udyog Bhawan, Rafi Marg, New Delhi - 110011.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-sm uppercase text-orange-400 mb-3">Get In Touch</h4>
          <ul className="text-gray-300 space-y-2">
            <li>Email: <span className="text-white font-semibold">champions@gov.in</span></li>
            <li>For Grievance: <a href="#" className="underline text-blue-300 hover:text-blue-100">Click Here</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-sm uppercase text-orange-400 mb-3">Disclaimer</h4>
          <p className="text-gray-400 leading-relaxed">
            This is a high-fidelity educational demonstration clone. Information entered here is simulated for validation testing.
          </p>
        </div>
      </div>
      <div className="w-full border-t border-gray-700 mt-8 pt-4 text-center text-gray-500">
        &copy; {new Date().getFullYear()} Ministry of Micro, Small and Medium Enterprises, Government of India. All Rights Reserved.
      </div>
    </footer>
  );
};
