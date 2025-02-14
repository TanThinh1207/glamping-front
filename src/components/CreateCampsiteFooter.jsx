import React from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom';

const pageSteps = [
  "overview",
  "about-your-place",
  "location",
  "camp-type",
  "services",
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
          className="h-1 bg-green-500 transition-all duration-500"
          style={{ width: `${(currentStepIndex / (pageSteps.length - 1)) * 100}%` }}
        />
      </div>
      {/* Button */}
      <div className="flex justify-between items-center p-4">
        {step === "overview" ? (
          <button
            className="bg-gradient-to-r from-green-400 to-yellow-300 text-white text-lg px-4 py-2 rounded-md text-end"
            onClick={() => navigate(`/hosting/create-campsite/${id}/about-your-place`)}
          >
            Get started
          </button>
        ) : (
          <>
            {/* Back Button */}
            {prevStep && (
              <button
                className="text-blue-600 underline"
                onClick={() => navigate(`/hosting/create-campsite/${id}/${prevStep}`)}
              >
                Back
              </button>
            )}

            {/* Next Button or Finish Button */}
            {step === "receipt" ? (
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={() => navigate("/hosting")}
              >
                Finish
              </button>
            ) : (
              <button
                className="bg-black text-white px-4 py-2 rounded-md"
                onClick={() => navigate(`/hosting/create-campsite/${id}/${nextStep}`)}
              >
                Next
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CreateCampsiteFooter