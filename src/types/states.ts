export interface StateVisit {
  user_id: string;
  state_id: string;
  state_name: string;
  visited: boolean;
  state_kpi_exception: boolean;
}

export interface StateKpi {
  states_visited: number;
  states_not_visited: number;
}
