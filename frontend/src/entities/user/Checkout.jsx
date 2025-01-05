import React from "react";
import { Flex, Button, Text, Box } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import KhaltiCheckout from "khalti-checkout-web";

const Checkout = (props) => {
  return (
    <Flex direction={"column"}>
      <Text>{state.time}</Text>
      <Box>
        <Button onClick={PayWithKhalti}>Pay with Khalti</Button>
      </Box>
    </Flex>
  );
};

export default Checkout;
