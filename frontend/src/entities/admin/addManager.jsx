import React, { useEffect } from "react";
import { useState } from "react";

import {
  Flex,
  IconButton,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  SimpleGrid,
  chakra,
  ButtonGroup,
  Badge,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  HStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { SearchIcon } from "@chakra-ui/icons";
import { BiImageAdd } from "react-icons/bi";

const AddManager = () => {
  const bg = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("white", "gray.800");
  const bg3 = useColorModeValue("gray.100", "gray.700");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const [search, setSearch] = useState(null);
  const [fullNames, setFullNames] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [specialityData, setSpecialityData] = useState([]);
  const [doctor, setDoctor] = useState(true);
  const [doctorData, setDoctorData] = useState(null);
  const [specailityHospital, setSpecialityHospital] = useState([]);
  const [temp, setTemp] = useState([]);
  const [background, setBackground] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState();
  const [city, setCity] = useState();
  const [EditData, setEditData] = useState({});

  const toast = useToast();

  const getSpecialityData = async () => {
    await fetch("http://localhost:3000/api/manager/getHospitals")
      .then((res) => res.json())
      .then((data) => {
        setSpecialityData([...data.hospitals]);
        setTemp([...data.hospitals]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getSpecialityData();
  }, []);
  // const getSpecialityData = async () => {
  //   await fetch("http://localhost:3000/api/manager/getHospitals")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data.hospitals);
  //       setSpecialityHospital([...data.hospitals]);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // useEffect(() => {
  //   getSpecialityData();
  // }, []);

  const onChangeHandler = (text) => {
    setSearch(text);
    // if (!text) {
    //   setDoctor((doctor) => !doctor);
    // }
    // setSpecialityData(
    // specialityData.filter((item) =>
    //     item.speciality.toLowerCase().includes(text.toLowerCase())
    //   )
    // );
  };

  const deleteHospital = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/deleteHospital/${id}`,
        {
          method: "DELETE",
        }
      );
      const result = await res.json();
      toast({
        title: "Hospital Deleted.",
        description: "Hospital has been deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      getSpecialityData();
    } catch (err) {
      toast({
        title: "Hospital Deleted.",
        description: "Hospital has been deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const addHospital = async () => {
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "lef6u6wv");
      const requestConfig = {
        url: `https://api.cloudinary.com/v1_1/ddrleopwg/image/upload`,
        method: "POST",
        body: formData,
      };
      const response = await fetch(requestConfig.url, requestConfig);
      const data = await response.json();
      if (data.secure_url === undefined) {
        toast({
          title: "Failed to Add Hospital.",
          description: "Image is required.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      const hospital = {
        name: fullNames,
        phone: phone,
        address: address,
        email: email,
        lat: latitude,
        long: Longitude,
        image: data.secure_url,
        password: password,
        city: city,
      };

      const res = await fetch(
        "http://localhost:3000/api/admin/registerHospital",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(hospital),
        }
      );

      const result = await res.json();
      console.log(result);
      toast({
        title: "Hospital Added.",
        description: "Hospital has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      getSpecialityData();
    } catch (err) {
      console.log(err);
      toast({
        title: "Failed to Add Hospital.",
        description: "Failed to add hospital.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const onSearchHandler = (text) => {
    if (text.length === 0) {
      setDoctor((doctor) => !doctor);
    } else {
      const newData = specialityData.filter((hospital) => {
        return hospital.name.toLowerCase().includes(text.toLowerCase());
      });
      setTemp(newData);
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            justifyContent={"center"}
            my={5}
            borderBottom={"1px solid "}
            borderColor={"gray.200"}
          >
            <Text fontSize={"25px"} textTransform={"uppercase"}>
              Add Hospital
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} display={"flex"} flexDirection={"column"} gap={5}>
            <HStack justifyContent={"center"}>
              <Flex
                height={"250px"}
                bg={"gray"}
                w={"full"}
                rounded={"md"}
                justifyContent={"end"}
                alignItems={"end"}
                bgImage={background ? `url(${background})` : ""}
                bgPos={"center"}
                bgSize={"cover"}
              >
                <Flex
                  position={"relative"}
                  width={"full"}
                  height={"full"}
                  bg={"rgba(0,0,0,0.2)"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  transition={"all 0.3s ease-in-out"}
                  opacity={"0"}
                  _hover={{
                    opacity: "1",
                    bg: background
                      ? "rgba(255,255, 255, 0.2)"
                      : "rgba(0,0,0,0.2)",
                    transition: "all 0.3s ease-in-out",
                  }}
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
                    required
                  />
                </Flex>
              </Flex>
            </HStack>
            <HStack>
              <FormControl isRequired>
                <FormLabel>Hospital Name</FormLabel>
                <Input
                  onChange={(e) => {
                    setFullNames(e.target.value);
                  }}
                  placeholder="Enter full name"
                  required
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  placeholder="Enter your number"
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                  required
                />
              </FormControl>
            </HStack>
            <HStack>
              <FormControl isRequired>
                <FormLabel> Email </FormLabel>
                <Input
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="Enter Email"
                  required
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Address</FormLabel>
                <Input
                  placeholder="Enter Address"
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                  required
                />
              </FormControl>
            </HStack>
            <HStack>
              <FormControl isRequired>
                <FormLabel> City </FormLabel>
                <Input
                  onChange={(e) => {
                    setCity(e.target.value);
                  }}
                  placeholder="Enter City"
                  required
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel> Password </FormLabel>
                <Input
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  placeholder="Enter Password"
                  required
                />
              </FormControl>
            </HStack>
          </ModalBody>

          <ModalFooter
            borderTop={"1px solid"}
            borderColor={"gray.200"}
            display={"flex"}
            justifyContent={"end"}
          >
            <Button
              bg={"red.400"}
              color={"white"}
              onClick={onClose}
              _hover={{
                bg: "red.500",
              }}
              mr={3}
            >
              Cancel
            </Button>
            <Button
              bg={"green.600"}
              color={"white"}
              _hover={{
                bg: "green.500",
              }}
              colorScheme="blue"
              onClick={() => {
                addHospital();
                onClose();
              }}
            >
              Add Hospital
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isEditOpen} onClose={onEditClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            justifyContent={"center"}
            my={5}
            borderBottom={"1px solid "}
            borderColor={"gray.200"}
          >
            <Text fontSize={"25px"} textTransform={"uppercase"}>
              Edit Doctor
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} display={"flex"} flexDirection={"column"} gap={5}>
            <HStack justifyContent={"center"}>
              <Flex
                height={"250px"}
                bg={"gray"}
                w={"full"}
                rounded={"md"}
                justifyContent={"end"}
                alignItems={"end"}
                bgImage={background ? `url(${background})` : EditData.image}
                bgPos={"center"}
                bgSize={"cover"}
              >
                <Flex
                  position={"relative"}
                  width={"full"}
                  height={"full"}
                  bg={"rgba(0,0,0,0.2)"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  transition={"all 0.3s ease-in-out"}
                  opacity={"0"}
                  _hover={{
                    opacity: "1",
                    bg: background
                      ? "rgba(255,255, 255, 0.2)"
                      : "rgba(0,0,0,0.2)",
                    transition: "all 0.3s ease-in-out",
                  }}
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
                    required
                  />
                </Flex>
              </Flex>
            </HStack>
            <HStack>
              <FormControl isRequired>
                <FormLabel>Hospital Name</FormLabel>
                <Input
                  onChange={(e) => {
                    setEditData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  }}
                  placeholder="Enter full name"
                  required
                  value={EditData.name}
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  placeholder="Enter your number"
                  onChange={(e) => {
                    setEditData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }));
                  }}
                  required
                  value={EditData.phone}
                />
              </FormControl>
            </HStack>
            <HStack>
              <FormControl isRequired>
                <FormLabel> Email </FormLabel>
                <Input
                  onChange={(e) => {
                    setEditData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));
                  }}
                  placeholder="Enter Email"
                  required
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Address</FormLabel>
                <Input
                  placeholder="Enter Address"
                  onChange={(e) => {
                    setEditData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }));
                  }}
                  required
                />
              </FormControl>
            </HStack>
            <HStack>
              <FormControl isRequired>
                <FormLabel> Latitude </FormLabel>
                <Input
                  onChange={(e) => {
                    setEditData((prev) => ({
                      ...prev,
                      latitude: e.target.value,
                    }));
                  }}
                  placeholder="Enter Location Latitude"
                  required
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Longitude</FormLabel>
                <Input
                  placeholder="Enter  Location Longitude"
                  onChange={(e) => {
                    setEditData((prev) => ({
                      ...prev,
                      longitude: e.target.value,
                    }));
                  }}
                  required
                />
              </FormControl>
            </HStack>
            <HStack>
              <FormControl isRequired>
                <FormLabel> City </FormLabel>
                <Input
                  onChange={(e) => {
                    setCity(e.target.value);
                  }}
                  placeholder="Enter City"
                  required
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel> Password </FormLabel>
                <Input
                  onChange={(e) => {
                    setEditData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }));
                  }}
                  placeholder="Enter Password"
                  required
                />
              </FormControl>
            </HStack>
          </ModalBody>

          <ModalFooter
            borderTop={"1px solid"}
            borderColor={"gray.200"}
            display={"flex"}
            justifyContent={"end"}
          >
            <Button
              bg={"red.400"}
              color={"white"}
              onClick={onClose}
              _hover={{
                bg: "red.500",
              }}
              mr={3}
            >
              Cancel
            </Button>
            <Button
              bg={"green.600"}
              color={"white"}
              _hover={{
                bg: "green.500",
              }}
              colorScheme="blue"
              onClick={() => {
                editDoctor(doctorData._id);
                onEditClose();
              }}
            >
              Save Doctor
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex
        w="full"
        bg="#edf3f8"
        _dark={{
          bg: "#3e3e3e",
        }}
        alignItems="center"
        justifyContent="center"
        direction={"column"}
      >
        <Flex my={50} w={"full"} justifyContent={"space-between"} gap={5}>
          <Flex w={"full"} gap={2}>
            <Flex w={"700px"}>
              <InputGroup bg={"white"} rounded={"md"}>
                <InputLeftElement
                  pointerEvents="none"
                  children={<SearchIcon />}
                />
                <Input
                  type="text"
                  placeholder="Search"
                  focusBorderColor="#8c81ea"
                  onChange={(e) => onSearchHandler(e.target.value)}
                />
              </InputGroup>
            </Flex>
          </Flex>
          <Button
            bg={"#8c81ea"}
            color={"white"}
            _hover={{
              bg: "purple.600",
            }}
            onClick={onOpen}
          >
            Add Hospital
          </Button>
        </Flex>
        <Stack
          direction={{
            base: "column",
          }}
          w="full"
          bg={{
            md: bg,
          }}
          shadow="lg"
        >
          <SimpleGrid
            spacingY={3}
            columns={{
              base: 1,
              md: 5,
            }}
            w={{
              base: 120,
              md: "full",
            }}
            textTransform="uppercase"
            bg={bg3}
            py={{
              base: 1,
              md: 5,
            }}
            px={{
              base: 2,
              md: 10,
            }}
            fontSize="md"
            fontWeight="bold"
          >
            <span>Hospital Name</span>
            <span>Address</span>
            <span>Phone Number</span>
            <span>Email</span>

            <chakra.span
              textAlign={{
                md: "right",
              }}
            >
              Actions
            </chakra.span>
          </SimpleGrid>
          {temp !== null ? (
            temp.map((token, tid) => {
              console.log(token);
              return (
                <Flex
                  direction={{
                    base: "row",
                    md: "column",
                  }}
                  bg={bg2}
                  key={tid}
                >
                  <SimpleGrid
                    spacingY={3}
                    columns={{
                      base: 1,
                      md: 5,
                    }}
                    w="full"
                    py={2}
                    px={10}
                    borderBottomWidth="1px"
                  >
                    <span>{token.name}</span>
                    <span>{token.city}</span>
                    <span>{token.phone}</span>
                    <chakra.span
                      textOverflow="ellipsis"
                      overflow="hidden"
                      whiteSpace="nowrap"
                    >
                      {token.email}
                    </chakra.span>

                    <Flex
                      justify={{
                        md: "end",
                      }}
                    >
                      <ButtonGroup variant="solid" size="sm" spacing={3}>
                        <IconButton
                          colorScheme="red"
                          variant="outline"
                          icon={<BsFillTrashFill />}
                          aria-label="Delete"
                          onClick={() => {
                            deleteHospital(token._id);
                          }}
                        />
                      </ButtonGroup>
                    </Flex>
                  </SimpleGrid>
                </Flex>
              );
            })
          ) : (
            <> No Hospital Data</>
          )}
        </Stack>
      </Flex>
    </>
  );
};

export default AddManager;
