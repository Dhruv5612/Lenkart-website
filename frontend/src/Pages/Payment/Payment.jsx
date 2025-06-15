import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cartReset } from "../../redux/CartPage/action";
import { addToOrder } from "../../redux/order/order.actions";
import { Box, Button, Flex, Image, Input, Grid, Text } from "@chakra-ui/react";
import "../../App.css";

// Replace with your actual publishable key
const stripePromise = loadStripe("your_publishable_key");

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.CartReducer);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cardholderName, setCardholderName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: cardholderName,
        },
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }

      // Here you would typically send the paymentMethod.id to your backend
      // For now, we'll just proceed with the order
      dispatch(addToOrder(cart));
      navigate("/confirm");
      dispatch(cartReset());
    } catch (err) {
      setError("An unexpected error occurred.");
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box>
        <Input
          placeholder="Cardholder Name"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          fontSize="lg"
          h="40px"
          borderRadius="lg"
          p="2%"
          m="20px 10px 20px 10px"
          w="70%"
          required
        />
      </Box>

      <Box m="20px 10px">
        <Box
          p="12px"
          border="1px solid #e2e8f0"
          borderRadius="lg"
          w="70%"
          bg="white"
        >
          <CardElement options={cardElementOptions} />
        </Box>
      </Box>

      {error && (
        <Text color="red.500" ml="10px" mb="10px">
          {error}
        </Text>
      )}

      <Button
        type="submit"
        fontSize="16px"
        bg="#3bb3a9"
        color="white"
        p="25px 22px"
        _hover={{ backgroundColor: "teal" }}
        borderRadius="lg"
        isDisabled={!stripe || processing || !cardholderName}
      >
        {processing ? "Processing..." : "PLACE ORDER"}
      </Button>
    </form>
  );
};

const Payment = () => {
  return (
    <>
      <Navbar />
      <Box>
        <br />
        <br />
        <Box>
          <Box
            w={{ xl: "75%", lg: "80%", md: "90%", sm: "90%", base: "95%" }}
            m="auto"
          >
            <Box
              m="auto"
              boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
              borderRadius="lg"
            >
              <Box
                bg="#00bac6"
                color="white"
                fontWeight="700"
                p="4px 0px 6px 6px"
                fontSize="xl"
                textAlign="left"
              >
                PAYMENT OPTION
              </Box>
              <br />
              <Box display="flex" fontSize="lg" gap="9">
                <Flex
                  w="200px"
                  flexDirection="column"
                  borderRight="2px solid gray"
                  borderBottom="2px solid gray"
                  borderRadius="2xl"
                  display={{ md: "inherit", base: "none" }}
                >
                  <Box
                    p="16px 0px 16px 16px"
                    fontWeight="500"
                    _hover={{ bg: "blackAlpha.200" }}
                    bg="blackAlpha.200"
                  >
                    Credit/Debit Card
                  </Box>
                  <Box
                    p="16px 0px 16px 16px"
                    fontWeight="500"
                    _hover={{ bg: "blackAlpha.200" }}
                  >
                    BHIM/UPI Phone Pe
                  </Box>
                  <Box
                    p="16px 0px 16px 16px"
                    fontWeight="500"
                    _hover={{ bg: "blackAlpha.200" }}
                  >
                    Net Banking
                  </Box>
                  <Box
                    p="16px 0px 16px 16px"
                    fontWeight="500"
                    _hover={{ bg: "blackAlpha.200" }}
                  >
                    UPI QR Code
                  </Box>
                  <Box
                    p="16px 0px 16px 16px"
                    fontWeight="500"
                    _hover={{ bg: "blackAlpha.200" }}
                  >
                    Paytm
                  </Box>
                </Flex>
                <Box m="10px 10px 10px 10px">
                  <Grid
                    templateColumns={{
                      base: "repeat(1,1fr)",
                      sm: "repeat(1,1fr)",
                      md: "20% 75%",
                      lg: "20% 75%",
                      xl: "20% 80%"
                    }}
                    fontSize="lg"
                    justifyContent={{
                      md: "left",
                      sm: "center",
                      base: "center"
                    }}
                  >
                    <Box
                      fontWeight="bold"
                      color="gray.600"
                      display={{ md: "inherit", base: "none" }}
                    >
                      100% Secure
                    </Box>
                    <Image
                      ml={{ md: "80px", sm: "0px", base: "0px" }}
                      h={{ xl: "40px", lg: "40px", base: "40px" }}
                      src="https://static5.lenskart.com/images/cust_mailer/Mar-03/CheckoutStrip.png"
                      w={{
                        xl: "100%",
                        lg: "80%",
                        md: "80%",
                        sm: "100%",
                        base: "100%"
                      }}
                    />
                  </Grid>
                  <br />
                  <Elements stripe={stripePromise}>
                    <PaymentForm />
                  </Elements>
                </Box>
              </Box>
              <Box p="10px" fontSize="lg" fontWeight="medium" color="gray.500">
                GlassCart Assurance
              </Box>
              <Image
                p="10px"
                w="90%"
                m="auto"
                src="https://static1.lenskart.com/media/desktop/img/all-assurance-offering.png"
                _hover={{ transform: "scale(1.1)" }}
              />
              <br />
            </Box>
            <br />
            <br />
          </Box>
        </Box>
      </Box>
      <br />
      <br />
      <br />
      <Footer />
    </>
  );
};

export default Payment;
