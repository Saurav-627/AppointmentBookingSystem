import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  useToast,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { BiImageAdd } from "react-icons/bi";
import { useState, useEffect } from "react";

const ManagerProfile = (props) => {
  const manager = localStorage.getItem("manager");
  const toast = useToast();
  const [managerData, setManagerData] = useState({});
  const [background, setBackground] = useState(null);

  const fetchManagerData = async () => {
    const data = await fetch(
      `http://localhost:3000/api/manager/getManagerData/${manager}`
    );
    const response = await data.json();
    setManagerData(response.hospital);
  };

  useEffect(() => {
    fetchManagerData();
  }, []);

  const [image, setImage] = useState(null);
  const updateManagerData = async () => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "lef6u6wv");
    const requestConfig = {
      url: `https://api.cloudinary.com/v1_1/ddrleopwg/image/upload`,
      method: "POST",
      body: formData,
    };
    const response = await fetch(requestConfig.url, requestConfig);
    const imageLink = await response.json();

    const newData = {
      ...{ ...managerData, image: imageLink ? imageLink.url : "" },
      id: manager,
    };

    console.log(newData);
    try {
      const data = await fetch(
        `http://localhost:3000/api/manager/updateManagerData`,
        {
          method: "PATCH",
          body: JSON.stringify({}),
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
        }
      );
      const response = await data.json();
      console.log(response);
      props.setManagerUpdated(true);
      toast({
        title: "Profile Updated.",
        description: "Your profile has been updated.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Failed to Update.",
        description: "Something went wrong.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  return (
    <Stack
      spacing={4}
      w={"full"}
      bg={useColorModeValue("white", "gray.700")}
      rounded={"xl"}
      boxShadow={"lg"}
      p={6}
      my={12}
      as={"form"}
      onSubmit={(e) => {
        e.preventDefault();
        updateManagerData();
      }}
    >
      <Stack
        direction={["column", "row"]}
        spacing={6}
        justifyContent={"center"}
        w={"full"}
      >
        <HStack w={"full"} justifyContent={"center"}>
          <Flex
            w={"400px"}
            height={"200px"}
            bg={"gray"}
            justifyContent={"end"}
            alignItems={"end"}
            bgImage={
              background ? `url(${background})` : `url(${managerData.image})`
            }
            bgPos={"center"}
            bgSize={"cover"}
            bgRepeat={"no-repeat"}
          >
            <Flex
              position={"relative"}
              width={"full"}
              height={"full"}
              rounded={"full"}
              bg={"rgba(0,0,0,0.2)"}
              justifyContent={"center"}
              alignItems={"center"}
              transition={"all 0.3s ease-in-out"}
              opacity={"0"}
              _hover={{
                opacity: "1",
                bg:
                  background || managerData.image
                    ? "rgba(255,255, 255, 0.2)"
                    : "rgba(0,0,0,0.2)",
                transition: "all 0.3s ease-in-out",
              }}
              bgSize={"contain"}
              default={managerData.image}
              cursor={"pointer"}
            >
              <BiImageAdd size={"28px"} />
              <Input
                type={"file"}
                position={"absolute"}
                height={"100%"}
                width={"100%"}
                opacity={"0"}
                onChange={(e) => {
                  const file = e.target.files[0];
                  const fullPath = URL.createObjectURL(file);
                  setBackground(fullPath);
                  setImage(file);
                }}
              />
            </Flex>
          </Flex>
        </HStack>
      </Stack>
      <HStack spacing={4}>
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Hospital Name"
            _placeholder={{ color: "gray.500" }}
            type="text"
            defaultValue={managerData.name}
            onChange={(e) => {
              setManagerData({ ...managerData, name: e.target.value });
            }}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="*********"
            _placeholder={{ color: "gray.500" }}
            type="password"
            defaultValue={managerData.password}
            onChange={(e) => {
              setManagerData({ ...managerData, password: e.target.value });
            }}
          />
        </FormControl>
      </HStack>
      <HStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>City </FormLabel>
          <Input
            placeholder="password"
            _placeholder={{ color: "gray.500" }}
            type="text"
            defaultValue={managerData.city}
            onChange={(e) => {
              setManagerData({ ...managerData, city: e.target.value });
            }}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Address</FormLabel>
          <Input
            placeholder="password"
            _placeholder={{ color: "gray.500" }}
            type="text"
            defaultValue={managerData.address}
            onChange={(e) => {
              setManagerData({ ...managerData, address: e.target.value });
            }}
          />
        </FormControl>
      </HStack>

      <HStack spacing={4}>
        <FormControl isRequired>
          <FormLabel> Phone </FormLabel>
          <Input
            placeholder="City"
            _placeholder={{ color: "gray.500" }}
            type="text"
            defaultValue={managerData.phone}
            onChange={(e) => {
              setManagerData({ ...managerData, phone: e.target.value });
            }}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Address"
            _placeholder={{ color: "gray.500" }}
            type="text"
            defaultValue={managerData.email}
            onChange={(e) => {
              setManagerData({ ...managerData, email: e.target.value });
            }}
          />
        </FormControl>
      </HStack>

      <Stack
        spacing={6}
        direction={["column", "row"]}
        w={"full"}
        justifyContent={"center"}
      >
        <Button
          bg={"blue.400"}
          color={"white"}
          type="submit"
          w="400px"
          _hover={{
            bg: "blue.500",
          }}
        >
          Save Changes
        </Button>
      </Stack>
    </Stack>
  );
};

export default ManagerProfile;
