"use client";

import React from "react";
// @ts-ignore
import USAMap from "react-usa-map";

import { MAP_FILL } from "@/lib/constants";

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
    console.log(visitedStates);

    states.forEach((state) => {
      if (state.visited) {
        visitedStates[state.state_id] = {
          fill: MAP_FILL,
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
