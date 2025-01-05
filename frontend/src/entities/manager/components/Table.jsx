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

const TableDoctor = () => {
  const toast = useToast();
  const id = localStorage.getItem("manager");
  console.log(id);
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
  const [nmc, setNmc] = useState("");
  const [experience, setExperience] = useState("");
  const [special, setSpeciality] = useState("");
  const [qualification, setQualification] = useState("");
  const [specialityData, setSpecialityData] = useState([]);
  const [temp, setTemp] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [specailityHospital, setSpecialityHospital] = useState([]);
  const [fees, setFees] = useState("");
  const [background, setBackground] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const getSpecialityData = async () => {
      await fetch(`http://localhost:3000/api/manager/getDoctors/${id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setSpecialityData(data.doctors);
          setTemp(data.doctors);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getSpecialityData();
  }, [doctor]);

  useEffect(() => {
    const getSpecialityData = async () => {
      await fetch(
        `http://localhost:3000/api/manager/getHospitalSpeciality/${id}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setSpecialityHospital(data.speciality);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getSpecialityData();
  }, []);

  const onChangeHandler = (text) => {
    setSearch(text);
    if (text === "") {
      setDoctor((doctor) => !doctor);
    }
    setSpecialityData(
      temp.filter((speciality) =>
        speciality.speciality.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const getDoctorData = async (doctorId) => {
    console.log(doctorId);
    try {
      const doctor = await fetch(
        `http://localhost:3000/api/manager/getDoctor/${doctorId}`
      );
      const doctorData = await doctor.json();
      setDoctorData(doctorData.doctor);
    } catch (err) {
      console.log(err);
    }
  };

  const uploadImage = async (requestConfig, formdata) => {
    const response = await fetch(requestConfig.url, requestConfig);
    const data = await response.json();
    return data.secure_url;
  };

  const editDoctor = async (doctorId) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "lef6u6wv");
    const requestConfig = {
      url: `https://api.cloudinary.com/v1_1/ddrleopwg/image/upload`,
      method: "POST",
      body: formData,
    };
    const data = await uploadImage(requestConfig, formData);
    const doctor = {
      hospital: id,
      name: doctorData.name,
      phone: doctorData.phone,
      nmc: doctorData.nmc,
      experience: `${doctorData.experience.split(" ")[0]} years`,
      speciality: doctorData.speciality,
      qualification: doctorData.qualification,
      fees: doctorData.fees,
      image: data,
    };

    try {
      await fetch(
        `http://localhost:3000/api/manager/updateDoctor/${doctorId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(doctor),
        }
      );
      toast({
        title: "Doctor Updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setDoctor((doctor) => !doctor);
    } catch (err) {
      console.log(err);
      toast({
        title: "Doctor Not Updated",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteDoctor = async (doctorId) => {
    try {
      await fetch(
        `http://localhost:3000/api/manager/deleteDoctor/${doctorId}`,
        {
          method: "DELETE",
        }
      );
      toast({
        title: "Doctor Deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setDoctor((doctor) => !doctor);
    } catch (err) {
      console.log(err);
      toast({
        title: "Failed to Delete Doctor",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const addDoctor = async () => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "lef6u6wv");
    const requestConfig = {
      url: `https://api.cloudinary.com/v1_1/ddrleopwg/image/upload`,
      method: "POST",
      body: formData,
    };
    const data = await uploadImage(requestConfig, formData);
    const doctor = {
      hospital: id,
      name: `Dr. ${fullNames}`,
      phone: phone,
      nmc: nmc,
      experience: `${experience} years`,
      speciality: special,
      qualification: qualification,
      image: data,
      fees: fees,
      available: [
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
      ],
    };
    await fetch("http://localhost:3000/api/manager/createDoctor/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(doctor),
    })
      .then((res) => res.json())
      .then((data) => {
        onClose();
        setDoctor((doctor) => !doctor);
        toast({
          title: "Doctor Added.",
          description: "Doctor has been added successfully.",
          status: "success",
        });
      })
      .catch((err) => console.log(err));
  };

  const onSearchHandler = (text) => {
    if (text.length === 0) {
      setDoctor((doctor) => !doctor);
    } else {
      const newData = specialityData.filter((hospital) => {
        return hospital.name.toLowerCase().includes(text.toLowerCase());
      });
      setSpecialityData(newData);
    }
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={"xl"}
        onCloseComplete={() => {
          setBackground("");
          setImage("");
        }}
      >
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
              Add Doctor
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} display={"flex"} flexDirection={"column"} gap={5}>
            <HStack w={"full"} justifyContent={"center"}>
              <Flex
                w={"120px"}
                height={"120px"}
                bg={"gray"}
                rounded={"full"}
                justifyContent={"end"}
                alignItems={"end"}
                bgPos={"center"}
                bgSize={"cover"}
                bgImage={background ? `url(${background})` : ``}
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
                  />
                </Flex>
              </Flex>
            </HStack>

            <HStack>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  onChange={(e) => {
                    setFullNames(e.target.value);
                  }}
                  placeholder="Enter full name"
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  placeholder="Enter your number"
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
              </FormControl>
            </HStack>
            <HStack>
              <FormControl isRequired>
                <FormLabel> NMC Number</FormLabel>
                <Input
                  onChange={(e) => {
                    setNmc(e.target.value);
                  }}
                  placeholder="Enter your NMC no"
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Experience Year</FormLabel>
                <Input
                  placeholder="Enter your experienced year"
                  onChange={(e) => {
                    setExperience(e.target.value);
                  }}
                />
              </FormControl>
            </HStack>
            <HStack>
              <FormControl isRequired>
                <FormLabel>Speciality</FormLabel>
                <Select
                  placeholder="Select option"
                  bg={"white"}
                  onChange={(e) => {
                    setSpeciality(e.target.value);
                  }}
                >
                  {specailityHospital.map((item) => {
                    console.log(item);
                    return (
                      <option key={item._id} value={item.name}>
                        {item.name}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Qualification</FormLabel>
                <Input
                  placeholder="Enter your qualification"
                  onChange={(e) => {
                    setQualification(e.target.value);
                  }}
                />
              </FormControl>
            </HStack>
            <HStack>
              <FormControl mt={4} isRequired>
                <FormLabel>Fees</FormLabel>
                <Input
                  placeholder="Enter Fees"
                  onChange={(e) => {
                    setFees(e.target.value);
                  }}
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
                addDoctor();
                onClose();
              }}
            >
              Add Doctor
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
            <HStack w={"full"} justifyContent={"center"}>
              <Flex
                w={"120px"}
                height={"120px"}
                bg={"gray"}
                rounded={"full"}
                justifyContent={"end"}
                alignItems={"end"}
                bgPos={"center"}
                bgSize={"cover"}
                bgImage={
                  background
                    ? `url(${background})`
                    : `url(${doctorData?.image})`
                }
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
                  />
                </Flex>
              </Flex>
            </HStack>
            <HStack>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  onChange={(e) => {
                    setDoctorData(() => {
                      return {
                        ...doctorData,
                        name: e.target.value,
                      };
                    });
                  }}
                  placeholder="Enter full name"
                  value={doctorData?.name}
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  placeholder="Enter your number"
                  onChange={(e) => {
                    setDoctorData(() => {
                      return {
                        ...doctorData,
                        phone: e.target.value,
                      };
                    });
                  }}
                  value={doctorData?.phone}
                />
              </FormControl>
            </HStack>
            <HStack>
              <FormControl isRequired>
                <FormLabel> NMC Number</FormLabel>
                <Input
                  onChange={(e) => {
                    setDoctorData(() => {
                      return {
                        ...doctorData,
                        NMC: e.target.value,
                      };
                    });
                  }}
                  placeholder="Enter your NMC no"
                  value={doctorData?.NMC}
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Experience Year</FormLabel>
                <Input
                  placeholder="Enter your experienced year"
                  onChange={(e) => {
                    setDoctorData(() => {
                      return {
                        ...doctorData,
                        experience: e.target.value,
                      };
                    });
                  }}
                  value={doctorData?.experience.split(" ")[0]}
                />
              </FormControl>
            </HStack>
            <HStack>
              <FormControl isRequired>
                <FormLabel>Speciality</FormLabel>
                <Select
                  placeholder="Select option"
                  bg={"white"}
                  onChange={(e) => {
                    setDoctorData(() => {
                      return {
                        ...doctorData,
                        speciality: e.target.value,
                      };
                    });
                  }}
                  value={doctorData?.speciality}
                >
                  {specailityHospital.map((item) => {
                    return (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Qualification</FormLabel>
                <Input
                  placeholder="Enter your qualification"
                  onChange={(e) => {
                    setDoctorData(() => {
                      return {
                        ...doctorData,
                        qualification: e.target.value,
                      };
                    });
                  }}
                  value={doctorData?.qualification}
                />
              </FormControl>
            </HStack>
            <HStack>
              <FormControl mt={4} isRequired>
                <FormLabel>Fees</FormLabel>
                <Input
                  placeholder="Enter your qualification"
                  onChange={(e) => {
                    setDoctorData(() => {
                      return {
                        ...doctorData,
                        fees: e.target.value,
                      };
                    });
                  }}
                  value={doctorData?.fees}
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
              onClick={onEditClose}
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
            <Flex w={"250px"}>
              <Select
                placeholder="Select option"
                bg={"white"}
                onChange={(e) => {
                  onChangeHandler(e.currentTarget.value);
                }}
              >
                {specailityHospital.map((item) => {
                  return (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  );
                })}
              </Select>
            </Flex>
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
            Add Doctor
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
              md: 4,
            }}
            w={{
              base: 120,
              md: "full",
            }}
            textTransform="uppercase"
            bg={bg3}
            py={{
              base: 1,
              md: 4,
            }}
            px={{
              base: 2,
              md: 10,
            }}
            fontSize="md"
            fontWeight="bold"
          >
            <span>Name</span>
            <span>Speciality</span>
            <span>Experience</span>

            <chakra.span
              textAlign={{
                md: "right",
              }}
            >
              Actions
            </chakra.span>
          </SimpleGrid>
          {specialityData !== null ? (
            specialityData.map((token, tid) => {
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
                      md: 4,
                    }}
                    w="full"
                    py={2}
                    px={10}
                    borderBottomWidth="1px"
                  >
                    <span>{token.name}</span>
                    <span>{token.speciality}</span>
                    <chakra.span
                      textOverflow="ellipsis"
                      overflow="hidden"
                      whiteSpace="nowrap"
                    >
                      {token.experience}
                    </chakra.span>

                    <Flex
                      justify={{
                        md: "end",
                      }}
                    >
                      <ButtonGroup variant="solid" size="sm" spacing={3}>
                        <IconButton
                          colorScheme="green"
                          icon={<AiFillEdit />}
                          aria-label="Edit"
                          onClick={() => {
                            getDoctorData(token._id);
                            onEditOpen();
                          }}
                        />
                        <IconButton
                          colorScheme="red"
                          variant="outline"
                          icon={<BsFillTrashFill />}
                          aria-label="Delete"
                          onClick={() => {
                            deleteDoctor(token._id);
                          }}
                        />
                      </ButtonGroup>
                    </Flex>
                  </SimpleGrid>
                </Flex>
              );
            })
          ) : (
            <> No Doctor Data</>
          )}
        </Stack>
      </Flex>
    </>
  );
};

export default TableDoctor;
