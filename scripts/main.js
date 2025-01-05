import { loadData } from '../backend/utils/loadData.js';

onload = async () => {
  localStorage.clear();
  loadData();
};
