import React from 'react';
import './SpectroBars.scss';

export const SpectroBars: React.FC = () => {
    const barCount = 200;

    return (
        <div id="bars">
            {[...Array(barCount)].map(() => (
                <span/>
            ))}
        </div>
    );
}