"use client";
import FilterComponentProps from "@/types/filterComponent";
import axios from "axios";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import Filters from "@/types/filters";

import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import noPhoto from "@/assets/noPhoto.jpg";

import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";

// Тип функции обновления состояния
type setValue = Dispatch<SetStateAction<string[]>>;
type setValueBoolean = Dispatch<SetStateAction<boolean>>;

interface ItoggleDropdown {
  isStatus: boolean;
  setStatus: setValueBoolean;
}

interface IisOpenBrands {
  isOpenBrands: boolean;
  setStatus: setValueBoolean;
}

interface ICars {
  id: Number;

  brand: string;
  model: string;
  number: string;
  price: Number;
  image: string;
  tarif: string[] | [];
}

const Items: React.FC<FilterComponentProps> = ({
  filters,
  setFilters,
  getParams
}) => {
  const router = useRouter();
  
  const params = new URLSearchParams(window.location.search);

  const [cars, setCars] = useState<ICars[]>([]);
  const [pages, setPages] = useState(Infinity);
  const [currentPage, setCurrentPage] = useState(
    Number(params.get("page")) || 1
  );

  // Обновление машин
  useEffect(() => {
    const getCars = () => {
      axios
        .get(
          `https://test.taxivoshod.ru/api/test/?w=catalog-cars${getItemsLink(
            filters
          )}&page=${currentPage}`
        )
        .then((response) => {
          setCars(response.data.list);
          setPages(response.data.pages);
        });
    };

    console.log(
      `https://test.taxivoshod.ru/api/test/?w=catalog-cars${getItemsLink(
        filters
      )}&page=${currentPage}`
    );
    if (getParams) {
      console.log(filters);
      getCars();
    }
  }, [filters, currentPage, getParams]);

  // Если существующиая страница больше возможных
  useEffect(() => {
    if (currentPage > pages) {
      setCurrentPage(pages);
      updateUrl(pages);
    }
  }, [pages]);

  // Обновление url от страницы
  const updateUrl = (pageNumber: Number) => {
    const url = new URL(window.location.href);
    setCurrentPage(pageNumber);
    url.searchParams.set("page", pageNumber);

    router.push(url.toString());
  };

  // Получение ссылки по фильтрам
  const getItemsLink = (filters: Filters): string => {
    let link = "";
    Object.keys(filters).map((key) => {
      filters[key].map((item) => {
        link += `&${key}[]=${item}`;
      });
    });

    return link;
  };
  return (
    <section className="w-full">
      <div className="flex flex-wrap grid grid-cols-4 gap-3">
        {cars.map((car) => (
          <Link
            href={`/${car.id}`}
            className="flex flex-col gap-2 w-full rounded-xl bg-slate-900 text-white cursor-pointer"
            key={car.id}
          >
            <Image
              src={car.image ? car.image : noPhoto}
              className="w-full rounded-t-xl"
              width={100}
              height={100}
            />

            <div className="p-2 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">{car.brand}</h1>
                <h2>{car.model}</h2>
              </div>
              <h3 className="text-sm">{car.number}</h3>
              <p className="ml-auto text-green-300">{car.price}</p>
              <div className="flex flex-wrap gap-2 text-sm font-light">
                {car.tarif.map((tarif) => (
                  <div>{tarif}</div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="w-full flex justify-center mt-10 ">
        <p className="flex gap-3 text-2xl font-bold items-center">
          <button
            className="hover:text-blue-900"
            disabled={currentPage === 1}
            onClick={() => updateUrl(currentPage - 1)}
          >
            {" "}
            <FaArrowAltCircleLeft />
          </button>

          {currentPage}
          <button
            className="hover:text-blue-900"
            disabled={currentPage === pages}
            onClick={() => updateUrl(currentPage + 1)}
          >
            <FaArrowAltCircleRight />
          </button>
        </p>
      </div>
    </section>
  );
};

export default Items;
