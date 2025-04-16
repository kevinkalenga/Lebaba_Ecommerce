import { clearCart } from '../../redux/features/cart/cartSlice'
import { useSelector, useDispatch } from 'react-redux'
import { loadStripe } from "@stripe/stripe-js";
import { getBaseUrl } from "../../utils/baseURL"

const OrderSummary = () => {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const products = useSelector((store) => store.cart.products);
    console.log(products)
    const { selectedItems, totalPrice, tax, taxRate, grandTotal } = useSelector((store) => store.cart);

    const handleClearCart = () => {
        dispatch(clearCart());
    }

    // payement integration
    // const makePayement = async (e) => {
    //     const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PK)
    //     const body = {
    //         products: products,
    //         userId: user?._id
    //     }

    //     const headers = {
    //         "Content-Type": "application/json"
    //     }

    //     const response = await fetch(`${getBaseUrl()}/api/orders/create-checkout-session`, {
    //         method: "POST",
    //         headers: headers,
    //         body: JSON.stringify(body)
    //     })

    //     const session = await response.json();
    //     console.log("session: ", session);

    //     const result = stripe.redirectToCheckout({
    //         sessionId: session.id
    //     })

    //     console.log("result: ", result)

    //     if (result.error) {
    //         console.log("Error: ", result.error)
    //     }
    // }


    const makePayment = async (e) => {
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PK);

        const body = {
            products: products.map(product => ({
                name: product.name,
                image: product.image,  // Make sure your backend expects this
                price: product.price,  // Ensure price is included
                quantity: product.quantity,
            })),
            userId: user?._id
        };

        try {
            const response = await fetch(`${getBaseUrl()}/api/orders/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const session = await response.json();
            console.log("Session created: ", session);

            const result = await stripe.redirectToCheckout({ sessionId: session.id });

            if (result.error) {
                console.error("Error: ", result.error);
            }
        } catch (error) {
            console.error("Fetch failed: ", error);
        }
    };







    return (
        <div className='bg-primary-light mt-5 rounded text-base'>
            <div className='px-6 py-4 space-y-5'>
                <h2 className=' text-xl text-text-dark'>Order Summary</h2>
                <p className='text-text-dark mt-2'>Selected Items: {selectedItems}</p>
                <p>Total Price: ${totalPrice.toFixed(2)}</p>
                <p>Tax({taxRate * 100}%): ${tax.toFixed(2)}</p>
                <h3 className='font-bold'>GrandTotal: ${grandTotal.toFixed(2)}</h3>
                <div className='px-4 mb-6'>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClearCart();
                        }}
                        className='bg-red-500 px-3 py-1.5 text-white mt-2
                     rounded-md flex justify-between items-center mb-4'>
                        <span className='mr-2'>Clear cart</span>
                        <i className="ri-delete-bin-2-fill"></i>
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            makePayement()
                        }}
                        className='bg-green-600 px-3 py-1.5 text-white mt-2
                     rounded-md flex justify-between items-center mb-4'>
                        <span className='mr-2'>
                            Proceed Checkout
                            <i className="ri-bank-card-line"></i>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OrderSummary