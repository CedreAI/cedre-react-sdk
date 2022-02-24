import React from 'react'
import { Map, Marker,ZoomControl } from "pigeon-maps"

const points = [
    {
        'name': 'برج آزادی',
        'anchor': [35.699739, 51.338097],
        'color':'red',
        'count':70

    },
    {
        'name': 'برج میلاد',
        'anchor': [35.7376549,51.380218],
        'color':'yellow',
        'count':50
    },
    {
        'name': 'کاخ گلستان',
        'anchor': [35.7035282,51.4059534],
        'color':'orange',
        'count':60
    },
    {
        'name': 'مصلی',
        'anchor': [35.7361958,51.423373],
        'color':'#4caf50',
        'count':40
    },
    {
        'name': 'بوستان ولایت',
        'anchor': [35.646764, 51.378551],
        'color':'#4caf50',
        'count':40
    },
    {
        'name': 'پارک سرخه حصار',
        'anchor': [35.644532, 51.577121],
        'color':'red',
        'count':70
    },
]

function HomePageMap() {
    return (
        <div className='mx_HomePage_Tabs_Iframe' dir='ltr'>
            <Map height={600} defaultCenter={[35.699739, 51.338097]} defaultZoom={11}>
                {points.map((point) =>
                    <Marker
                        width={point.count}
                        anchor={point.anchor}
                        color={point.color}
                        onClick={() => alert(point.name)}
                    />
                )}
                <ZoomControl />
            </Map>
        </div>
    );
}

export default HomePageMap;