import React, { useState, useEffect } from "react";
import axios from "axios";
import IntensityChart from "./IntensityChart";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import MapComponent from "./MapComponent";

const regions = [
  'Northern America',
  'Central America',
  'Western Africa',
  'Western Asia',
  'Eastern Europe',
  'Central Africa',
  'Northern Africa',
  'Southern Africa',
  'Southern Asia',
  'Central Asia',
  'Eastern Asia',
  'South America',
  'South-Eastern Asia',
  'Eastern Africa',
  'Western Europe',
  'Northern Europe',
  'Southern Europe',
  'Oceania'
];

const Main = () => {
  const [startYear, setStartYear] = useState(2016);
  const [endYear, setEndYear] = useState(2200);
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState(["Russia","China"]);
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState("Information Technology");
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      const API_URL = "http://localhost:1810/api/data"; // Adjust API endpoint as per your setup
      try {
        const response = await axios.get(API_URL);
        setData(response.data);
        const uniqueSectors = Array.from(new Set(response.data.map(d => d.sector)));
        setSectors(uniqueSectors.filter(sector => sector)); // Filter out empty sectors
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataFromApi();
  }, []);

  // Determine unique start and end years
  const startYears = Array.from(new Set(data.map(d => d.start_year))).sort((a, b) => a - b);
  const endYears = Array.from(new Set(data.map(d => d.end_year))).sort((a, b) => a - b);

  // Update end year options based on start year selection
  const endYearOptions = endYears.filter(year => year >= startYear);

  const handleStartYearChange = (e) => {
    const selectedStartYear = parseInt(e.target.value, 10);
    setStartYear(selectedStartYear);
    // Automatically set end year to the next available year if not already set
    if (!endYear || endYear < selectedStartYear) {
      const defaultEndYear = endYearOptions.length > 0 ? endYearOptions[0] : null;
      setEndYear(defaultEndYear);
    }
  };

  const handleEndYearChange = (e) => {
    const selectedEndYear = parseInt(e.target.value, 10);
    setEndYear(selectedEndYear);
  };

  useEffect(() => {
    // Filter out countries with empty or NaN intensity values
    const validCountries = Array.from(new Set(data
      .filter(item => item.intensity !== "" && !isNaN(item.intensity)) // Ensures intensity is valid
      .map(item => item.country) // Maps to country names
      .filter(country => country.trim() !== "" && country.trim() !== " ") // Filters out empty and whitespace-only names
    ));

    setCountries(validCountries);
  }, [data]);

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setSelectedCountries(selectedCountries => {
      if (selectedCountries.includes(selectedCountry)) {
        return selectedCountries.filter(country => country !== selectedCountry);
      } else {
        return [...selectedCountries, selectedCountry];
      }
    });
  };

  const filteredData = data.filter(item => selectedCountries.includes(item.country));

  const containerStyle = {
    fontFamily: 'Arial, sans-serif'
  };

  const listContainerStyle = {
    maxHeight: '150px', // Adjust max height to control scrollbar appearance
    overflowY: countries.length > 6 ? 'scroll' : 'auto', // Add scrollbar if more than 6 countries
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '5px',
  };

  const checkboxStyle = {
    marginRight: '5px',
  };
// Function to handle sector selection
const handleSectorChange = (e) => {
  setSelectedSector(e.target.value);
};

useEffect(() => {
  if (selectedSector) {
    // Filter data based on selected sector
    const filteredData = data.filter(d => d.sector === selectedSector);

    // Count occurrences of each category/type in the filtered data
    const categoryCounts = {};
    filteredData.forEach(d => {
      if (categoryCounts[d.topic]) {
        categoryCounts[d.topic]++;
      } else {
        categoryCounts[d.topic] = 1;
      }
    });

    // Prepare data for pie chart
    const pieChartData = Object.keys(categoryCounts).map(category => ({
      category,
      count: categoryCounts[category]
    }));

    setPieChartData(pieChartData);
  } else {
    setPieChartData([]); // Reset pie chart data if no sector is selected
  }
}, [selectedSector, data]);
  return (
    <>
      <div>
        <h1>Dynamic Intensity Bar Chart</h1>
        <div>
          <label>
            Start Year:
            <select value={startYear} onChange={handleStartYearChange}>
              <option value="">Select Start Year</option>
              {startYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </label>
          <label>
            End Year:
            <select value={endYear} onChange={handleEndYearChange}>
              <option value="">Select End Year</option>
              {endYearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </label>
        </div>
        {startYear && endYear && <IntensityChart data={data} startYear={startYear} endYear={endYear} />}
      </div>
      <div style={containerStyle}>
        <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Dynamic Bar Chart for Countries</h1>
        <div style={{ maxWidth: '1000px', margin: 'auto' }}>
          <h2>Select Countries:</h2>
          <div style={listContainerStyle}>
            {countries.map(country => (
              <label key={country} style={{ display: 'block', marginBottom: '5px' }}>
                <input
                  type="checkbox"
                  value={country}
                  checked={selectedCountries.includes(country)}
                  onChange={handleCountryChange}
                  style={checkboxStyle}
                />
                {country}
              </label>
            ))}
          </div>
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <h2>Bar Chart Based on Selected Countries:</h2>
            {filteredData.length > 0 ? <BarChart data={filteredData} /> : <p>No data to display</p>}
          </div>
        </div>
      </div>



      <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Dynamic Pie Chart by Sector and Category</h1>
      <div style={{ maxWidth: '800px', margin: 'auto', textAlign: 'center' }}>
        <h2>Select Sector:</h2>
        <select value={selectedSector} onChange={handleSectorChange} style={{ marginBottom: '20px' }}>
          <option value="">Select Sector</option>
          {sectors.map(sector => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
  {selectedSector && pieChartData.length > 0 ? (
    <PieChart data={pieChartData} />
  ) : (
    <p style={{ textAlign: 'center' }}>Select a sector to view the pie chart.</p>
  )}
</div>
      </div>
    </div>
    </>
  );
};

export default Main;
