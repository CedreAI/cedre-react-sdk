import React from 'react'
import Globe from 'react-globe.gl';
import Modal from "../../Modal";
import HomePage3DMapNews from './HomePage3DMapNews';

const { useState, useEffect } = React;

const News = [
    {
        "id":1,
        "name": "Tehran",
        "latitude": 35.6719427684,
        "longitude": 51.4243440336,
        "size": 1.5,
        "color":'yellow'
    },
    {
        "name": "Kabul",
        "latitude": 34.5166902863,
          "longitude": 69.1832600493,
        "size": 1.5,
        "color":'red'
    },
    {
        "name": "Baghdad",
        "latitude": 33.3386484975,
        "longitude": 44.3938687732,
        "size": 1,
        "color":'red'
    },
]

const HomePage3DMap = () => {
    const [places, setPlaces] = useState([]);

    
    useEffect(() => {
        // load data
        // fetch('https://static.fanoos.app/api/mapPoint.json').then(res => res.json())
        //     .then(({data}) => setPlaces(data));
    }, []);

    return <Globe
        globeImageUrl="https://unpkg.com/three-globe@2.24.3/example/img/earth-blue-marble.jpg"
        // backgroundImageUrl="https://static.fanoos.app/stellarium_night.png"
        
        labelsData={News}
        labelLat={d => d.latitude}
        labelLng={d => d.longitude}
        labelText={d => d.name}
        labelSize={d => d.size}
        labelDotRadius={d => d.size}
        labelColor={d => d.color}
        onLabelClick={(e) => {Modal.createTrackedDialog('News Dialog', '', HomePage3DMapNews,e);}}

        

        labelResolution={2}
    />;

};

export default HomePage3DMap;