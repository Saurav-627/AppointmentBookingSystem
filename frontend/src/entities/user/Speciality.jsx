import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Flex, InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import SpecialityCard from "./components/SpecialityCard";
import { SearchIcon } from "@chakra-ui/icons";
import HospitalDetails from "./components/HospitalDetails";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const Speciality = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [special, setSpecial] = React.useState([]);
  const [search, setSearch] = React.useState(false);

  useEffect(() => {
    const getSpeciality = async () => {
      const response = await fetch(
        `http://localhost:3000/api/manager/getSpeciality/${id}`
      )
        .then((res) => res.json())
        .then((data) => {
          setSpecial(data.speciality);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getSpeciality();
  }, [search]);

  const searchHandler = (e) => {
    const search = e.target.value;
    if (search.length === 0) {
      setSearch((search) => !search);
    } else {
      const filtered = special.filter((special) => {
        return special.name.toLowerCase().includes(search.toLowerCase());
      });
      setSpecial(filtered);
    }
  };

  console.log(state);

  return (
    <Flex justifyContent={"space-between"} mb={20}>
      <Flex
        w={"25%"}
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        height={"full"}
      >
        <HospitalDetails details={state} />
        <Flex w={"100%"} justifyContent={"center"} mt={10}></Flex>
      </Flex>
      <Flex w={"65%"} direction={"column"} alignItems={"start"}>
        {/* <h1>Speciality</h1>
        <h2>{id}</h2> */}
        <Flex my={50} w={"790px"} justifyContent={"start"}>
          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
            <Input
              type="text"
              placeholder="Search"
              focusBorderColor="#8c81ea"
              onChange={(e) => searchHandler(e)}
            />
          </InputGroup>
        </Flex>
        <Flex wrap={"wrap"} w={"80%"} justifyContent={"start"} gap={16}>
          {special.length === 0 && (
            <Flex
              fontWeight={"600"}
              fontSize={"18px"}
              height={"400px"}
              justifyContent={"center"}
              alignItems={"center"}
              color={"gray.400"}
              w={"full"}
            >
              {" "}
              No Speciality Found{" "}
            </Flex>
          )}
          {special.map((special) => (
            <SpecialityCard
              key={special.id}
              name={special.name}
              doctors={10}
              hospital={id}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Speciality;
