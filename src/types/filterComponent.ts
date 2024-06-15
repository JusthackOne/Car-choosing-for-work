import { Dispatch, SetStateAction } from "react";
import Filters from "./filters";
import { useRouter } from "next/router";

type SetFiltersType = Dispatch<SetStateAction<Filters>>;

export default interface FilterComponentProps {
  filters: Filters;
  setFilters: SetFiltersType;
  getParams: boolean;
}
