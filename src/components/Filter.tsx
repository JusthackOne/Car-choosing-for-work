"use client";
import FilterComponentProps from "@/types/filterComponent";
import axios from "axios";
import { get } from "http";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CiFilter } from "react-icons/ci";
import { useRouter } from "next/navigation";
// Тип функции обновления состояния
type setValue = Dispatch<SetStateAction<string[]>>;
type setValueBoolean = Dispatch<SetStateAction<boolean>>;


interface IModels {
  brand: string;
  models: string[];
}

const Filter: React.FC<FilterComponentProps> = ({
  filters,
  setFilters,
  getParams
}) => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState<any[]>([]);
  const [tariffs, setTariffs] = useState({});
  const [isOpenBrands, setIsOpenBrands] = useState(false);
  const [isOpenModels, setIsOpenModels] = useState(false);
  const [isOpenTariffs, setIsOpenTariffs] = useState(false);
  const [initialModels, setInitialModels] = useState([]);
  const [getData, setGetData] = useState(false);

  const router = useRouter();
  // Обновление url от фильтров
  const updateUrl = (updatedFilters: any) => {
    const url = new URL(window.location.href);

    Object.keys(updatedFilters).forEach((filter) => {
      if (updatedFilters[filter].length !== 0) {
        url.searchParams.set(filter, updatedFilters[filter].join(","));
      } else {
        url.searchParams.delete(filter);
      }
    });

    router.push(url.toString());
  };

  // Получение начальных данных
  useEffect(() => {
    const getFilters = async () => {
      const response = await axios.get(
        "https://test.taxivoshod.ru/api/test/?w=catalog-filter"
      );
      setBrands(response.data.brands.values);
      setInitialModels(response.data.models.values);
      setModels(
        getModelsByBrands(
          filters.brand,
          response.data.brands.values,
          response.data.models.values
        )
      );
      setGetData(true);
      setTariffs(response.data.tarif.values);
    };
    if (getParams) {
      getFilters();
    }
  }, [getParams]);

  // При обновление марок
  useEffect(() => {
    if (!getData) {
      return;
    }

    const updatedModels = getModelsByBrands(
      filters.brand,
      brands,
      initialModels
    );
    setModels(updatedModels); // Обновление возможных моделей (для показа)
    const existModels = filters.model.filter((el) =>
      updatedModels.includes(el)
    );
    
    // Обновление моделей (выбранные) в фильтре, так чтобы остались только возможные из существующих
    const updatedFilters = { ...filters, model: existModels };
    setFilters(updatedFilters);
    updateUrl(updatedFilters);
  }, [filters.brand, getData]);

  // При обновлении моделей (выбранные) в фильтре
  useEffect(() => {
    if (!getData) {
      return;
    }
    updateUrl(filters);
  }, [filters.model, filters.tarif, getData]);


  // Получение возможных моделей по бренду
  const getModelsByBrands = (
    filterBrands: string[],
    brands: string[],
    models: IModels[]
  ): string[] => {
    let data: string[] = [];
    if (filterBrands.length === 0) {
      for (let i = 0; i < brands.length; i++) {
        const indexModel = models.findIndex((item) => item.brand === brands[i]);
        if (indexModel !== -1) {
          data = data.concat(models[indexModel].models);
        }
      }
    } else {
      for (let i = 0; i < filterBrands.length; i++) {
        const indexModel = models.findIndex(
          (item) => item.brand === filterBrands[i]
        );
        if (indexModel !== -1) {
          data = data.concat(models[indexModel].models);
        }
      }
    }

    return data;
  };

  // Закрытие выборов ответа
  const toggleDropdown = (
    isStatus: boolean,
    setStatus: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setStatus(!isStatus);
  };

  // Обработка выбора модели/марки/тариффа
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ): void => {
    const nameValue = e.target.value;
    const isChecked = e.target.checked;

    const updatedFilters = {
      ...filters,
      [name]: isChecked
        ? [...filters[name], nameValue]
        : filters[name].filter((el) => el !== nameValue)
    };

    setFilters(updatedFilters);
    updateUrl(updatedFilters);
  };

  return (
    <>
      <h2 className="text-2xl font-bold flex gap-1">
        <CiFilter />
        Фильтры
      </h2>
      <div className="mt-5 ">
        <button
          className="font-bold text-xl p-3 rounded-xl bg-slate-300 text-slate-900 hover:bg-slate-500 hover:text-white transition easy-in-out    "
          onClick={() => toggleDropdown(isOpenBrands, setIsOpenBrands)}
        >
          <h3>Марки</h3>
        </button>

        <div
          className={`mt-4 w-full flex-wrap flex gap-x-5 gap-y-2 ${
            isOpenBrands ? "flex" : "hidden"
          }`}
        >
          {brands.map((brand) => (
            <div key={brand} className="flex gap-1 bg-blue-800 p-2 rounded-xl">
              <input
                type="checkbox"
                checked={filters.brand.includes(brand)}
                id={brand}
                value={brand}
                onChange={(e) => handleFilterChange(e, "brand")}
              />
              <label htmlFor={brand} className="text-white">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 ">
        <button
          className="font-bold text-xl p-3 rounded-xl bg-slate-300 text-slate-900 hover:bg-slate-500 hover:text-white transition easy-in-out    "
          onClick={() => toggleDropdown(isOpenModels, setIsOpenModels)}
        >
          <h3>Модели </h3>
        </button>

        {!filters.brand.length ? (
          <div
            className={`mt-4 w-full flex-wrap flex gap-x-5 gap-y-2 ${
              isOpenModels ? "flex" : "hidden"
            }`}
          >
            {models.map((model) => (
              <div
                key={model}
                className="flex gap-1 bg-blue-800 p-2 rounded-xl"
              >
                <input
                  type="checkbox"
                  id={model}
                  value={model}
                  checked={filters.model.includes(model)}
                  onChange={(e) => handleFilterChange(e, "model")}
                />
                <label htmlFor={model} className="text-white">
                  {model}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div className={`mt-4 ${isOpenModels ? "block" : "hidden"}`}>
            {filters.brand.map((brandName) => (
              <div className="mt-4" key={brandName}>
                <h1>{brandName}</h1>
                <div className="mt-2 flex flex-wrap w-full gap-x-5 gap-y-2">
                  {initialModels.length !== 0 &&
                    initialModels
                      .filter((item) => item.brand === brandName)[0]
                      .models.map((model) => (
                        <div
                          key={model}
                          className="flex gap-1 bg-blue-800 p-2 rounded-xl"
                        >
                          <input
                            type="checkbox"
                            id={model}
                            value={model}
                            checked={filters.model.includes(model)}
                            onChange={(e) => handleFilterChange(e, "model")}
                          />
                          <label htmlFor={model} className="text-white">
                            {model}
                          </label>
                        </div>
                      ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 ">
        <button
          className="font-bold text-xl p-3 rounded-xl bg-slate-300 text-slate-900 hover:bg-slate-500 hover:text-white transition easy-in-out    "
          onClick={() => toggleDropdown(isOpenTariffs, setIsOpenTariffs)}
        >
          <h3>Тарифы</h3>
        </button>

        <div
          className={`mt-4 w-full flex-wrap flex gap-x-5 gap-y-2 ${
            isOpenTariffs ? "flex" : "hidden"
          }`}
        >
          {Object.keys(tariffs).map((key) => (
            <div key={key} className="flex gap-1 bg-blue-800 p-2 rounded-xl">
              <input
                type="checkbox"
                id={key}
                value={key}
                checked={filters.tarif.includes(key)}
                onChange={(e) => handleFilterChange(e, "tarif")}
              />
              <label htmlFor={key} className="text-white">
                {tariffs[key]}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Filter;
