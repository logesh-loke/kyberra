import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { MdClose, MdBusiness, MdPerson, MdEmail, MdPhone, MdLocationOn, MdLanguage } from 'react-icons/md'
import axiosInstance from 'src/api/Api'
import { COUNTRY_CODES } from 'src/constant/countrycode.constant'
const CompanyEditModal = ({ company, onClose }) => {
  const [formData, setFormData] = useState({
    id: company?.id || '',
    company_name: company?.company_name || '',
    buyer_name: company?.buyer_name || '',
    email_id: company?.email_id || '',
    phone_number: company?.phone_number || '',
    country_code: company?.country_code || '+91',
    street_address: company?.street_address || '',
    city: company?.city || '',
    pincode: company?.pincode || '',
    area: company?.area || '',
    country: company?.country || '',
    domain: company?.domain || '',
  })

  const { mutate: editMutate } = useMutation({
    mutationKey: ['editCompany'],
    mutationFn: (payload) => axiosInstance.put('/require/company', payload),
    onSuccess: () => {
        toast.success('Company details updated successfully');
        onClose()
    },
    onError: () => {
        toast.error('Failed to update company details');
    }
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    editMutate(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm z-50">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Premium Header with gradient */}
        <div className="bg-[#676CE7] px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <MdBusiness className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Edit Company Details</h2>
                <p className="text-blue-100 text-sm">Update company information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <MdClose className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 min-h-[300px] max-h-[500px] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Company Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MdBusiness className="text-gray-400" />
                Company Name
              </label>
              <input
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter company name"
              />
            </div>

            {/* Buyer Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MdPerson className="text-gray-400" />
                Buyer Name
              </label>
              <input
                name="buyer_name"
                value={formData.buyer_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter buyer name"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MdEmail className="text-gray-400" />
                Email Address
              </label>
              <input
                name="email_id"
                type="email"
                value={formData.email_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="company@example.com"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MdPhone className="text-gray-400" />
                Phone Number
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <select
                    name="country_code"
                    value={formData.country_code}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                  >
                    {COUNTRY_CODES.map((code, index) => (
                        <option key={index} value={code.code}>{code.code} {code.short}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <input
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="flex-[2] px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Phone number"
                />
              </div>
            </div>

            {/* Street Address */}
            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MdLocationOn className="text-gray-400" />
                Street Address
              </label>
              <input
                name="street_address"
                value={formData.street_address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter complete street address"
              />
            </div>

            {/* Area */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Area</label>
              <input
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter area"
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter city"
              />
            </div>

            {/* Pincode */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Pincode</label>
              <input
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter pincode"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Country</label>
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter country"
              />
            </div>

            {/* Domain */}
            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MdLanguage className="text-gray-400" />
                 Domain
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">https://</span>
                </div>
                <input
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  className="w-full pl-20 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="example.com"
                />
              </div>
            </div>
          </div>

          {/* Footer with Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CompanyEditModal