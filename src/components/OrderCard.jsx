import React, { useState } from 'react';
import { format, differenceInDays } from 'date-fns';

const OrderCard = ({ booking }) => {
  const [isRating, setIsRating] = useState(false);
  const [rating, setRating] = useState(booking.rating || 0);
  const [comment, setComment] = useState(booking.comment || '');
  const [currentRating, setCurrentRating] = useState(booking.rating || 0);
  const [currentComment, setCurrentComment] = useState(booking.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const accessToken = localStorage.getItem('accessToken');

  // Calculate nights between check-in and check-out
  const nights = differenceInDays(new Date(booking.checkOut), new Date(booking.checkIn));

  // Calculate total selection amount (extra services)
  const totalSelectionAmount = booking.bookingSelectionResponseList.reduce(
    (sum, selection) => sum + parseFloat(selection.totalAmount),
    0
  );

  // Calculate deposit amount
  const depositRate = booking.campSite.depositRate || 0.2;
  const depositAmount = booking.totalAmount * depositRate;

  // Determine paid amount based on status
  const paidAmount = booking.status === "Completed"
    ? booking.totalAmount
    : depositAmount;

  const handleRatingClick = () => {
    setIsRating(true);
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      setErrorMessage('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setLoading(true);

    try {
      const url = `${import.meta.env.VITE_API_BOOKING}/${booking.id}?status=rating&rating=${rating}${comment ? `&comment=${encodeURIComponent(comment)}` : ''}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      // Update the current values displayed in the UI
      setCurrentRating(rating);
      setCurrentComment(comment);
      
      setSuccessMessage('Thank you for your feedback!');
      setTimeout(() => {
        setIsRating(false);
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsRating(false);
    setRating(currentRating);
    setComment(currentComment);
    setErrorMessage('');
  };

  const StarRating = () => {
    return (
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(star)}
            className="focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-8 w-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          </button>
        ))}
        <span className="ml-2 text-gray-600">{rating > 0 ? `${rating}/5` : 'Select rating'}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16"></div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
      {/* Header with campsite name and status */}
      <div className="bg-gray-50 p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-canto text-2xl">🏕️ {booking.campSite.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <span className={`px-3 py-1 text-sm rounded-full ${booking.status === "Completed"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
              }`}>
              {booking.status}
            </span>
          </div>
        </div>
      </div>

      {/* Booking details section */}
      <div className="p-4 bg-white">
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-gray-500 font-canto">Check-In</p>
            <p className="font-medium">{format(new Date(booking.checkIn), "dd MMM yyyy")}</p>
          </div>
          <div>
            <p className="text-gray-500 font-canto">Check-Out</p>
            <p className="font-medium">{format(new Date(booking.checkOut), "dd MMM yyyy")}</p>
          </div>
          <div>
            <p className="text-gray-500 font-canto">Duration</p>
            <p className="font-medium">{nights} nights</p>
          </div>
          <div>
            <p className="text-gray-500 font-canto">Book Date</p>
            <p className="font-medium">{format(new Date(booking.createdAt), "dd MMM yyyy")}</p>
          </div>
        </div>

        {/* Camp types section */}
        <div className="mb-4">
          <h4 className="text-sm uppercase tracking-wider text-gray-500 font-canto mb-2">Camp Types</h4>
          <div className="space-y-3">
            {/* Group by camp type */}
            {Object.values(booking.bookingDetailResponseList.reduce((acc, detail) => {
              const type = detail.campTypeResponse?.type;
              if (!type) return acc;

              if (!acc[type]) {
                acc[type] = {
                  ...detail.campTypeResponse,
                  totalQuantity: 0,
                  totalAmount: 0
                };
              }

              acc[type].totalQuantity += 1;
              acc[type].totalAmount += detail.amount;

              return acc;
            }, {})).map((campType, index) => (
              <div key={index} className="flex items-center border-b border-gray-100 pb-3">
                <div className="w-16 h-16 flex-shrink-0 mr-4 overflow-hidden rounded">
                  <img
                    src={campType.image}
                    alt={campType.type}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h5 className="font-canto text-xl">{campType.type}</h5>
                  <div className="flex gap-2">
                    <span className="text-gray-500 font-canto text-lg">Capacity: {campType.capacity} persons</span>
                    <span>•</span>
                    <span className="text-gray-500 font-canto text-lg">Per Night: {campType.price.toLocaleString("vi-VN")}VND</span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4 text-right">
                  <div className="font-canto text-lg">x{campType.totalQuantity}</div>
                  <div className="text-purple-900 font-canto text-lg">{campType.totalAmount.toLocaleString("vi-VN")}VND</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Extra services section - only if there are services */}
        {booking.bookingSelectionResponseList.length > 0 && (
          <div className="mb-4">
            <h4 className="text-lg uppercase tracking-wider text-gray-500 font-canto mb-2">Extra Services</h4>
            <div className="space-y-2">
              {booking.bookingSelectionResponseList.map((selection, index) => (
                <div key={index} className="flex justify-between text-sm pb-1">
                  <span className='font-canto text-lg'>{selection.name}</span>
                  <div>
                    <span className="text-gray-500 mr-3 font-canto text-lg">x{selection.quantity}</span>
                    <span className='font-canto text-lg text-purple-900'>{(parseFloat(selection.totalAmount) / parseFloat(selection.quantity)).toLocaleString("vi-VN")}VND</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment summary */}
        <div className="mt-6 pt-4 border-t border-gray-200 font-canto text-xl">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Total Services</span>
            <span className='text-gray-600'>{totalSelectionAmount.toLocaleString("vi-VN")}VND</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Total Accommodations</span>
            <span className='text-gray-600'>{(booking.totalAmount - totalSelectionAmount).toLocaleString("vi-VN")}VND</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Total Booking Price</span>
            <span className='text-purple-900'>{booking.totalAmount.toLocaleString("vi-VN")}VND</span>
          </div>
          <hr />
          <div className="flex justify-between text-purple-900 font-medium">
            <span>Paid Amount</span>
            <span>{paidAmount.toLocaleString("vi-VN")}VND</span>
          </div>

          {booking.status !== "Completed" && (
            <div className="mt-2 text-xs text-gray-500 text-right">
              * {Math.round(depositRate * 100)}% deposit paid
            </div>
          )}
        </div>

        {/* Rating section - only for completed bookings */}
        {booking.status === "Completed" && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            {isRating ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-canto text-xl mb-2">Rate Your Experience</h4>

                <StarRating />

                <div className="mb-4">
                  <label htmlFor="comment" className="block text-gray-600 mb-1 font-canto">
                    Your Comment (Optional)
                  </label>
                  <textarea
                    id="comment"
                    rows="3"
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={handleCommentChange}
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                {errorMessage && (
                  <div className="mb-4 text-red-500">{errorMessage}</div>
                )}

                {successMessage && (
                  <div className="mb-4 text-green-500">{successMessage}</div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitRating}
                    className="px-4 py-2 bg-purple-900 text-white rounded-md hover:bg-purple-800 transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Rating"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                {currentRating ? (
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <svg
                          key={index}
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 ${index < currentRating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                      ))}
                    </div>
                    {currentComment && (
                      <span className="text-gray-600 text-sm ml-2">
                        "{currentComment}"
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-600 font-canto">How was your experience?</span>
                )}
                <button
                  onClick={handleRatingClick}
                  className="px-4 py-2 bg-black text-white border border-black rounded-md hover:bg-transparent hover:text-black transition-colors"
                >
                  {currentRating ? "Update Rating" : "Rate Now"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;