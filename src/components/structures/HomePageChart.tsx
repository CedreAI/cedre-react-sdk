import React from 'react';

import { Hint, Sunburst } from 'react-vis';


const COLORS = [
    '#19CDD7',
    '#DDB27C',
    '#88572C',
    '#FF991F',
    '#F15C17',
    '#223F9A',
    '#DA70BF',
    '#125C77',
    '#4DC19C',
    '#776E57',
    '#12939A',
    '#17B8BE',
    '#F6D18A',
    '#B7885E',
    '#FFCB99',
    '#F89570',
    '#829AE3',
    '#E79FD5',
    '#1E96BE',
    '#89DAC1',
    '#B3AD9E'
];

const DATA = {
    children: [
        {
            name: 'گروه قرآن',
            children: [
                { bigness: 1, children: [], clr: COLORS[1], name: 'معارف' },
                { bigness: 1, children: [], clr: COLORS[2], name: 'علوم قرآنی' }
            ],
            clr: COLORS[3]
        },
        {
            bigness: 1,
            children: [],
            clr: COLORS[4],
            name: 'cool',
            labelStyle: {
                fontSize: 15,
                fontWeight: 'bold'
            }
        },
        { bigness: 1, children: [], clr: COLORS[5], name: 'lable3' },
        { bigness: 1, children: [], clr: COLORS[6], name: 'lable4' },
        {
            children: [
                { bigness: 1, children: [], clr: COLORS[7], name: '۱خانوادگی' },
                { bigness: 1, children: [], clr: COLORS[8], name: '۲خانوادگی' },
                { bigness: 1, children: [], clr: COLORS[9], name: '۳خانوادگی' }
            ],
            clr: COLORS[9]
        }
    ]
};

const tipStyle = {
    //   display: 'flex',
    position: 'fixed',
    left: '100px',
    top: '50px',
    color: '#fff',
    background: '#000',
    alignItems: 'center',
    padding: '5px'
};
const boxStyle = { height: '10px', width: '10px' };

function buildValue(hoveredCell) {
    const { radius, angle, angle0 } = hoveredCell;
    const truedAngle = (angle + angle0) / 2;
    return {
        x: radius * Math.cos(truedAngle),
        y: radius * Math.sin(truedAngle)
    };
}

export default class SunburstWithTooltips extends React.Component {
    state = {
        hoveredCell: false
    };
    render() {
        const { hoveredCell } = this.state;
        return (
            <Sunburst
                data={DATA}
                style={{ stroke: '#fff' }}
                onValueMouseOver={v =>
                    this.setState({ hoveredCell: v.x && v.y ? v : false })
                }
                onValueMouseOut={() => this.setState({ hoveredCell: false })}
                height={600}
                margin={{ top: 50, bottom: 50, left: 50, right: 50 }}
                getLabel={d => d.name}
                getSize={d => d.bigness}
                getColor={d => d.clr}
                width={600}
                padAngle={() => 0.02}
            >
                {hoveredCell ? (
                    <Hint value={buildValue(hoveredCell)}>
                        <div style={tipStyle}>
                            {/* <div style={{...boxStyle, background: hoveredCell.clr}} /> */}
                            {hoveredCell.name}
                        </div>
                    </Hint>
                ) : null}
            </Sunburst>
        );
    }
}