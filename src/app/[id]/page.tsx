"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "@/components/Slider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function CarPage({ params }: { params: { id: string } }) {
  const [car, setCar] = useState({});

  const router = useRouter();
  
  // Получение машины
  useEffect(() => {
    const getCar = async () => {
      await axios
        .get(
          `https://test.taxivoshod.ru/api/test/?w=catalog-car&id=${params.id}`
        )
        .then((response) => {
          setCar(response.data.item);
        });
    };

    getCar();
  }, []);
  return (
    <main className="flex h-screen  justify-between p-24">
      <section className="w-1/3 ">
        <Slider images={car?.images ? car.images : []} />
      </section>
      <section className="w-1/2 flex gap-4 flex-col">
        <FaArrowLeft onClick={() => router.back()} />
        <h1 className="font-bold text-6xl ">{car?.brand}</h1>
        <h2 className="font-bold text-4xl">{car?.model}</h2>
        <p className="font-bold text-4xl text-green-600">{car?.price}</p>
        {car?.tarif && car.tarif.map((tarif) => <div>{tarif}</div>)}
      </section>
    </main>
  );
}
