import React from 'react'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function PayPalCheckout() {
    return (
        <PayPalScriptProvider options={{ "client-id": "ASH5hC7LkddRNU9_YxZVCYBAPWsnLjOtNSwj2Ig1yUcbHpjU3G386YFyK9acZv7tgFeznpyZeiHkxD8q" }}>
            <PayPalButtons
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: "10.00", // Set the transaction amount
                                },
                            },
                        ],
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                        alert(`Transaction completed by ${details.payer.name.given_name}`);
                    });
                }}
            />
        </PayPalScriptProvider>
    )
}

export default PayPalCheckout
