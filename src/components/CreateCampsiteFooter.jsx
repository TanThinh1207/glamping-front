import React from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom';

const pageSteps = [
  "overview",
  "about-your-place",
  "stand-out",
  "services",
  "location",
  "camp-type",
  "receipt",
];

const CreateCampsiteFooter = () => {
  const navigate = useNavigate();
  const { id, step } = useParams();
  const currentStepIndex = pageSteps.indexOf(step);
  const prevStep = currentStepIndex > 0 ? pageSteps[currentStepIndex - 1] : null;
  const nextStep = currentStepIndex < pageSteps.length - 1 ? pageSteps[currentStepIndex + 1] : null;

  return (
    <div className='fixed bottom-0 w-full bg-white'>
      {/* Processing bar */}
      <div className="w-full h-1 bg-gray-200">
        <div
          className="h-1  bg-gradient-to-r from-green-400 to-yellow-300 transition-all duration-500"
          style={{ width: `${(currentStepIndex / (pageSteps.length - 1)) * 100}%` }}
        />
      </div>
      {/* Button */}
      <div className=" p-4">
        {step === "overview" ? (
          <div className=' flex justify-end'>
            <button
              className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-semibold px-5 py-3 rounded-md mx-4 "
              onClick={() => navigate(`/hosting/create-campsite/${id}/about-your-place`)}
            >
              Get started
            </button>
          </div>
        ) : (
          <div className='flex justify-between'>
            {prevStep && (
                <button
                  className= "text-black px-5 underline mx-4 text-xl font-semibold"
                  onClick={() => navigate(`/hosting/create-campsite/${id}/${prevStep}`)}
                >
                  Back
                </button>
            )}
            {step === "receipt" ? (
                <button
                className="bg-gradient-to-r from-green-400 to-yellow-300 text-white px-5 py-3 rounded-md text-xl font-semibold mx-4"
                onClick={() => navigate("/hosting")}
              >
                Finish
              </button>
            ) : (
                <button
                className="bg-black text-white px-5 py-3 rounded-md text-xl font-semibold mx-4"
                onClick={() => navigate(`/hosting/create-campsite/${id}/${nextStep}`)}
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateCampsiteFooter