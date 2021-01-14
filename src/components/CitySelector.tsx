import React, { useCallback } from 'react';
import { OptionTypeBase } from 'react-select';

import AsyncSelect from 'react-select/async';
import api from '../services/api';

const customStyles = {

  indicatorsContainer: () => ({
    display: 'none',
  }),
  control: (provided:any, state:any) => ({
    ...provided,
    backgroundColor: 'rgba(255,255,255,0.8)',
  }),
  menu: (provided:any, state:any) => ({
    ...provided,
    margin: 0,
  }),
}

interface RegionItem {
  id: string,
  city: string,
  state: string,
  country: string
}

interface WeatherResponse {
  Key: string,
  AdministrativeArea:{ 
    LocalizedName : string 
  },
  Country: {
    LocalizedName : string 
  },
  LocalizedName:string 
}

interface ListProps {
  list: RegionItem[],
  setList(val:RegionItem[]): void,
}

const CitySelector: React.FC<ListProps> = ({list,setList}) =>{
  
  const loadOptions = useCallback(async (inputValue: string, callback: any) => { 

    if (inputValue.length < 3) return;

    const response = await api.get(`/locations/v1/cities/autocomplete?apikey=VVbpgpZAj7I0sH8zAYiyo5iEzz0oL02G&q=${inputValue}`);

    let responseObj:Array<OptionTypeBase> = [];
    
    responseObj = response.data.map( (location : WeatherResponse)=> {

      const { 
        Key: key,
        AdministrativeArea: {
           LocalizedName : state 
        },
        Country: {
           LocalizedName : country
        },
        LocalizedName : city
      } = location;

      return ({ value: {id:key, city, state, country } , label: `${city}, ${state}, ${country}`});

    })
    
    return callback(responseObj);
  },[]);

  const loadCityWeather = useCallback(async (input: OptionTypeBase) => {

    setList([...list,input.value]);
  }, [list,setList]);

  return(
    <AsyncSelect
      placeholder={'type the city name...'}
      styles={customStyles}
      cacheOptions
      loadOptions={loadOptions}
      defaultOptions
      onChange={loadCityWeather}
    />
  )
}

export default CitySelector;