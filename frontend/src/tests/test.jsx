// Test.js
import React from 'react';
import Card from './card';

const Test = () => {
    const data = [
        {id: 1, name: "vibekillos"},
        {id: 2, name: "codejocker"},
        {id: 3, name: "icyamamare"}
    ];
    
    return (
        <div>
            {
                data.map((item) => (
                    <div key={item.id}>
                        <h1>hello test</h1>
                        <Card id={item.id} name={item.name} />
                    </div>
                ))
            }
        </div>
    );
};

export default Test;
