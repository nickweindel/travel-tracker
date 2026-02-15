"use client";

import React from "react";
// @ts-ignore
import USAMap from "react-usa-map";

import { MAP_VISITED_FILL, MAP_ONLY_AIRPORT_FILL } from "@/lib/constants";

interface USState {
  state_id: string;
  state_name: string;
  visited: boolean;
  only_airport: boolean;
}

interface UsaMapProps {
  states: USState[];
}

const UsaMap: React.FC<UsaMapProps> = ({ states }) => {
  const statesFilling = () => {
    const visitedStates: { [key: string]: { fill: string } } = {};
    console.log(visitedStates);

    states.forEach((state) => {
      if (state.visited) {
        visitedStates[state.state_id] = {
          fill: MAP_VISITED_FILL,
        };
      } else if (state.only_airport) {
        visitedStates[state.state_id] = {
          fill: MAP_ONLY_AIRPORT_FILL,
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
