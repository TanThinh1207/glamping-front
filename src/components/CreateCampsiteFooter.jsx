import React, { useState } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useCampsite } from '../context/CampsiteContext';
import axios from 'axios';
const pageSteps = [
  "overview",
  "about-your-place",
  "stand-out",
  "services",
  "location",
  "camp-type",
];

const CreateCampsiteFooter = () => {
  const { campsiteData } = useCampsite();
  const { campsiteImages } = useCampsite();
  const { campTypeImages } = useCampsite();
  const { serviceImages } = useCampsite();
  const { resetCampsiteData } = useCampsite();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { step } = useParams();
  const currentStepIndex = pageSteps.indexOf(step);
  const prevStep = currentStepIndex > 0 ? pageSteps[currentStepIndex - 1] : null;
  const nextStep = currentStepIndex < pageSteps.length - 1 ? pageSteps[currentStepIndex + 1] : null;

  const handleUploadImage = async (ids, images, type) => {
    const validImages = images.filter((_, index) => ids[index] !== undefined);
    const validIds = ids.filter(id => id !== undefined);

    for (let i = 0; i < validImages.length; i++) {
      const formData = new FormData();
      formData.append("id", validIds[i]);
      formData.append("file", validImages[i]);
      formData.append("type", type);

      await axios.post(
        `${import.meta.env.VITE_API_IMAGE}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_GET_CAMPSITES}`;
      const response = await axios.post(url, campsiteData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const campsiteId = response.data.data.id;
      const serviceIds = response.data.data.campSiteSelectionsList?.map(service => service.id);
      const campTypeIds = response.data.data.campSiteCampTypeList?.map(campType => campType.id);

      if (campsiteImages.length > 0) {
        const formData = new FormData();
        formData.append("id", campsiteId);
        campsiteImages.forEach((image) => {
          formData.append("file", image);
        });
        await axios.post(
          `${import.meta.env.VITE_API_CAMPSITE_IMAGE}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      if (serviceIds.length > 0 && serviceImages.length > 0) {
        await handleUploadImage(serviceIds, serviceImages, "selection");
      }

      if (campTypeIds.length > 0 && campTypeImages.length > 0) {
        await handleUploadImage(campTypeIds, campTypeImages, "campType");
      }

      resetCampsiteData();
      navigate("/hosting");
    } catch (error) {
      console.error("Error creating campsite:", error);
    } finally {
      setLoading(false);
    }

    console.log(campsiteData);
  }
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
              onClick={() => navigate(`/hosting/create-campsite/about-your-place`)}
            >
              Get started
            </button>
          </div>
        ) : (
          <div className='flex justify-between'>
            {prevStep && (
              <button
                className="text-black px-5 underline mx-4 text-xl font-semibold"
                onClick={() => navigate(`/hosting/create-campsite/${prevStep}`)}
              >
                Back
              </button>
            )}
            {step === "camp-type" ? (
              // <button
              //   className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-3 rounded-md text-xl font-semibold mx-4"
              //   onClick={handleFinish}
              // >
              //   Finish
              // </button>
              <button
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-3 rounded-md text-xl font-semibold mx-4 flex items-center justify-center"
                onClick={handleFinish}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-6 w-6 mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  "Finish"
                )}
              </button>
            ) : (
              <button
                className="bg-black text-white px-5 py-3 rounded-md text-xl font-semibold mx-4"
                onClick={() => navigate(`/hosting/create-campsite/${nextStep}`)}
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