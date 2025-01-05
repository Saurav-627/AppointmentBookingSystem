import React, { useEffect } from "react";
import { useState } from "react";

import {
  Flex,
  Stack,
  useColorModeValue,
  SimpleGrid,
  chakra,
  ButtonGroup,
  Badge,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  Button,
  useToast,
} from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { SearchIcon } from "@chakra-ui/icons";

const HistoryPage = () => {
  const id = localStorage.getItem("manager");
  const bg = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("white", "gray.800");
  const bg3 = useColorModeValue("gray.100", "gray.700");

  const [history, setHistory] = useState([]);
  const [temp, setTemp] = useState([]);
  const toast = useToast();
  const getHistory = async () => {
    await fetch(`http://localhost:3000/api/manager/getHistoryData/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.history);
        setTemp(data.history);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getHistory();
  }, []);

  const approveHistory = async (id) => {
    const data = { id: id, status: "Approved" };
    await fetch("http://localhost:3000/api/manager/updateHistoryData", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        toast({
          title: "Token Approved",
          description: "Token Approved Successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        getHistory();
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Token Not Approved",
          description: "Token Not Approved",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  const searchHistory = (search) => {
    if (search === "") {
      getHistory();
    } else {
      console.log(temp);
      const data = temp.filter((item) => {
        return item.token.includes(search);
      });
      console.log(data);
      setHistory(data);
    }
  };
  return (
    <>
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
                  onChange={(e) => searchHistory(e.target.value)}
                />
              </InputGroup>
            </Flex>
          </Flex>
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
              md: 7,
            }}
            w={{
              base: 120,
              md: "full",
            }}
            textTransform="uppercase"
            bg={bg3}
            py={{
              base: 1,
              md: 7,
            }}
            px={{
              base: 2,
              md: 10,
            }}
            fontSize="md"
            fontWeight="bold"
          >
            <span>Doctor Name</span>
            <span>Token Number</span>
            <span>Phone Number</span>
            <span>Amount Paid (Rs)</span>
            <span>Alloted</span>
            <span>Action</span>
          </SimpleGrid>
          {history.length === 0 && <Flex
          height={"400px"}
          justifyContent={"center"}
          alignItems={"center"}
          fontWeight={"600"}
          color={"gray.400"}
          fontSize={"18px"}
          >
          History has been cleared
          </Flex>}
          {history !== null ? (
            history.map((token, tid) => {
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
                      md: 7,
                    }}
                    w="full"
                    py={2}
                    px={5}
                    borderBottomWidth="1px"
                  >
                    <span>{token.doctor}</span>
                    <span>{token.token}</span>
                    <span>{token.phone}</span>
                    <span>{token.price}</span>
                    <span>{token.alloted}</span>

                    <span>
                      {" "}
                      <Button
                        bg={"green"}
                        color={"white"}
                        _hover={{
                          bg: "green.500",
                        }}
                        onClick={() => {
                          console.log(token._id);
                          approveHistory(token._id);
                        }}
                      >
                        Approval
                      </Button>
                    </span>
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

export default HistoryPage;
