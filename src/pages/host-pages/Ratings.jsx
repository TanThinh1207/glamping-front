import React, { useEffect, useState } from "react";
import { Rating } from "@mui/material";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const Ratings = () => {
    const [campsiteList, setCampsiteList] = useState([]);
    const [selectedCampsite, setSelectedCampsite] = useState(null);
    const [ratingData, setRatingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        const fetchCampsiteList = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_GET_CAMPSITES}`, {
                    headers: { 'Content-Type': 'application/json' },
                    params: { userId: user.id }
                });
                const campsites = response.data.data.content;
                console.log(campsites);
                setCampsiteList(campsites.filter((campsite) => campsite.status === "Available"));
                if (campsites.length > 0) {
                    setSelectedCampsite(campsites[0].campsiteId);
                }
            } catch (error) {
                console.error('Error fetching campsite data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampsiteList();
    }, [user]);

    useEffect(() => {
        if (!selectedCampsite) return;
        const fetchRatingData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_RATING}/${selectedCampsite}`);
                setRatingData(response.data.data.content);
            } catch (error) {
                console.error('Error fetching rating data:', error);
            }
        };
        fetchRatingData();
    }, [selectedCampsite]);

    return (
        <div className="w-full h-screen bg-white">
            <div className="mx-auto px-30 max-w-7xl text-left">
            <h2 className="text-4xl py-8">Campsite Ratings</h2>
            {loading ? (
                <div className="flex justify-center items-center h-16 w-full">
                    <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-8 w-8"></div>
                </div>
            ) : (
                <>
                    <select
                        className="border p-2 rounded mt-2"
                        value={selectedCampsite || ""}
                        onChange={(e) => setSelectedCampsite(Number(e.target.value))}
                    >
                        {campsiteList.map((campsite) => (
                            <option key={campsite.id} value={campsite.id}>
                                {campsite.name}
                            </option>
                        ))}
                    </select>
                    {ratingData && (
                        <div className="mt-4">
                            <div className="flex items-center gap-2">
                                <Rating value={ratingData.averageRating || 0} precision={0.5} readOnly />
                                <span className="text-lg">({ratingData.averageRating || "No rating yet"})</span>
                            </div>
                            <h3 className="text-lg font-medium mt-4">Reviews:</h3>
                            {ratingData.ratingResponseList && ratingData.ratingResponseList.length > 0 ? (
                                ratingData.ratingResponseList.map((review) => (
                                    <div key={review.userId} className="border border-gray-300 p-4 rounded-xl mt-2">
                                        <strong className="block text-base">{review.userName}</strong>
                                        <p className="mt-1 text-gray-700">{review.comment}</p>
                                        <Rating value={review.rating} precision={0.5} readOnly />
                                        <p className="text-xs text-gray-500 mt-1">{review.uploadTime}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600 p-4 mt-2">No reviews yet.</p>
                            )}
                        </div>
                    )}
                </>
            )}
            </div>
        </div>
    );
};

export default Ratings;
