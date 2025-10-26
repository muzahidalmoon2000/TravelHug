import React, { useState } from 'react'
import apiClient from '../api.js';

function Test() {
    const [data, setData] = useState([]);
    const handleApiCall = async () => {
        try {
            const response = await apiClient.get('/app/health/live'); // Replace with your API endpoint
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    return (
        <>
            <h1 className="text-3xl font-bold underline">
                {data}
            </h1>
            <button className='bg-amber-400 text-white text-xl p-2' onClick={handleApiCall}>API Call</button>
        </>
    )
}


export default Test