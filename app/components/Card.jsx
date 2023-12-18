import React, { useState } from "react";
import { payments, db } from "../firebase";
import { getCheckoutUrl } from "../stripePayment";
import { useRouter } from "next/navigation";
const calculateProgressPercentage = (currentDonation, goal) => {
  return Math.min((currentDonation / goal) * 100, 100);
};

const Card = ({ project }) => {
  const {
    id,
    name,
    description,
    amount,
    goal,
    currentDonation,
    photo,
    priceId,
    contribuitors,
  } = project;
  const progressPercentage = calculateProgressPercentage(currentDonation, goal);

  const router = useRouter();

  const handleCustomDonationChange = (e) => {
    setCustomDonation(e.target.value);
  };

  const handleDonateClick = async () => {
    const checkoutUrl = await getCheckoutUrl(priceId, id, amount);
    router.push(checkoutUrl);
  };

  return (
    <div className="border p-5 rounded-lg bg-white shadow-lg">
      <h3 className="text-lg text-gray-700 font-semibold mb-2">{name}</h3>
      <img
        src={photo}
        alt={`${name} project`}
        className="mb-4 mt-2 w-full rounded-md"
      />
      <p className="text-gray-600 mb-4">{description}</p>
      <p className="text-blue-500">{`Goal: ${goal} RON`}</p>
      <p className="text-blue-800">{`Donatie: ${amount} RON`}</p>

      <div className="mt-4">
        <p className="text-gray-700 mb-2">
          Bani stransi: {currentDonation} RON
        </p>
        <progress
          value={progressPercentage}
          max="100"
          className="w-full"
        ></progress>
        <p className="text-gray-700 mt-2">{`${progressPercentage.toFixed(
          2
        )}% Stransi`}</p>
          <h1 className="text-gray-700 mt-5">Contribuitori:</h1>
        <div className="flex flex-wrap justify-center">
          {contribuitors.map((c, index) => (
            <p
              key={index}
              className="bg-gray-200 px-4 py-2 m-2 rounded-full text-gray-700"
            >
              {c}
            </p>
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={handleDonateClick}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Doneaza
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
