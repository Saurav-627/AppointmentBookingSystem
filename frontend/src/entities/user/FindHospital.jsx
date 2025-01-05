import {
  Flex,
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import HospitalCard from "./components/HospitalCard";
import { useEffect, useState } from "react";

// const hospitalData = [
//   {
//     id: 1,
//     name: "Apollo Hospital",
//     address: "Kolkata, West Bengal",
//     image:
//       "https://apollohospitals.com/wp-content/uploads/2019/10/Apollo-Hospital-Kolkata.jpg",
//   },
//   {
//     id: 2,
//     name: "Bir Hospital",
//     address: "Kantipath Kathmandu",
//   },
//   {
//     id: 3,
//     name: "North Bengal Hospital",
//     address: "Kolkata, West Bengal",
//   },
//   {
//     id: 4,
//     name: "Grande International Hospital",
//     address: "Tokha Kathmandu",
//   },
//   {
//     id: 5,
//     name: "Om Hospital",
//     address: "Chabahil Kathmandu",
//   },
//   {
//     id: 6,
//     name: "Om Hospital",
//     address: "Chabahil Kathmandu",
//   },
// ];

const FindHostpital = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/manager/getHospitals")
      .then((res) => res.json())
      .then((data) => {
        setData(data.hospitals);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [search]);

  const searchHandler = (e) => {
    const searchValue = e.target.value;

    if (searchValue.length === 0) {
      setSearch((search) => !search);
    } else {
      const newData = data.filter((hospital) => {
        return hospital.name.toLowerCase().includes(searchValue.toLowerCase());
      });
      setData(newData);
    }
  };
  return (
    <Flex px={"40px"} py={"50px"} alignItems={"center"} direction={"column"}>
      <Flex w={"50%"} boxShadow="md" rounded="md" bg="white">
        <InputGroup alignItems={"center"}>
          <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
          <Input
            type="text"
            placeholder="Find Hospital"
            focusBorderColor="#8c81ea"
            onChange={(e) => searchHandler(e)}
          />
        </InputGroup>
      </Flex>
      <Flex
        w={"full"}
        mt={"80px"}
        justifyContent={"center"}
        gap={"50"}
        wrap={"wrap"}
      >
        {data.map((hospital) => {
          return (
            <HospitalCard
              key={hospital.name}
              address={hospital.address}
              name={hospital.name}
              image={hospital.image}
              id={hospital._id}
              speciality={hospital.speciality}
              city={hospital.city}
              phone={hospital.phone}
              latitude={hospital.lat}
              longitude={hospital.long}
            />
          );
        })}
      </Flex>
    </Flex>
  );
};

export default FindHostpital;
