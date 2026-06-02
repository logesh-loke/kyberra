import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from 'src/api/Api';
import PortalCreateCompany from './PortalCreateCompany';
import PortalCreateAdmin from './PortalCreateAdmin';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const Portal = () => {
    const {  token, plan_id, plan_name } = useParams();
    const [isCompanyCreated, setIsCompanyCreated] = useState(false);
    const [domain, setDomain] = useState('');
    const [companyId, setCompanyId] = useState('');

    const [isDesktop, setIsDesktop] = useState(true);

useEffect(() => {
  const checkScreen = () => {
    setIsDesktop(window.innerWidth >= 1024);
  };

  checkScreen(); // initial check
  window.addEventListener("resize", checkScreen);

  return () => window.removeEventListener("resize", checkScreen);
}, []);


    const { data: tokenData, mutate: tokenMutate, error: tokenError } = useMutation({
      mutationKey: ["token-expire"],
      mutationFn: () => axiosInstance.post('/auth/token-verify', {token: token }),
      enabled: !!token,
      onSuccess: (res) => {

      },
      onError: (err) => {
        const error = err.response.data.message;
        if (error === "Token expired") {
          toast.error("Link expired. Please request a new link.");
        }else if(error === "Invalid token") {
        toast.error("Invalid link. Please request a new link.");
      }else{
       Swal.fire({
  title: 'Backend Service Error',
  text: 'A technical issue occurred in the backend service. Please contact your administrator for support.',
  icon: 'error',
  confirmButtonText: 'OK'
});

      }
      }
    })

      useEffect(() => {
    if (token) {
      tokenMutate({ token: token });
    }
  }, [token, tokenMutate]);

if (tokenError?.response?.data?.message === "Token expired" || tokenError?.response?.data?.message === "Invalid token") {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center space-y-4">
        
        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-7 w-7 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86l-6.17 10.7A1.5 1.5 0 005.41 17h13.18a1.5 1.5 0 001.29-2.44l-6.17-10.7a1.5 1.5 0 00-2.42 0z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-slate-800">
          Link Expired
        </h2>

        {/* Description */}
        <p className="text-slate-600">
          This registration link has expired and can no longer be used.
        </p>

        <p className="text-sm text-slate-500">
          Please request a new invite or contact your administrator.
        </p>
      </div>
    </div>
  );
}


  if (!isDesktop) {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">
          Desktop Required
        </h2>

        <p className="text-slate-600">
          Crypsyn Portal is available only on desktop or laptop devices.
        </p>

        <p className="text-sm text-slate-500">
          Please open this link on a desktop or laptop browser to continue.
        </p>
      </div>
    </div>
  );
}

    
  return (
    <div className='h-screen overflow-auto'>
      {isCompanyCreated ? (
        <PortalCreateAdmin companyId={companyId} domain={domain} token={token} setIsCompanyCreated={setIsCompanyCreated} plan_id={plan_id} plan_name={plan_name} />
      ): (
      <PortalCreateCompany setCompanyId={setCompanyId} setDomain={setDomain} token={token} setIsCompanyCreated={setIsCompanyCreated} plan_id={plan_id} plan_name={plan_name} />
      )}
    </div>
  )
}

export default Portal
