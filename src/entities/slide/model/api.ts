import { useEffect, useState } from "react";

import slidesData from "@/app/data/slides.json";

import type { SlideCategory } from "./types";
import { useFakeFetch } from "@/shared";
import { FakeFetchParams, FakeFetchResult, UseFakeFetchResult } from "@/shared/hooks/useFakeFetch";

export function fakeFetch<TData>({
  data,
  delayMs = 700
}: FakeFetchParams<TData>): Promise<FakeFetchResult<TData>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delayMs);
  });
}

export async function getAllSlides(): Promise<SlideCategory[]> {
  const response = await fakeFetch<SlideCategory[]>({
    data: slidesData
  });

  return response.data;
}

export function useSlides(): UseFakeFetchResult<SlideCategory[]> {
  return useFakeFetch<SlideCategory[]>({
    queryFn: getAllSlides
  });
}
