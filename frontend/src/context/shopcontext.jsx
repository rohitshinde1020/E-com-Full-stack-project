import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const Shopcontext = createContext();

const ShopcontextProvider = ({ children }) => {
    const [isSearchVisible, setIsSearchVisible] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [cartitems, setCartitems] = useState({});
    const [products, setProducts] = useState([]);
    const [isProductsLoading, setIsProductsLoading] = useState(false);
    const [productsError, setProductsError] = useState('');
    const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    const resolveToken = () => {
        const localToken = localStorage.getItem('token') || '';
        const activeToken = token || localToken;

        if (!token && localToken) {
            setToken(localToken);
        }

        return activeToken;
    };


    const getCartData = async () => {
        const activeToken = resolveToken();

        if (activeToken) {
            try {
                const response = await axios.post(
                    `${backendurl}/api/cart/usercart`,
                    {},
                    {
                        headers: { token: activeToken }
                    }
                );

                if (response.data?.success) {
                    setCartitems(response.data.cartdata || {});
                }
            } catch (error) {
                console.error('Error fetching cart data from server:', error.response?.data?.message || error.message);

                if (error.response?.status === 400 || error.response?.status === 401) {
                    localStorage.removeItem('token');
                    setToken('');
                }
            }
        }
    }

    const getproductdata = async () => {
        setIsProductsLoading(true)
        setProductsError('')

        try {
            const response = await axios.get(`${backendurl}/api/products/list`);

            if (response.data?.success) {
                const fetchedProducts = response.data.products || [];
                setProducts(fetchedProducts);
                return fetchedProducts;
            }

            const message = response.data?.message || 'Failed to load products.';
            setProducts([]);
            setProductsError(message);
            return [];
        } catch (error) {
            console.error('Error fetching product data:', error);
            setProducts([]);
            setProductsError(error.response?.data?.message || 'Failed to fetch product data.');
            return [];
        } finally {
            setIsProductsLoading(false)
        }
    }

    const addtocart = async (itemid, size) => {
        const cartdata = structuredClone(cartitems);

        if (cartdata[itemid]) {
            if (cartdata[itemid][size]) {
                cartdata[itemid][size] += 1;
            }
            else {
                cartdata[itemid][size] = 1;
            }
        }
        else {
            cartdata[itemid] = {};
            cartdata[itemid][size] = 1;
        }

        setCartitems(cartdata);

        // Sync with backend if user is authenticated
        const activeToken = resolveToken();

        if (activeToken) {
            try {
                const response = await axios.post(
                    `${backendurl}/api/cart/add`,
                    { productId: itemid, size, quantity: 1 },
                    { headers: { token: activeToken } }
                );

                if (!response.data?.success) {
                    console.error('Failed to add item to cart on server:', response.data?.message);
                    return { success: false, message: response.data?.message || 'Failed to sync cart with server.' };
                }

                return { success: true, message: response.data?.message || 'Item added to cart' };
            } catch (error) {
                console.error('Error syncing cart with server:', error.response?.data?.message || error.message);

                if (error.response?.status === 400 || error.response?.status === 401) {
                    localStorage.removeItem('token');
                    setToken('');
                    return { success: false, message: 'Session expired. Please log in again.' };
                }

                return { success: false, message: error.response?.data?.message || 'Unable to sync cart with server.' };
            }
        }

        return { success: true, message: 'Item added locally. Please login to save your cart.' };
    }

    const removeFromCart = async (itemid, size) => {
        const cartdata = structuredClone(cartitems);
        if (cartdata[itemid] && cartdata[itemid][size]) {
            delete cartdata[itemid][size];
            if (Object.keys(cartdata[itemid]).length === 0) {
                delete cartdata[itemid];
            }
            setCartitems(cartdata);

            // Sync removal with backend
            if (token) {
                try {
                    await axios.post(
                        `${backendurl}/api/cart/update`,
                        {
                            productId: itemid,
                            size,
                            quantity: 0
                        },
                        {
                            headers: { token }
                        }
                    );
                } catch (error) {
                    console.error('Error removing item from cart on server:', error.response?.data?.message || error.message);
                }
            }
        }
    }

    const getCartTotal = () => {
        let total = 0;
        for (const itemid in cartitems) {
            const item = products.find(p => p._id === itemid);
            if (item) {
                for (const size in cartitems[itemid]) {
                    total += item.price * cartitems[itemid][size];
                }
            }
        }
        return total;
    }

    useEffect(() => {
        getproductdata();
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
        }
        if (token) {
            getCartData();
        }
    }, [token]);

    const value = {
        currency: '$',
        deliveryFee: 5.99,
        products,
        isSearchVisible,
        setIsSearchVisible,
        searchQuery,
        setSearchQuery,
        cartitems,
        addtocart,
        removeFromCart,
        getCartTotal,
        setCartitems,
        backendurl,
        getproductdata,
        getCartData,
        isProductsLoading,
        productsError,
        token,
        setToken,
        
    };

    return (
        <Shopcontext.Provider value={value}>
            {children}
        </Shopcontext.Provider>
    );
};

export default ShopcontextProvider;
