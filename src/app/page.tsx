"use client";

import Filter from "@/components/Filter";
import Items from "@/components/Items";
import Filters from "@/types/filters";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    brand: [],
    model: [],
    tarif: []
  });

  const [getParams, setGetParams] = useState(false)

  const router = useRouter();


  // Получение фильтров из queries 
  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(window.location.search);

    const newFilters = { ...filters };

    
    params.forEach((value, key) => {
      if (newFilters[key]) {
        newFilters[key] = value.split(",");
      }
    });

    // Обновление фильтров
    setFilters(newFilters);
    setGetParams(true)
  }, []);

  return (
    <main className="flex min-h-screen  flex-nowrap  justify-between p-24">
      <section className="w-1/4 flex flex-col items-start">
        <Filter filters={filters} setFilters={setFilters} getParams={getParams} />
      </section>
      <section className="w-2/3">
        <Items filters={filters} setFilters={setFilters} getParams={getParams} />
      </section>
    </main>
  );
}
