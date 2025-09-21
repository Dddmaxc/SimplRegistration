import { createAppSlice } from "../../../../common/utils/createAppSlice";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { setAppStatus } from "../../../../app/app-slice";

export type Status = "idle" | "loading" | "succeeded" | "failed";

export interface Product {
  id?: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  ownerId: string;
  createdAt?: string | null;
}

interface ProductsState {
  items: Product[];
  status: Status;
}

const initialState: ProductsState = {
  items: [],
  status: "idle",
};

const productsSlice = createAppSlice({
  name: "products",
  initialState,
  reducers: (create) => ({
    // 🌐 Fetch products
    fetchProductsTC: create.asyncThunk(
      async (_arg, thunkAPI) => {
        try {
          thunkAPI.dispatch(setAppStatus({ status: "loading" }));
          const snapshot = await getDocs(collection(db, "products"));
          thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));

          const products = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt 
                ? data.createdAt.toDate().toISOString() 
                : null,
            };
          }) as Product[];

          return { products };
        } catch (error) {
          thunkAPI.dispatch(setAppStatus({ status: "failed" }));
          return thunkAPI.rejectWithValue(null);
        }
      },
      {
        fulfilled: (state, action) => {
          state.items = action.payload.products;
          state.status = "succeeded";
        },
      }
    ),

    // ➕ Add product
    addProductTC: create.asyncThunk(
      async (product: Omit<Product, "id" | "createdAt">, thunkAPI) => {
        try {
          thunkAPI.dispatch(setAppStatus({ status: "loading" }));
          const docRef = await addDoc(collection(db, "products"), {
            ...product,
            createdAt: serverTimestamp(),
          });
          thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));

          return { 
            product: { 
              id: docRef.id, 
              ...product,
              createdAt: new Date().toISOString()
            } 
          };
        } catch (error) {
          thunkAPI.dispatch(setAppStatus({ status: "failed" }));
          return thunkAPI.rejectWithValue(null);
        }
      },
      {
        fulfilled: (state, action) => {
          state.items.push(action.payload.product);
          state.status = "succeeded";
        },
      }
    ),
  }),
  selectors: {
    selectProducts: (state) => state.items,
    selectProductsStatus: (state) => state.status,
  },
});

export const { selectProducts, selectProductsStatus } = productsSlice.selectors;
export const { fetchProductsTC, addProductTC } = productsSlice.actions;
export default productsSlice.reducer;