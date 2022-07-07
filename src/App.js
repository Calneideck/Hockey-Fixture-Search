import React, { useCallback, useEffect, useRef, useState } from 'react';
import './index.scss';
import { ReactComponent as PrintIcon } from './print_black_24dp.svg';
import { useGetFixtures } from './fixtures';
import format from 'date-fns/format';
import isSameDay from 'date-fns/isSameDay';
import { useReactToPrint } from 'react-to-print';

const MAX_ROWS = 100;

const initialState = {
  comp: '',
  mens: false,
  womens: false,
  mensMasters: false,
  womensMasters: false,
  round: '',
  team: '',
  venue: '',
  date: '',
}

export const App = () => {
  const fixtures = useGetFixtures();
  const [filter, setFilter] = useState(initialState);
  const [matches, setMatches] = useState([])
  const tableElem = useRef()
  const firstSearch = useRef(true)
  const handlePrint = useReactToPrint({
    content: () => tableElem.current,
  });

  const onChange = (e) => {
    setFilter({ ...filter, [e.currentTarget.name]: e.currentTarget.value });
  }

  const search = useCallback(() => {
    if (fixtures.state !== 'data') return
    const filteredMatches = fixtures.data.filter(row => {
      let validComp = !filter.mens && !filter.womens && !filter.mensMasters && !filter.womensMasters
      if (filter.mens && row[1].match(/Men'?s (?!Masters)/))
        validComp = true

      if (filter.womens && row[1].match(/Women'?s (?!Masters)/))
        validComp = true

      if (filter.mensMasters && row[1].match(/Men'?s Masters/))
        validComp = true

      if (filter.womensMasters && row[1].match(/Women'?s Masters/))
        validComp = true

      if (filter.comp && row[1].toLowerCase().indexOf(filter.comp.toLowerCase()) === -1)
        return false

      if (filter.round && filter.round !== row[0])
        return false

      if (filter.team && row[5].toLowerCase().indexOf(filter.team.toLowerCase()) === -1 && row[6].toLowerCase().indexOf(filter.team.toLowerCase()) === -1)
        return false

      if (filter.venue && `${row[4]} - ${row[3]}`.toLowerCase().indexOf(filter.venue.toLowerCase()) === -1)
        return false

      if (filter.date && (row[5] === 'BYE' || row[6] === 'BYE' || !isSameDay(new Date(filter.date), new Date(row[2] * 1000 * 60))))
        return false

      return validComp
    });
    setMatches(filteredMatches);
    return false
  }, [fixtures, filter])

  useEffect(() => {
    if (fixtures.state === 'data' && firstSearch.current) {
      search();
      firstSearch.current = false;
    }
  }, [search, fixtures])

  const onSubmit = (e) => {
    e.preventDefault();
    search();
  }

  const onReset = () => {
    setFilter(initialState)
  }

  return (
    <div className='container'>
      <h1>Vic Hockey Fixture Search 2022</h1>
      <p className='disclaimer'>Updated 8/7/2022. Check the Hockey Victoria website for the most up-to-date fixtures.</p>

      <form onSubmit={onSubmit}>
        <label htmlFor='comp'>Competition:</label>
        <input id='comp' type='text' name='comp' value={filter.comp} onChange={onChange} onSubmit={search} />

        <div className='form-group chk-row'>
          <label htmlFor='chk-men'>Men's:</label>
          <input id='chk-men' type='checkbox' value={filter.mens} onChange={e => setFilter({ ...filter, mens: e.currentTarget.checked })} />

          <label htmlFor='chk-women'>Women's:</label>
          <input id='chk-women' type='checkbox' value={filter.womens} onChange={e => setFilter({ ...filter, womens: e.currentTarget.checked })} />

          {/* <label htmlFor='chk-men-masters'>Men's Masters:</label>
          <input id='chk-men-masters' type='checkbox' value={filter.mensMasters} onChange={e => setFilter({ ...filter, mensMasters: e.currentTarget.checked })} />

          <label htmlFor='chk-womens-masters'>Women's Masters:</label>
          <input id='chk-womens-masters' type='checkbox' value={filter.womensMasters} onChange={e => setFilter({ ...filter, womensMasters: e.currentTarget.checked })} /> */}
        </div>

        <div className='form-group'>
          <label htmlFor='round'>Round:</label>
          <input id='round' type='number' min={1} max={19} name='round' value={filter.round} onChange={onChange} />
        </div>

        <div className='form-group'>
          <label htmlFor='team'>Team:</label>
          <input id='team' type='text' name='team' value={filter.team} onChange={onChange} />
        </div>

        <div className='form-group'>
          <label htmlFor='venue'>Venue:</label>
          <input id='venue' type='text' name='venue' value={filter.venue} onChange={onChange} />
        </div>

        <div className='form-group'>
          <label htmlFor='date'>Date:</label>
          <input id='date' type='date' name='date' value={filter.date} onChange={onChange} />
        </div>

        <div className="btn-row">
          <input className='search' type='submit' value='Search' />
          <input className='reset' type='reset' value='Reset' onClick={onReset} />
        </div>
      </form>

      <div className='print-row'>
        <h2>Fixtures</h2>
        {fixtures.state === 'data' && <span className='count'>{matches.length} found</span>}
        <button className='print' title='Print' onClick={handlePrint}><PrintIcon /></button>
      </div>
      <div className='table-holder' ref={tableElem}>
        <table>
          <thead>
            <tr>
              <th>Competition</th>
              <th>Round</th>
              <th>Home Team</th>
              <th>Away Team</th>
              <th>Date</th>
              <th>Time</th>
              <th>Venue</th>
            </tr>
          </thead>
          <tbody>
            {fixtures.state === 'loading' && <tr><td colSpan={6}>Loading...</td></tr>}
            {matches.slice(0, MAX_ROWS).map(match => {
              const bye = match[5] === 'BYE' || match[6] === 'BYE'
              const dateTime = bye ? null : new Date(match[2] * 1000 * 60)
              return (
                <tr key={`${match[1]}/${match[0]}/${match[5]}/${match[6]}`}>
                  <td>{match[1]}</td>
                  <td>{match[0]}</td>
                  <td>{match[5]}</td>
                  <td>{match[6]}</td>
                  <td>{!bye && format(dateTime, 'd/MM/yy')}</td>
                  <td>{!bye && format(dateTime, 'h:mm a')}</td>
                  <td>{!bye && `${match[4]} - ${match[3]}`}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p>Contact: <a href="mailto:hockeyfixture@gmail.com">hockeyfixture@gmail.com</a></p>
    </div>
  );
};
