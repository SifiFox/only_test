import { useEffect, useState } from "react";

export type FakeFetchParams<TData> = {
  data: TData;
  delayMs?: number;
}

export type FakeFetchResult<TData> = {
  data: TData;
}

export type UseFakeFetchParams<TData> = {
  queryFn: () => Promise<TData>;
  initialData?: TData | null;
}

export type UseFakeFetchResult<TData> = {
  data: TData | null;
  isFetching: boolean;
  error: string | null;
  isError: boolean;
}

export function useFakeFetch<TData>({
  queryFn,
  initialData = null
}: UseFakeFetchParams<TData>): UseFakeFetchResult<TData> {
  const [data, setData] = useState<TData | null>(initialData);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    void queryFn()
      .then((responseData) => {
        if (!isMounted) {
          return;
        }

        setData(responseData);
      })
      .catch((fetchError: unknown) => {
        if (!isMounted) {
          return;
        }

        if (fetchError instanceof Error) {
          setError(fetchError.message);
          return;
        }

        setError("Не удалось загрузить данные");
      })
      .finally(() => {
        if (!isMounted) {
          return;
        }

        setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [queryFn]);

  return {
    data,
    isFetching,
    error,
    isError: Boolean(error)
  };
}
