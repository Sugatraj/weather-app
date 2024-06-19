import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import './index.css';

function App () {
  const [data, setData] = useState({});
  const [time, setTime] = useState('');
  const [greeting, setGreeting] = useState('');
  const [location, setLocation] = useState('');
  const [intervalId, setIntervalId] = useState(null);

  const apiKey = 'd0ca82dad8ecd0c6e8acca9054ebe485';
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;

  const updateTime = (timezone) => {
    const localTime = moment().tz(timezone);
    setTime(localTime.format('LTS'));
    updateGreeting(localTime.hour());
    if (intervalId) {
      clearInterval(intervalId);
    }
    const newIntervalId = setInterval(() => {
      const updatedTime = moment().tz(timezone);
      setTime(updatedTime.format('LTS'));
      updateGreeting(updatedTime.hour());
    }, 1000);
    setIntervalId(newIntervalId);
  };

  const updateGreeting = (hours) => {
    if (hours < 12) {
      setGreeting('Good Morning');
    } else if (hours < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  };

  const searchLocation = event => {
    if (event.key === 'Enter') {
      axios.get(weatherUrl).then(response => {
        setData(response.data);
        const { lat, lon } = response.data.coord;
        const timezone = moment.tz.guess(true, [lat, lon]);
        updateTime(timezone);
        setLocation('');
      }).catch(error => {
        console.error("There was an error fetching the weather data!", error);
      });
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <>
      <div className='app'>
        <div className='search'>
          <input
            type='text'
            value={location}
            onChange={event => setLocation(event.target.value)}
            onKeyPress={searchLocation}
            placeholder='Search Locations'
          />
        </div>
        <div className='container'>
          <div className='top'>
            <div className='location'>
              <p style={{ color: 'white' }}>{data.name}</p>
              <div className='temp'>
                {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
              </div>
              <div className='description'>
                {data.weather ? (
                  <p className='bold' style={{ color: 'white' }}>{data.weather[0].main}</p>
                ) : null}
              </div>
              <div className='time'>
                {time ? <p style={{ color: 'white' }}>Current Time: {time}</p> : null}
              </div>
              <div className='greeting'>
                {greeting ? <p style={{ color: 'white' }}>{greeting}</p> : null}
              </div>
            </div>
          </div>

          {data.name !== undefined && (
            <div className='bottom'>
              <div className='feels'>
                {data.main ? (
                  <p className='bold' style={{ color: 'white' }}>{data.main.feels_like.toFixed()}°C</p>
                ) : null}
                <p>Feels Like</p>
              </div>
              <div className='humidity'>
                {data.main ? (
                  <p className='bold'>{data.main.humidity}%</p>
                ) : null}
                <p>Humidity</p>
              </div>
              <div className='wind'>
                {data.wind ? (
                  <p className='bold'>{(data.wind.speed * 3.6).toFixed()}KM/H</p>
                ) : null}
                <p>Wind Speed</p>
              </div>
              <div className='country'>
                {data.sys ? (<p className='bold'>{data.sys.country}</p>) : null}
                <p>Country</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
