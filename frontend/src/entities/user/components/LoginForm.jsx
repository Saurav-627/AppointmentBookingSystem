import { FcGoogle } from "react-icons/fc";
import Doctor from "../../../assets/doctor.png";
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  Image,
  Center,
  Divider,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function LoginForm(props) {
  const [phone, setPhone] = useState(0);
  const [error, setError] = useState(null);
  const toast = useToast();

  const submitHandler = (e) => {
    e.preventDefault();
    if (phone.length === 10 && phone[0] === "9") {
      setError(false);
      props.submitHandler(phone);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    if (error !== null) {
      if (error) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid phone number",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        toast({
          title: "Otp Sent",
          description: "Please check your phone for otp",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
      setError(null);
    }
  }, [error]);

  return (
    <Stack
      height={"80vh"}
      direction={{ base: "column", md: "row" }}
      mt={"60px"}
    >
      <Flex align={"center"} justify={"center"} w={"50%"}>
        <Stack
          w={"full"}
          maxW={"md"}
          justifyContent={"center"}
          display={"flex"}
          height={"75%"}
          spacing={10}
        >
          <Heading fontSize={"4xl"} display={"flex"}>
            <Text fontWeight={"500"} fontSize={"17px"}>
              Skip the weight, schedule your date with booking mate
            </Text>
          </Heading>

          <Stack>
            <form onSubmit={submitHandler}>
              <FormControl id="phone-number">
                <FormLabel>
                  (लगइन गर्नको लागि कृपया आफ्नो फोन नम्बर प्रविष्ट गर्नुहोस्)
                </FormLabel>
                <InputGroup>
                  <InputLeftAddon children="+977" />
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                    required
                  />
                </InputGroup>
              </FormControl>
              <Stack spacing={6} py={"20px"} textAlign={"center"}>
                <Button
                  type="submit"
                  colorScheme={"blue"}
                  background={"#8c81ea"}
                  variant={"solid"}
                >
                  Proceed
                </Button>
                {/* <Text fontWeight={"500"} fontSize={"14px"}>
                  Skip the weight, schedule your date with your booking mate!
                </Text> */}
              </Stack>
            </form>
          </Stack>
        </Stack>
      </Flex>

      <Flex w={"50%"} justifyContent={"flex-end"}>
        <Image alt={"Login Image"} objectFit={"cover"} src={Doctor} />
      </Flex>
    </Stack>
  );
}
