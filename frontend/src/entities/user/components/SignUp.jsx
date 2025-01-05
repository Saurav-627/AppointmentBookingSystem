import { useState } from "react";
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Image,
  Box,
  useColorModeValue,
  HStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
export default function SignUp() {
  const navigate = useNavigate();
  const state = useLocation();
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [city, setCity] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const toast = useToast();
  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(first, last, city, age, email);
    const name = first + " " + last;
    const phone = state.state.phone;
    console.log(phone);
    const payload = {
      phone,
      name,
      city,
      age,
      email,
    };

    try {
      console.log(payload);
      const response = await axios.post(
        "http://localhost:3000/api/user/register",
        {
          phone: payload.phone,
          name: payload.name,
          city: payload.city,
          age: payload.age,
          email: payload.email,
        }
      );
      const data = await response.data;
      if (data) {
        toast({
          title: "Account Created.",
          description: "We've created your account for you.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Stack maxH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack display={"flex"} align={"center"}>
            <Text fontSize={"30px"} fontWeight={"400"}>
              Get Started
            </Text>
            <Text fontSize={"18px"} fontWeight={"300"}>
              Seems like you dont have an account
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <form onSubmit={submitHandler}>
              <Stack spacing={4}>
                <HStack>
                  <Box>
                    <FormControl id="firstName" isRequired>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        type="text"
                        onChange={(e) => {
                          setFirst(e.target.value);
                        }}
                        required
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl id="lastName">
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        type="text"
                        onChange={(e) => {
                          setLast(e.target.value);
                        }}
                        required
                      />
                    </FormControl>
                  </Box>
                </HStack>

                <HStack>
                  <Box>
                    <FormControl id="City" isRequired>
                      <FormLabel>City</FormLabel>
                      <Input
                        type="text"
                        onChange={(e) => {
                          setCity(e.target.value);
                        }}
                        required
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl id="bloodGroup">
                      <FormLabel>Age</FormLabel>
                      <Input
                        type="text"
                        onChange={(e) => {
                          setAge(e.target.value);
                        }}
                        required
                      />
                    </FormControl>
                  </Box>
                </HStack>
                <FormControl id="email" isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    required
                  />
                </FormControl>
                <Stack spacing={10} pt={2}>
                  <Button
                    type="submit"
                    loadingText="Submitting"
                    size="lg"
                    background={"#8c81ea"}
                    color={"white"}
                    _hover={{
                      bg: "purple.600",
                    }}
                  >
                    Sign up
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Flex>
    </Stack>
  );
}
