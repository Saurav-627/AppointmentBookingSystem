import React, { useEffect, useRef } from "react";
import { useState } from "react";

import {
  Flex,
  IconButton,
  Stack,
  SimpleGrid,
  chakra,
  ButtonGroup,
  InputGroup,
  InputLeftElement,
  Input,
  useColorModeValue,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";

import { SearchIcon } from "@chakra-ui/icons";

const UserData = () => {
  const bg = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("white", "gray.800");
  const bg3 = useColorModeValue("gray.100", "gray.700");
  const [specialityData, setSpecialityData] = useState([]);
  const [specialityTemp, setSpecialityTemp] = useState([]);

  const fetchAllSpeciality = async () => {
    try {
      const data = await fetch("http://localhost:3000/api/admin/getUserInfo");
      const response = await data.json();
      console.log(response.data);
      setSpecialityData(response.data);
      setSpecialityTemp(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const select = useRef(null);
  const search = useRef(null);

  const searchHandler = (value) => {
    const searchValue = value.toLowerCase();

    const filtered = specialityData.filter((item) => {
      return item.name.toLowerCase().includes(searchValue);
    });
    setSpecialityTemp(filtered);
  };

  const selectHandler = (value) => {
    const searchValue = search.current.value;
    const selectValue = select.current.value;

    console.log(searchValue, selectValue);

    if (searchValue === "" && selectValue === "") {
      setSpecialityTemp(specialityData);
    } else {
      const temp = specialityData.filter((item) => {
        const phoneMatch = item.phone.includes(searchValue);
        const bloodMatch = item.blood.includes(selectValue);

        if (searchValue && selectValue) {
          return phoneMatch && bloodMatch;
        } else if (searchValue) {
          return phoneMatch;
        } else if (selectValue) {
          return bloodMatch;
        }
        return false;
      });
      console.log(temp);
      setSpecialityTemp(temp);
    }
  };

  useEffect(() => {
    fetchAllSpeciality();
  }, []);

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
            <Flex w={"250px"}>
              <Select
                placeholder="Select option"
                bg={"white"}
                ref={select}
                onChange={(event) => selectHandler(event.target.value)}
              >
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="O+">O+</option>
                <option value="A-">A-</option>
                <option value="B-">B-</option>
                <option value="AB-">AB-</option>
                <option value="O-">O-</option>
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
                  ref={search}
                  onChange={(e) => searchHandler(e.target.value)}
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
            <span> Username </span>
            <span> Blood Group </span>
            <span> Phone Number </span>
            <span> City </span>
          </SimpleGrid>
          {specialityTemp !== null ? (
            specialityTemp.map((token, tid) => {
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
                      md: 4,
                    }}
                    w="full"
                    py={2}
                    px={10}
                    borderBottomWidth="1px"
                  >
                    <span>{token.name}</span>
                    <span>{token.blood}</span>
                    <span>{token.phone}</span>
                    <chakra.span
                      textOverflow="ellipsis"
                      overflow="hidden"
                      whiteSpace="nowrap"
                    >
                      {token.city}
                    </chakra.span>
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

export default UserData;
