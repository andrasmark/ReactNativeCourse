import { configureStore } from "@reduxjs/toolkit";

import favouritesSlice from "./favourites";


export const store = configureStore({
   reducer: {
        favouriteMeals: favouritesSlice
   } 
});