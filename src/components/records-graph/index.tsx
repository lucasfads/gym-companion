import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RecordsGraph: React.FC = ({ records }) => {
    return (
        <LineChart
            width={500}
            height={300}
            data={records}
            margin={{
                top: 5, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="maxLoad" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
    );

}

export default RecordsGraph;