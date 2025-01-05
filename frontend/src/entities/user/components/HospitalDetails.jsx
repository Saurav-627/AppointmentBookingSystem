import React, { useEffect } from "react";

import { Box, chakra, Flex, Icon, Image } from "@chakra-ui/react";
import { BsFillBriefcaseFill } from "react-icons/bs";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
const HospitalDetails = (props) => {
  console.log(props);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyC7D1kQPyLU2FEE0kUARIfibjyuxzny21I",
  });

  return (
    <Flex
      py={50}
      pl={50}
      w="full"
      alignItems="center"
      justifyContent="center"
      mt={"87px"}
    >
      <Box
        w="sm"
        mx="auto"
        bg="white"
        _dark={{
          bg: "gray.800",
        }}
        shadow="lg"
        rounded="lg"
        overflow="hidden"
      >
        <Image
          w="full"
          h={56}
          fit="cover"
          objectPosition="center"
          src={props.details.image}
          alt="avatar"
        />

        <Box py={4} px={6}>
          <chakra.h1
            fontSize="xl"
            fontWeight="bold"
            color="gray.800"
            _dark={{
              color: "white",
            }}
          >
            {props.details.name}
          </chakra.h1>

          <Flex
            alignItems="center"
            mt={4}
            color="gray.700"
            _dark={{
              color: "gray.200",
            }}
          >
            <Icon as={BsFillBriefcaseFill} h={6} w={6} mr={2} />

            <chakra.h1 px={2} fontSize="sm">
              {props.details.address}
            </chakra.h1>
          </Flex>

          <Flex
            alignItems="center"
            mt={4}
            color="gray.700"
            _dark={{
              color: "gray.200",
            }}
          >
            <Icon h={6} w={6} mr={2} />

            <chakra.h1 px={2} fontSize="sm">
              {props.details.city}
            </chakra.h1>
          </Flex>
          <Flex alignItems={"center"} mt={4}>
            <Icon h={6} w={6} mr={2} />
            <chakra.h1 px={2} fontSize="sm">
              {props.details.phone}
            </chakra.h1>
          </Flex>
          <Flex
            alignItems="center"
            mt={4}
            color="gray.700"
            _dark={{
              color: "gray.200",
            }}
            flexDirection={"column"}
          >
            {isLoaded && (
              <GoogleMap
                mapContainerStyle={{
                  width: "320px",
                  height: "300px",
                }}
                center={{
                  lat: parseFloat(props.details.latitude),
                  lng: parseFloat(props.details.longitude),
                }}
                zoom={10}
              >
                <Marker
                  position={{
                    lat: parseFloat(props.details.latitude),
                    lng: parseFloat(props.details.longitude),
                  }}
                />
              </GoogleMap>
            )}
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};

export default HospitalDetails;
