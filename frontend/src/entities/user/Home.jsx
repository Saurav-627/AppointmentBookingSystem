import {
  Button,
  Flex,
  Stack,
  Heading,
  Image,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import homeBackground from "../../assets/home-bg.png";
import { motion } from "framer-motion";

const Home = () => {
  const [user, setUser] = useState(localStorage.getItem("phone"));
  const navigate = useNavigate();
  return (
    <Stack
      minH={"86vh"}
      direction={{ base: "column", md: "row" }}
      bgGradient="linear(to-tl, #a785e4, white)"
    >
      <Flex
        p={8}
        flex={1}
        align={"center"}
        justify={"center"}
        marginLeft={"-50px"}
        marginTop={"30px"}
      >
        <Stack spacing={6} w={"full"} maxW={"lg"}>
          <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
            <Text
              fontSize={"35px"}
              color={"#4a5568"}
              as={"span"}
              position={"relative"}
              _after={{
                content: "''",
                width: "full",
                height: useBreakpointValue({ base: "20%", md: "30%" }),
                position: "absolute",
                bottom: 1,
                left: 0,
                zIndex: -1,
              }}
            >
              Revolutonizing
            </Text>
            <br />{" "}
            <Text fontSize={"32px"} color={"#ef6467"} as={"span"}>
              Effortless Medical Scheduling
            </Text>{" "}
          </Heading>
          <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
            Experience the utmost convenience and luxury of booking your doctor
            appointments at the finest hospitals in Kathmandu through our
            state-of-the-art online booking system.
          </Text>
          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            <Button
              padding={"25px"}
              bg={"#8c5bf1"}
              color={"white"}
              _hover={{
                bg: "#a785e4",
              }}
              onClick={() => {
                navigate("/find");
              }}
            >
              Book An Appointment
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex
        flex={1}
        transition={"all 0.5s ease-in-out"}
        _hover={{
          transform: "scale(1.03)",
          transition: "all 0.5s ease-in-out",
        }}
      >
        <Image
          height={"80%"}
          marginTop={"90px"}
          marginRight={"25px"}
          alt={"Login Image"}
          margin={"auto"}
          objectFit={"cover"}
          src={homeBackground}
        />
      </Flex>
    </Stack>
  );
};

export default Home;
