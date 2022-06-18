import React from 'react'
import Globe from 'react-globe.gl';
import Modal from "../../Modal";
import HomePage3DMapNews from './HomePage3DMapNews';
import Range from 'reactrangeslider';



import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';

const { useState, useEffect } = React;

const News = [
  {
    "id": 1,
    "name": "Tehran",
    "latitude": 35.6719427684,
    "longitude": 51.4243440336,
    "size": 1.5,
    "color": 'yellow'
  },
  {
    "name": "Kabul",
    "latitude": 34.5166902863,
    "longitude": 69.1832600493,
    "size": 1.5,
    "color": 'red'
  },
  {
    "name": "Baghdad",
    "latitude": 33.3386484975,
    "longitude": 44.3938687732,
    "size": 1,
    "color": 'red'
  },
]

const HomePage3DMap = () => {
  const [places, setPlaces] = useState([]);
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  var selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection',
  }

  function handleSelect(ranges) {
    console.log("handleSelect", ranges);
    setStartDate(ranges.selection.startDate)
    setEndDate(ranges.selection.endDate)
    // {
    //   selection: {
    //     startDate: [native Date Object],
    //     endDate: [native Date Object],
    //   }
    // }
  }

  useEffect(() => {
    // load data
    // fetch('https://static.fanoos.app/api/mapPoint.json').then(res => res.json())
    //     .then(({data}) => setPlaces(data));
  }, []);

  return <div className='mx_HomePage3DMap'>


    <div className='leftPanel'>
      <DateRangePicker
        ranges={[selectionRange]}
        onChange={handleSelect}
        direction='horizontal'
        showPreview={false}
        staticRanges={[]}
        inputRanges={[]}
      />
    </div>
    <div className='rightPanel'>
      <Globe
        globeImageUrl="https://unpkg.com/three-globe@2.24.3/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="https://static.fanoos.app/bg2.png"

        labelsData={News}
        labelLat={d => d.latitude}
        labelLng={d => d.longitude}
        labelText={d => d.name}
        labelSize={d => d.size}
        labelDotRadius={d => d.size}
        labelColor={d => d.color}
        onLabelClick={(e) => { Modal.createTrackedDialog('News Dialog', '', HomePage3DMapNews, e); }}

        

        labelResolution={2}
      />
    </div>

  </div>


};

export default HomePage3DMap;

