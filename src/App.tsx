import  { useState, ChangeEvent, KeyboardEvent } from 'react';
import axios from 'axios';

interface WeatherData {
  name?: string;
  main?: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather?: {
    main: string;
  }[];
  wind?: {
    speed: number;
  };
}

function App(): JSX.Element {
  const [data, setData] = useState<WeatherData>({});
  const [location, setLocation] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [err,setErr]=useState<string>("");

  const commonCities: string[] = [
    'Daman',
    'Davangere',
    'Dehradun',
    'Delhi',
    'Dispur',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    'Dallas',
    'Sultanpur',
    'Aurangabad',
    'Bhopal',
    'Jabalpur',
    'Lucknow',
    'Kanpur',
    'Agra',
    'Bangalore',
    'Mumbai',
    'Kolkata',
  ];

  const apiUrl: string = 'https://api.openweathermap.org/data/2.5/weather';
  const apiKey: string = '6e8bfe462e49a8161172ae48d9b28daf';

  const searchLocation = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setLoading(true);
      try {
        const response = await axios.get<WeatherData>(apiUrl, {
          params: {
            q: location,
            units: 'imperial',
            appid: apiKey,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setData({});
        setErr((error as {message:string}).message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErr("");
    const input: string = event.target.value;
    setLocation(input);

    // Set suggestions only when the user has typed at least 3 characters
    if (input.length >= 1) {
      // Filter common cities based on the input value
      const filteredCities: string[] = commonCities.filter((city) =>
        city.toLowerCase().includes(input.toLowerCase())
      );

      // Set suggestions based on the filtered cities
      setSuggestions(filteredCities);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocation(suggestion);
    setSuggestions([]);
  };
  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={handleInputChange}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((suggestion) => (
              <li className="suggestion-item" key={suggestion} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      {loading?"Loading...":
      err!==""?"You entered invalid city name":
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>

        {data.name !== undefined &&
          <div className="bottom">
            <div className="feels">
              {data.main ? <p className='bold'>{data.main.feels_like.toFixed()}°F</p> : null}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? <p className='bold'>{data.wind.speed.toFixed()} MPH</p> : null}
              <p>Wind Speed</p>
            </div>
          </div>
        }



      </div>
      }
    </div>
  );
}

export default App;
