import React, { useState, useEffect, useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';

import api from '../services/api';
import CitySelector from './CitySelector';

import weatherImages from '../assets/index';

import '../styles/App.css';

interface WeatherItem {
  id: string,
  city: string,
  state: string,
  country: string,
  weatherText: string,
  weatherIcon: number,
  hasPrecipitation: boolean,
  temperature: string,
}

interface RegionItem {
  id: string,
  city: string,
  state: string,
  country: string
}

const App: React.FC = () => {
  const { addToast } = useToasts()
  const [list,setList] = useState<Array<RegionItem>>([]);
  const [weatherList,setWeatherList] = useState<Array<WeatherItem>>([]);

  const getWeatherDataFromRegionItem = useCallback(async (region:RegionItem):Promise<WeatherItem> =>{

    try {
      const { id, city, state, country } = region;

      // for tests
      // VVbpgpZAj7I0sH8zAYiyo5iEzz0oL02G
      // 381G8GmAhLkqmENuLwTLj10R38T9FGIP
      const response = await api.get(`/currentconditions/v1/${id}?apikey=381G8GmAhLkqmENuLwTLj10R38T9FGIP`);
      console.log('weatherApi',response);
      const {
        WeatherText: weatherText,
        WeatherIcon: weatherIcon,
        HasPrecipitation: hasPrecipitation,
        Temperature: { 
          Metric: { 
            Value: temperature
          }
        }
      } = response.data[0];

      const weatherObj = {id, city, state, country, weatherText, weatherIcon, hasPrecipitation, temperature};
      
      return weatherObj;
    } catch (error) {
      
      console.log(error.response);
      if(error.response.status === 403){
        addToast('Limit of API requisitions reached, please try again later.', { appearance: 'error' })
      }else{
        addToast('Failed to connect to the API.', { appearance: 'error' })
      }

      return Promise.reject()
    }
  } ,[addToast])

  const handleRemoveItemList = useCallback((id:string) => {
    const listArray = [...list];

    const index = listArray.findIndex(item => item.id === id);

    listArray.splice(index,1);

    setList(listArray);
  } ,[list]);
  
  useEffect(() => {
    if (list.length === 0){
      const savedItems = localStorage.getItem('weather-list');
      if (savedItems && savedItems?.length > 3){
        setList(JSON.parse(savedItems));
      }
    }
  },[list.length]);

  useEffect(()=>{

    async function getWeatherListByRegionList(){
      const weatherArray:Array<WeatherItem> = await Promise.all(
        list.map(async item => {
          const weatherItem = await getWeatherDataFromRegionItem(item); 
          return weatherItem;
        })
      );
      setWeatherList(weatherArray);
    }

    getWeatherListByRegionList();

    localStorage.setItem('weather-list',JSON.stringify(list));
  
  },[list, getWeatherDataFromRegionItem])
  
  useEffect(()=>{
    console.log('weatherList on useeffect',weatherList);
  },[weatherList]);

  return (
    <div className="App">
      <header className="App-header">
        <CitySelector list={list} setList={setList} />
      </header>
      <ul className="cities">
        { weatherList.map(item => 
          (
          <li key={item.id}>
            <div className="delete_btn" onClick={()=>{handleRemoveItemList(item.id)}}>Remove</div> 
            <div className="content">
              <img src={weatherImages[item.weatherIcon]} alt="weather-icon" />
              <span className="temperature">{item.temperature}º</span>
              <span className="precipitation">{item.hasPrecipitation ? 'Precipitation' : 'No Precipitation'}</span>
              <div className="location">
                <span className="city">{item.city}</span>
                <span className="country">{item.state} <br/> {item.country}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
