import {
  Avatar,
  Button,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
  IconButton,
  Thead,
  Table,
  Tr,
  Th,
  Tbody,
  Td,
  useToast,
  Box,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StarIcon } from "@chakra-ui/icons";

import KhaltiCheckout from "khalti-checkout-web";

const Specialist = () => {
  const state = useLocation();
  const [specialist, setSpecialist] = useState([]);
  const navigate = useNavigate();
  const [isPaid, setIsPaid] = useState(false);
  const [doctor, setDoctor] = useState({
    name: "",
    speciality: "",
    hospital: "",
    experience: "",
    rating: "",
    fees: "",
  });
  const [appointment, setAppointment] = useState({
    phone: "",
    doctor_id: "",
    doctor_name: "",
    price: "",
    alloted: "",
    hospital: "",
  });

  let data = {};
  const phone = localStorage.getItem("phone");
  const toast = useToast();

  const saveHistory = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/user/addHistory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const res = await response.json();
      if (res.message === "History Created") {
        toast({
          title: "Appointment Booked",
          description:
            "Your appointment has been booked. Please check your profile for more details",
          status: "success",
          duration: 3000,
        });
      } else {
        toast({
          title: "Appointment Already Booked",
          description: "Your need to cancel before booking again",
          status: "error",
          duration: 3000,
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Appointment Booked Failed",
        description: "Something went wrong. Please try again later",
        status: "error",
        duration: 3000,
      });
    }
  };

  let config = {
    // replace this key with yours
    publicKey: "test_public_key_61510e6c87904f95b1fe226b5b0612ca",
    productIdentity: "1234567890",
    productName: "Drogon",
    productUrl: "http://gameofthrones.com/buy/Dragons",
    eventHandler: {
      onSuccess(payload) {
        console.log("dalidhl", payload);
        
        // hit merchant api for initiating verfication
        setIsPaid(true);
        saveHistory();
      },
      // onError handler is optional
      onError(error) {
        // handle errors
        console.log(error);
      },
      onClose() {
        console.log("widget is closing");
      },
    },
    paymentPreference: [
      "KHALTI",
      "EBANKING",
      "MOBILE_BANKING",
      "CONNECT_IPS",
      "SCT",
    ],
  };

  let checkout = new KhaltiCheckout(config);
  async function PayWithKhalti(fees) {
    // minimum transaction amount must be 10, i.e 1000 in paisa.
    try {
      const token = Math.floor(10 + Math.random() * 9000);
      data = {
        ...data,
        token,
      };
      await checkout.show({ amount: parseInt(fees) * 100 });
    } catch (err) {
      console.log(err);
    }
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const getSpecialist = async () => {
      const response = await fetch(
        `http://localhost:3000/api/manager/getSpecialityDoctors`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hospital: state.state.hospital,
            specialist: state.state.specialist,
          }),
        }        
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setSpecialist(data.doctors);
        });
        console.log(response,"diuashdiua");
    };
    getSpecialist();
  }, []);

  const cancelAppointment = async (doctor_id, phone, status) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/user/updateHistory`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctor_id,
            phone,
            status,
          }),
        }
      );
      const data = await response.json();
      if (data.message === "History Updated") {
        toast({
          title: "Appointement has been cancelled",
          description:
            "Your appointment has been cancelled. Please check your profile for more details",
          status: "success",
          duration: 3000,
        });
      } else {
        toast({
          title: "Appointment already Cancelled",
          description:
            "Your appointment is already cancelled. Please check your profile for more details",
          status: "error",
          duration: 3000,
        });
      }
    } catch (err) {
      toast({
        title: "Server Error",
        description: "Some error with server",
        status: "error",
        duration: 3000,
      });
    }
  };

  const checkSeats = async (fees) => {
    const response = await fetch(
      `http://localhost:3000/api/user/checkStatus/${doctor}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (data.message === "Seats Available") {
      toast({
        title: "Seats Available",
        description: "You can book your appointment",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      PayWithKhalti(fees);
    } else {
      toast({
        title: "Seats Not Available",
        description: "You cannot book your appointment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const [review, setReview] = useState({
    rating: "",
    review: "",
    setEdit: false,
  });

  const [allRating, setRating] = useState({
    ratings: [],
    average: 0,
  });

  const fetchAllReview = async () => {
    const response = await fetch(
      `http://localhost:3000/api/user/getRating/${doctor._id}`
    );
    const data = await response.json();

    if (data.message === "Success") {
      setRating({
        ratings: data.data,
        average: data.averageRating,
      });
    }
  };

  useEffect(() => {
    if (doctor._id) {
      fetchAllReview();
    }
  }, [doctor._id]);

  const checkReview = async () => {
    const response = await fetch(`http://localhost:3000/api/user/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doctor_id: doctor._id,
        phone: phone,
      }),
    });

    const data = await response.json();

    setReview({
      rating: data.rating.rating,
      review: data.rating.review,
      setEdit: true,
    });
  };

  useEffect(() => {
    if (doctor) {
      checkReview();
    }
  }, [doctor]);

  const handleStarClick = (starIndex) => {
    setReview((prev) => ({ ...prev, rating: starIndex }));
  };

  const editReview = async () => {
    const response = await fetch("http://localhost:3000/api/user/editRating", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doctor_id: doctor._id,
        rating: review.rating,
        phone: phone,
        review: review.review,
      }),
    });
    const data = await response.json();
    if (data.message === "Rating Updated") {
      toast({
        title: "Review Update",
        description: "Your review has been updated",
        status: "success",
        duration: 3000,
      });
      fetchAllReview();
    } else {
      toast({
        title: "Failed to update review",
        description: "Your review has been updated",
        status: "error",
        duration: 3000,
      });
    }
  };

  const addReview = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/user/addRating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          doctor_id: doctor._id,
          rating: review.rating,
          phone: phone,
          review: review.review,
        }),
      });
      const data = await response.json();
      if (data.message === "Rating Added") {
        toast({
          title: "Review Added",
          description: "Your review has been added",
          status: "success",
          duration: 3000,
        });
        fetchAllReview();
        setReview((prev) => ({ ...prev, setEdit: true }));
      } else {
        console.log(data);
        toast({
          title: "Failed to add review",
          description: "You have already added review",
          status: "error",
          duration: 3000,
        });
      }
    } catch (err) {
      toast({
        title: "Server Error",
        description: "Some error with server",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Flex
      direction={"column"}
      w={"full"}
      alignItems={"center"}
      gap={20}
      my={20}
    >
      {specialist.length === 0 && (
        <Flex
          height={"400px"}
          justifyContent={"center"}
          alignItems={"center"}
          fontWeight={"600"}
          color={"gray.400"}
          fontSize={"18px"}
        >
          No Specialist Found
        </Flex>
      )}
      {specialist.map((item) => (
        <Flex
          w={"70%"}
          justifyContent={"space-between"}
          boxShadow={"lg"}
          px={10}
          py={5}
        >
          <Modal
            blockScrollOnMount={false}
            isOpen={isOpen}
            onClose={onClose}
            size={"4xl"}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <ModalBody>
                <Flex
                  alignItems={"center"}
                  gap={10}
                  px={"8"}
                  justifyContent={"space-between"}
                  height={"200px"}
                  mb={"16"}
                >
                  <Flex
                    gap={10}
                    w={"full"}
                    alignItems={"center"}
                    borderRight={"1px solid"}
                    borderColor={"gray.200"}
                    pr={"50px"}
                  >
                    <Avatar
                      size={"2xl"}
                      src={
                        doctor.image
                          ? doctor.image
                          : "https://bit.ly/broken-link"
                      }
                    />
                    <Flex direction={"column"}>
                      <Text fontSize={"lg"} fontWeight={"500"}>
                        {doctor.name}
                      </Text>
                      <Text
                        fontSize={"md"}
                        fontWeight={"400"}
                        color={"gray.600"}
                      >
                        {doctor.speciality}
                      </Text>
                      <Text
                        fontSize={"md"}
                        fontWeight={"400"}
                        color={"gray.600"}
                      >
                        Experience: {doctor.experience}
                      </Text>
                      <Text
                        fontSize={"md"}
                        fontWeight={"400"}
                        color={"gray.600"}
                      >
                        Qualification: {doctor.qualification}
                      </Text>
                      <Flex></Flex>
                      <Button
                        variant={"outline"}
                        border={"2px solid purple"}
                        color={"purple"}
                        borderRadius={"none"}
                        _hover={{
                          bg: "purple.500",
                          color: "white",
                        }}
                        colorScheme={"purple.400"}
                        fontSize={"14px"}
                        h={"30px"}
                        mt={"3"}
                        disabled={true}
                      >
                        Fees : Rs {doctor.fees}
                      </Button>
                    </Flex>
                  </Flex>
                  <Flex
                    w={"full"}
                    direction={"column"}
                    alignItems={"center"}
                    gap={10}
                  >
                    <Box
                      display="flex"
                      mt="2"
                      w={"full"}
                      h={"150px"}
                      flexDirection={"column"}
                      justifyContent={"space-between"}
                      gap={5}
                      as="form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (review.setEdit) {
                          editReview();
                        } else {
                          addReview();
                        }
                      }}
                    >
                      <Flex>Average Rating: {allRating.average + 1}/5</Flex>
                      <Flex gap="2">
                        {Array(5)
                          .fill("")
                          .map((_, i) => (
                            <StarIcon
                              key={i}
                              height={"22px"}
                              width={"22px"}
                              color={i <= review.rating ? "gold" : "gray.300"}
                              onClick={() => handleStarClick(i)}
                              _hover={{ cursor: "pointer" }}
                            />
                          ))}
                      </Flex>
                      <Flex direction={"column"} gap={5}>
                        <Textarea
                          value={review.review}
                          onChange={(e) => {
                            setReview((prev) => ({
                              ...prev,
                              review: e.target.value,
                            }));
                          }}
                        ></Textarea>
                        <Button bg={"purple.500"} color={"white"} type="submit">
                          Save Review
                        </Button>
                      </Flex>
                    </Box>
                  </Flex>
                </Flex>
                <Flex
                  w={"full"}
                  justifyContent={"end"}
                  direction={"column"}
                  gap={6}
                  height={"200px"}
                  alignItems={"center"}
                >
                  <Flex
                    w={"full"}
                    direction={"column"}
                    gap={6}
                    maxHeight={"200px"}
                    alignItems={"center"}
                    overflowY={"scroll"}
                    sx={{
                      "&::-webkit-scrollbar": { display: "none" },
                    }}
                  >
                    {allRating &&
                      allRating.ratings.map((item) => {
                        return (
                          <>
                            <Flex
                              w={"full"}
                              direction={"column"}
                              justifyContent={"center"}
                              gap={5}
                              p={"5"}
                              borderBottom={"1px solid"}
                              borderColor={"gray.200"}
                            >
                              <Flex alignItems={"center"} gap={3}>
                                <Avatar size={"md"} /> <Text> Anonymous </Text>
                              </Flex>
                              <Flex gap="2">
                                {Array(5)
                                  .fill("")
                                  .map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      height={"22px"}
                                      width={"22px"}
                                      color={
                                        i <= item.rating ? "gold" : "gray.300"
                                      }
                                      onClick={() => handleStarClick(i)}
                                      _hover={{ cursor: "pointer" }}
                                    />
                                  ))}
                              </Flex>
                              <Text>Comment : {item.review}</Text>
                            </Flex>
                          </>
                        );
                      })}
                  </Flex>
                </Flex>
              </ModalBody>
            </ModalContent>
          </Modal>

          <Flex alignItems={"center"} gap={10}>
            <Avatar
              size={"2xl"}
              src={item.image ? item.image : "https://bit.ly/broken-link"}
              onClick={() => {
                console.log(item);
                setDoctor(item);
                onOpen();
              }}
            />
            <Flex direction={"column"} gap={2}>
              <Text fontSize={"lg"} fontWeight={"500"}>
                {item.name}
              </Text>
              <Text fontSize={"md"} fontWeight={"400"} color={"gray.600"}>
                {item.speciality}
              </Text>
              <Text fontSize={"md"} fontWeight={"400"} color={"gray.600"}>
                Experience: {item.experience}
              </Text>
              <Text fontSize={"md"} fontWeight={"400"} color={"gray.600"}>
                Qualification: {item.qualification}
              </Text>
              <Flex direction={"column"} gap={5}>
                <Button
                  variant={"outline"}
                  colorScheme={"purple.400"}
                  fontSize={"14px"}
                  h={"30px"}
                  mt={"3"}
                  onClick={() => {
                    setDoctor(item);
                    onOpen();
                  }}
                >
                  View Profile
                </Button>
              </Flex>
            </Flex>
          </Flex>
          <Flex direction={"column"} justifyContent={"center"} gap={2}>
            <Table>
              <Thead>
                <Tr>
                  <Th>Available Date</Th>
                  <Th>Available Time</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>

              <Tbody>
                {item.available.map((available) => {
                  return (
                    <Tr>
                      <Td>
                        <Button
                          w={"120px"}
                          bg={"gray.100"}
                          color={"black"}
                          disabled
                        >
                          {available.date}
                        </Button>
                      </Td>
                      <Td>
                        <Button
                          w={"120px"}
                          bg={"purple.400"}
                          color={"white"}
                          _hover={{
                            bg: "purple.500",
                          }}
                          onClick={() => {
                            const time = available.time.split("-");
                            if (time[0] === "00:00" && time[1] === "00:00") {
                              toast({
                                title: "Validate Date Unavailable",
                                status: "error",
                                duration: 3000,
                                isClosable: true,
                              });
                              return;
                            }
                            if (phone) {
                              data = {
                                phone: phone,
                                doctor_id: item._id,
                                price: item.fees,
                                doctor_name: item.name,
                                alloted: available.time,
                                hospital: item.hospital,
                              };

                              checkSeats(item.fees);
                            } else {
                              toast({
                                title: "Please Login to continue",
                                status: "error",
                                duration: 3000,
                                isClosable: true,
                              });
                              navigate("/login");
                            }
                          }}
                        >
                          {available.time}
                        </Button>
                      </Td>
                      <Td>
                        <Button
                          onClick={() => {
                            cancelAppointment(item._id, phone, "Cancelled");
                          }}
                          isDisabled={available.time === "00:00-00:00"}
                        >
                          Cancel Appointment
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};
export default Specialist;
