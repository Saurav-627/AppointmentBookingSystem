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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  useToast,
  Select,
  Text,
  Td,
  Badge,
} from "@chakra-ui/react";
import { BiImageAdd } from "react-icons/bi";
import { useState, useEffect } from "react";
import { DownloadIcon } from "@chakra-ui/icons";
import axios from "axios";

export default function UserProfileEdit(props) {
  const phone = localStorage.getItem("phone");
  const [userData, setUserData] = useState({});
  const [editData, setEditData] = useState({});
  const [image, setImage] = useState(null); // [1
  const [background, setBackground] = useState(null); // [1
  const [history, setHistory] = useState([]); // [1
  const toast = useToast();
  const fetchUser = async (phoneNumber) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/user/data/${phoneNumber}`
      );
      const data = await response.json();
      console.log("this is user", data);
      setUserData(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/user/getHistory/${phone}`
      );
      const data = await response.json();
      console.log("doshod",data);
      if (data) {
        setHistory(data.history);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const uploadImage = async (requestConfig, formdata) => {
    const response = await fetch(requestConfig.url, requestConfig);
    const data = await response.json();
    return data.secure_url;
  };

  const updateUser = async (phoneNumber) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "lef6u6wv");
    const requestConfig = {
      url: `https://api.cloudinary.com/v1_1/ddrleopwg/image/upload`,
      method: "POST",
      body: formData,
    };
    let data = "";
    try {
      data = await uploadImage(requestConfig);
      console.log(data);
      const res = await fetch(`http://localhost:3000/api/user/updateData`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          name: userData.name,
          emergencyContact: userData.emergencyContact,
          blood: userData.blood,
          image: data ? data : userData.profile,
          address: userData.address,
        }),
      });
      toast({
        title: "Profile Updated.",
        description: "Your profile has been updated.",
        status: "success",
        position: "top-right",
        duration: 2000,
      });
      fetchUser(phone);

      props.setUpdated((prev) => !prev);
    } catch (err) {
      console.log(err);
      toast({
        title: "Update Failed.",
        description: "Update Failed",
        status: "error",
        duration: 2000,
      });
    }
  };

  const downloadReport = async (appointmentId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/user/appointment-report/${appointmentId}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `appointment_${appointmentId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Report downloaded successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error downloading report:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to download report",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchUser(phone);
  }, []);

  return (
    <Flex
      w={"full"}
      bg={useColorModeValue("gray.50", "gray.800")}
      px={12}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"350px"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        py={6}
        px={4}
        my={12}
        as={"form"}
        onSubmit={(e) => {
          e.preventDefault();
          updateUser(phone);
        }}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <FormControl id="userName">
          <Stack
            direction={["column", "row"]}
            spacing={6}
            justifyContent={"center"}
            w={"full"}
          >
            <HStack w={"full"} justifyContent={"center"}>
              <Flex
                w={"120px"}
                height={"120px"}
                bg={"gray"}
                rounded={"full"}
                justifyContent={"end"}
                alignItems={"end"}
                bgImage={
                  background ? `url(${background})` : `url(${userData.profile})`
                }
                bgPos={"center"}
                bgSize={"cover"}
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
                      background || userData.profile
                        ? "rgba(255,255, 255, 0.2)"
                        : "rgba(0,0,0,0.2)",
                    transition: "all 0.3s ease-in-out",
                  }}
                  default={userData.profile}
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
        </FormControl>
        <Heading fontSize={{ base: "lg", sm: "2xl" }} justifyContent={"center"}>
          {userData.name}
        </Heading>

        <FormControl id="email" isRequired>
          <FormLabel>Dependency Contact</FormLabel>
          <Input
            placeholder="9837474747"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={userData.emergencyContact}
            onChange={(e) => {
              setUserData({ ...userData, emergencyContact: e.target.value });
            }}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Blood Group</FormLabel>
          {/* <Input
            placeholder="B+"
            _placeholder={{ color: "gray.500" }}
            type="text"
            defaultValue={userData.blood}
            onChange={(e) => {
              setUserData({ ...userData, blood: e.target.value });
            }}
          /> */}
          <Select
            placeholder="Select option"
            value={userData.blood}
            onChange={(e) => {
              setUserData({ ...userData, blood: e.target.value });
            }}
          >
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="Not Sure">Not Sure</option>
          </Select>
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Address</FormLabel>
          <Input
            placeholder="E.g Mandikhatar"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={userData.address}
            onChange={(e) => {
              setUserData({ ...userData, address: e.target.value });
            }}
          />
        </FormControl>
        <Stack spacing={6} direction={["column", "row"]} w={"full"}>
          <Button
            bg={"purple.400"}
            color={"white"}
            type={"submit"}
            w="full"
            _hover={{
              bg: "purple.500",
            }}
          >
            Update Profile
          </Button>
        </Stack>
      </Stack>
      <Stack
        spacing={4}
        w={"full"}
        maxW={"75%"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        my={12}
        height="532px"
      >
        <TableContainer>
          <Table variant="simple" size={"lg"}>
            <Thead>
              <Tr>
                <Th>Doctor Name</Th>
                <Th>Appointment Date</Th>
                <Th>Appointment Time</Th>
                <Th>Token Number</Th>
                <Th>Amount Paid (Rs)</Th>
                <Th>Status</Th>
                <Th>Download Report</Th>
              </Tr>
            </Thead>
            <Tbody>
              {history.map((item) => {
                console.log(item);
                return (
                  <Tr>
                    <Td>{item.doctor}</Td>
                    <Td>{item.createdAt.split("T")[0]}</Td>
                    <Td>{item.alloted}</Td>
                    <Td>{item.token}</Td>
                    <Td>{item.price}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          item.status === "Pending"
                            ? "yellow"
                            : item.status === "Completed"
                            ? "green"
                            : "red"
                        }
                      >
                        {item.status}
                      </Badge>
                    </Td>
                    <Td>
                    {item.status === "Approved" && (
                        <DownloadIcon
                          boxSize={6}
                          color="blue.500"
                          cursor={"pointer"}
                          onClick={() => downloadReport(item._id)}
                        />
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </Flex>
  );
}
