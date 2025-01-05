import { Center, Heading } from "@chakra-ui/react";
import {
  Button,
  FormControl,
  Flex,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  PinInput,
  PinInputField,
  useToast,
  Link,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyEmailForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const [otp, setOtp] = useState("");
  const [invalidOtp, setInvalidOtp] = useState(null);
  const [error, setError] = useState(null);
  const state = useLocation();
  const value = state.state.phone;
  const [disable, setDisable] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/login",
        {
          phone: value,
          otp: otp,
        }
      );
      const data = await response.data;
      console.log(data);
      if (data.message === "SUCCESS") {
        localStorage.setItem("phone", value);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/", { replace: true });
        setError(false);
      } else {
        setError(true);
      }
    } catch (err) {
      setInvalidOtp(true);
      console.log(err);
    }
  };

  /* for 5 mins 3000 to 300000 */

  useEffect(() => {
    if (disable) {
      const intervalId = setInterval(() => {
        setDisable(false);
      }, 3000);
      return () => clearTimeout(intervalId);
    }
  }, [disable]);

  const sendOtp = async (value) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/sendOTP",
        {
          phone: value,
        }
      );
      const data = await response.data;
      console.log(data.otp);
      setDisable(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (error !== null) {
      if (!error) {
        toast({
          title: "Login Successful",
          description: "Welcome to the app",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        navigate("/", { state: { phone: value }, replace: true });
      } else {
        toast({
          title: "Register your Account",
          description: "Please provide your details",
          status: "info",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        navigate("/signup", { state: { phone: value } });
      }
    }
  }, [error]);

  useEffect(() => {
    if (invalidOtp !== null) {
      if (invalidOtp) {
        toast({
          title: "Invalid Otp",
          description: "Please check your phone for otp",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    }
  }, [invalidOtp]);

  return (
    <Flex
      h={"600px"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"sm"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"md"}
        shadow={useColorModeValue("base", "dark-lg")}
        p={6}
      >
        <Center>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
            Verify Your Account
          </Heading>
        </Center>
        <Center
          fontSize={{ base: "sm", sm: "md" }}
          color={useColorModeValue("gray.800", "gray.400")}
        >
          We have sent code to your device
        </Center>
        <Center
          fontSize={{ base: "sm", sm: "md" }}
          fontWeight="bold"
          color={useColorModeValue("gray.800", "gray.400")}
        >
          {state.phone}
        </Center>
        <form onSubmit={submitHandler}>
          <FormControl>
            <Center as={Flex} flexDirection={"column"} gap={5}>
              <HStack>
                {/* <Input
                  type="text"
                  onChange={(e) => {
                    setOtp(e.target.value);
                  }}
                /> */}
                <PinInput
                  onChange={(pin) => {
                    setOtp(pin);
                  }}
                  autoFocus={true}
                >
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
            </Center>
          </FormControl>
          <Stack spacing={6} mt={7}>
            <Button
              type="submit"
              bg={"#814CF5"}
              color={"white"}
              _hover={{
                bg: "purple.600",
              }}
            >
              Verify
            </Button>
            <Flex justifyContent={"center"}>
              {disable ? (
                <Text>Your OTP will expire in 5 min</Text>
              ) : (
                <Link
                  onClick={() => {
                    sendOtp(value);
                  }}
                >
                  Didn't received OTP?
                </Link>
              )}
            </Flex>
          </Stack>
        </form>
      </Stack>
    </Flex>
  );
}
