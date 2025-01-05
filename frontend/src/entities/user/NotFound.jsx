import React from "react";
import { Flex, Image } from "@chakra-ui/react";
import notFound from "../../assets/notfound.jpeg";

const NotFound = () => {
  return (
    <Flex justifyContent={"center"}>
      <Image src={notFound} />
    </Flex>
  );
};

export default NotFound;
