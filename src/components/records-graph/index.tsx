import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from 'recharts';
import { RemoveRecordHandler } from "@/types";

interface RecordPayload {
    id: number;
    date: Date;
    maxLoad: number;
}

interface CustomDotProps {
    cx?: number;
    cy?: number;
    payload?: RecordPayload;
    onRemoveRecord: RemoveRecordHandler;
    exerciseName: string
}

const CustomDot = (props: CustomDotProps) => {
    const { cx, cy, payload, onRemoveRecord, exerciseName } = props;

    const handleClick = () => {
        if (payload)
            onRemoveRecord(exerciseName, payload.id);
    };

    return <Dot cx={cx} cy={cy} r={8} fill='red' onClick={handleClick} />;
};

interface RecordGraphProps {
    records: Array<Object>;
    onRemoveRecord: RemoveRecordHandler;
    exerciseName: string;
}

const RecordsGraph: React.FC<RecordGraphProps>  = ({ records, onRemoveRecord, exerciseName }) => {
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