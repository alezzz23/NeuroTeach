import { useState, useEffect, useCallback, useRef } from 'react';

export function useFetch(fetcher, deps = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, ...deps]);

  return { data, loading, error, execute, setData };
}

export function useFetchMultiple(fetches, immediate = true) {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const executeAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const responses = await Promise.all(fetches);
      const resultsMap = responses.reduce((acc, result, index) => {
        acc[`result${index}`] = result;
        return acc;
      }, {});
      setResults(resultsMap);
      return resultsMap;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetches]);

  useEffect(() => {
    if (immediate) {
      executeAll();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]);

  return { results, loading, error, executeAll };
}
