import { useEffect, useState } from 'react';
import fixturesUrl from './fixtures.csv';

export const useGetFixtures = () => {
  const [fixtures, setFixtures] = useState({ state: 'loading' })

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const res = await fetch(fixturesUrl)
        if (res.ok) {
          const data = await res.text();
          const rows = data.split('\n').map(row => row.split(','))
          const sortedData = rows.sort((a, b) => {
            if (isNaN(a[2]) && isNaN(b[2]))
              return 0;
            else if (isNaN(a[2]) && !isNaN(b[2]))
              return 1;
            else if (!isNaN(a[2]) && isNaN(b[2]))
              return -1;
            else
              return a[2] - b[2];
          })
          setFixtures({ state: 'data', data: sortedData })
        }
        else
          throw new Error(res.statusText)
      } catch (ex) {
        console.error(ex)
        setFixtures({ state: 'error' })
      }
    }

    fetchFixtures()
  }, [])

  return fixtures
}