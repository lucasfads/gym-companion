import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from 'recharts';

const CustomDot = (props) => {
    const { cx, cy, payload, onRemoveRecord, exerciseName } = props;

    const handleClick = () => {
        onRemoveRecord(exerciseName, payload.id);
    };

    return <Dot cx={cx} cy={cy} r={8} fill='red' onClick={handleClick} />;
};


const RecordsGraph: React.FC = ({ records, onRemoveRecord, exerciseName }) => {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart
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
                <Line 
                    type="monotone" 
                    dataKey="maxLoad" 
                    stroke="#8884d8" 
                    activeDot={<CustomDot onRemoveRecord={onRemoveRecord} exerciseName={exerciseName} />}
                />
            </LineChart>
        </ResponsiveContainer>
    );

}

export default RecordsGraph;