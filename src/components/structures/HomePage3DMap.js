import React from 'react'
import Globe from 'react-globe.gl';
import Modal from "../../Modal";
import HomePage3DMapNews from './HomePage3DMapNews';



import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import AccessibleTooltipButton from '../views/elements/AccessibleTooltipButton';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const { useState, useEffect } = React;


const HomePage3DMap = () => {
  const [places, setPlaces] = useState([]);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState(new Date("2022-05-25"))
  const [endDate, setEndDate] = useState(new Date("2022-05-27"))

  var selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection',
  }

  function handleSelect(ranges) {
    console.log("handleSelect", ranges);
    setStartDate(ranges.selection.startDate)
    setEndDate(ranges.selection.endDate)
    loadData(1,ranges.selection.startDate,ranges.selection.endDate)

  }

  useEffect(() => {
    // load data
    loadData(1)
  }, []);

  function loadData(_page,start=startDate,end=endDate) {
    setPage(_page)
    var formatStartDate = start.toISOString().slice(0, 10)
    var formatEndDate = end.toISOString().slice(0, 10)
    fetch(`https://news.parsi.ai/api/?page=${_page}&start-date=${formatStartDate}&end-date=${formatEndDate}`, {
      method: 'post'
    }).then(function (response) {
      return response.json();
    }).then(data => {
      if (_page == 1)
        setPlaces(data.results)
      else
        setPlaces([...places, ...data.results])
    });
  }


  return <div className='mx_HomePage3DMap'>


    <div className='leftPanel'>
      <Tabs>
            <TabList >
                 <Tab>فیلتر</Tab> 
                 <Tab> لیست اخبار</Tab> 
            </TabList>
                <TabPanel>
                                <DateRangePicker
                        ranges={[selectionRange]}
                        
                        onChange={handleSelect}
                        direction='horizontal'
                        showPreview={false}
                        staticRanges={[]}
                        inputRanges={[]}
                      />
                </TabPanel> 
                <TabPanel>
                    <div className="news">
                    {places.map(e=>
                          <a className='newsBox'
                              onClick={()=>Modal.createTrackedDialog('News Dialog', '', HomePage3DMapNews, e)}
                            >
                            <div className='imgBox'>
                              <img src={e.image}/>
                            </div>
                            <div className='titleBox'>
                              <b>{e.title}</b>
                              <p>دسته بندی خبر : {e.category}</p>
                              {/* <p>محل خبر : {e.place.name}</p> */}
                            </div>
                          </a>  
                      )}
                    </div>
                      
                </TabPanel> 
        </Tabs>
      
      
      <AccessibleTooltipButton
        className='loadMore'
        onClick={() => { loadData(page + 1) }}
        title={"بیشتر"}
      >
        {page} دریافت بیشتر اخبار
      </AccessibleTooltipButton>

    </div>
    <div className='rightPanel'>


      <Globe
        globeImageUrl="https://unpkg.com/three-globe@2.24.3/example/img/earth-blue-marble.jpg"
        // backgroundImageUrl="https://static.fanoos.app/bg2.png"

        labelsData={places.filter(e => e.place.lat)}
        labelLat={d => parseFloat(d.place.lat) || 43.9171500845}
        labelLng={d => parseFloat(d.place.lon) || 12.4666702867}
        labelText={d => ''}
        labelSize={d => d.count || 2}
        labelDotRadius={d => d.count || 1}
        // labelColor="red"
        onLabelClick={(e) => { Modal.createTrackedDialog('News Dialog', '', HomePage3DMapNews, e); }}

        labelColor={() => 'rgba(255, 165, 0, 0.75)'}
        labelResolution={2}
      />

    </div>

  </div>


};

export default HomePage3DMap;

