import React from 'react'
import Globe from 'react-globe.gl';


function HomePage3DMap() {
    return (
        <div className='mx_HomePage_Tabs_Iframe' dir='center'>
            <Globe
                globeImageUrl='https://unpkg.com/three-globe@2.24.3/example/img/earth-blue-marble.jpg'
                height={600}
                width={600}
                backgroundColor='#fff'
            />
        </div>
    );
}

export default HomePage3DMap;