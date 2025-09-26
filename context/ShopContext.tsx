
'use client'
import { createContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string[];
    category: string;
    subCategory: string;
    sizes: string[];
    bestseller: boolean;
    date: number;
}

type CartItems = { [key: string]: { [key: string]: number } };

interface ShopContextType {
    products: Product[];
    cartItems: { [key: string]: { [key: string]: number } };
    addToCart: (itemId: string, size: string) => void;
    getCartAmount: () => number;
    backendUrl: string;
    token: string;
    setToken: (token: string) => void;
    router: AppRouterInstance;
    currency: string;
    deliveryFee: number;
    search: string;
    setSearch: (search: string) => void;
    showSearch: boolean;
    setShowSearch: (showSearch: boolean) => void;
    setCartItems: (cartItems: { [key: string]: { [key: string]: number } }) => void;
    getCartCount: () => number;
    updateQuantity: (itemId: string, size: string, quantity: number) => void;
}

export const ShopContext = createContext<ShopContextType | null>(null);

const ShopContextProvider = ({ children }: { children: ReactNode }) => {
    const currency = "$";
    const deliveryFee = 10;
    const backendUrl = "https://myshop-29wz.onrender.com";

    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState<CartItems>({});
    const [productList, setProductList] = useState<Product[]>([]);
    const [token, setToken] = useState("");
    const router = useRouter();

    const addToCart = async (itemId: string, size: string) => {
        if (!size) {
            return toast.error("Please select a size");
        }

            const cartData = { ...cartItems };
            cartData[itemId] = cartData[itemId] || {};        cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, { headers: { token } });
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    console.error(error.response?.data || error.message);
                    toast.error(error.response?.data?.message || "Something went wrong");
                } else if (error instanceof Error) {
                    console.error(error.message);
                    toast.error(error.message);
                } else {
                    console.error("An unknown error occurred");
                    toast.error("An unknown error occurred");
                }
            }
        }
    };

    const getCartCount = () => {
        return Object.values(cartItems).reduce((total, item) => {
            return total + Object.values(item).reduce((sum, qty) => sum + qty, 0);
        }, 0);
    };

    const updateQuantity = async (itemId: string, size: string, quantity: number) => {
        const cartData = { ...cartItems };
        if (cartData[itemId] && cartData[itemId][size] !== undefined) {
            cartData[itemId][size] = quantity;
            setCartItems(cartData);

            if (token) {
                try {
                    await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity }, { headers: { token } });
                } catch (error: unknown) {
                    if (axios.isAxiosError(error)) {
                        console.error(error.response?.data || error.message);
                        toast.error(error.response?.data?.message || "Something went wrong");
                    } else if (error instanceof Error) {
                        console.error(error.message);
                        toast.error(error.message);
                    } else {
                        console.error("An unknown error occurred");
                        toast.error("An unknown error occurred");
                    }
                }
            }
        }
    };

    const getCartAmount = () => {
        return Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
            const itemInfo = productList.find((product) => product._id === itemId);
            if (itemInfo) {
                total += Object.values(sizes).reduce((sum, qty) => sum + itemInfo.price * qty, 0);
            }
            return total;
        }, 0);
    };

    const getProductData = async () => {
        try {
            // Use local API with pagination to avoid fetching the entire catalog at once
            const response = await axios.get(`/api/product/list`, {
                params: { limit: 30, sort: 'newest' }
            });
            if (response.data.success) {
                setProductList(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error(error.response?.data || error.message);
                toast.error(error.response?.data?.message || "Failed to load products");
            } else if (error instanceof Error) {
                console.error(error.message);
                toast.error(error.message);
            } else {
                console.error("An unknown error occurred");
                toast.error("An unknown error occurred");
            }
        }
    };

    const getUserCart = async (token: string) => {
        try {
            const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token } });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error(error.response?.data || error.message);
                toast.error(error.response?.data?.message || "Failed to load cart");
            } else if (error instanceof Error) {
                console.error(error.message);
                toast.error(error.message);
            } else {
                console.error("An unknown error occurred");
                toast.error("An unknown error occurred");
            }
        }
    };

    useEffect(() => {
        getProductData();
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!token && storedToken) {
            setToken(storedToken);
            getUserCart(storedToken);
        }
    }, [token]);

    const value: ShopContextType = {
        products: productList,
        currency,
        deliveryFee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        backendUrl,
        token,
        setToken,
        router,
    };

    return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
