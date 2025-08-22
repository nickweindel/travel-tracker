"use client";

import React from 'react';
import USAMap from 'react-usa-map';

interface USState {
  state_id: string;
  state_name: string;
  visited: boolean;
}

interface UsaMapProps {
  states: USState[];
}

const UsaMap: React.FC<UsaMapProps> = ({ states }) => {
  const statesFilling = () => {
    const visitedStates: { [key: string]: { fill: string } } = {};

    states.forEach(state => {
      if (state.visited) {
        visitedStates[state.state_id] = {
          fill: "#3B82F6" // Blue
        };
      }
    });

    return visitedStates;
  };

  return (
    <div>
      <USAMap customize={statesFilling()} />
    </div>
  );
};

export default UsaMap;