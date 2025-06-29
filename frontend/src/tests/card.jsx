// Card.js
import React from 'react';

const Card = (props) => {
    return (
        <div>
            <h1>{props.id}</h1>
            <h1>{props.name}</h1>
        </div>
    );
};

export default Card;
