import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
// import { shallow } from 'zustand/shallow'

import { createViewSlice, ViewSlice } from "./ViewSlice";

export type MyState = ViewSlice;

const useStoreImpl = create<MyState>()(
    immer((...a) => ({
        ...createViewSlice(...a),
    }))
);

// const useStore = (sel: ) => useStoreImpl(sel, shallow)
// Object.assign(useStore, useStoreImpl)
const { getState, setState } = useStoreImpl;
export { getState, setState };
export default useStoreImpl;
