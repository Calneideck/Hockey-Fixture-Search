import { useEffect, useState } from 'react';

export const useGetFixtures = () => {
  const [fixtures, setFixtures] = useState({ state: 'loading' })

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const res = await fetch('./fixtures.csv')
        if (res.ok) {
          const data = await res.text();
          const rows = data.split('\n').map(row => row.split(','))
          const sortedData = rows.sort((a, b) => {
            if (a[0] === b[0]) {
              if (isNaN(a[2]) && isNaN(b[2]))
                return 0;
              else if (isNaN(a[2]) && !isNaN(b[2]))
                return 1;
              else if (!isNaN(a[2]) && isNaN(b[2]))
                return -1;
              else
                return a[2] - b[2];
            }
            return a[0] - b[0]
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