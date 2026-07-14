import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FiltersState {
  q: string;
  location: string;
  categories: string[];
  jobTypes: string[];
  workModes: string[];
  experience: string; // "min-max" | ''
  salaryMin: number | null;
  sort: string;
  page: number;
}

const initialState: FiltersState = {
  q: '',
  location: '',
  categories: [],
  jobTypes: [],
  workModes: [],
  experience: '',
  salaryMin: null,
  sort: 'relevance',
  page: 1,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<{ q: string; location: string }>) {
      state.q = action.payload.q;
      state.location = action.payload.location;
      state.page = 1;
    },
    toggleCategory(state, action: PayloadAction<string>) {
      const i = state.categories.indexOf(action.payload);
      i === -1 ? state.categories.push(action.payload) : state.categories.splice(i, 1);
      state.page = 1;
    },
    toggleJobType(state, action: PayloadAction<string>) {
      const i = state.jobTypes.indexOf(action.payload);
      i === -1 ? state.jobTypes.push(action.payload) : state.jobTypes.splice(i, 1);
      state.page = 1;
    },
    toggleWorkMode(state, action: PayloadAction<string>) {
      const i = state.workModes.indexOf(action.payload);
      i === -1 ? state.workModes.push(action.payload) : state.workModes.splice(i, 1);
      state.page = 1;
    },
    setExperience(state, action: PayloadAction<string>) {
      state.experience = state.experience === action.payload ? '' : action.payload;
      state.page = 1;
    },
    setSalaryMin(state, action: PayloadAction<number | null>) {
      state.salaryMin = action.payload;
      state.page = 1;
    },
    setSort(state, action: PayloadAction<string>) {
      state.sort = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    clearFilters(state) {
      Object.assign(state, { ...initialState, q: state.q, location: state.location });
    },
  },
});

export const {
  setSearch,
  toggleCategory,
  toggleJobType,
  toggleWorkMode,
  setExperience,
  setSalaryMin,
  setSort,
  setPage,
  clearFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
