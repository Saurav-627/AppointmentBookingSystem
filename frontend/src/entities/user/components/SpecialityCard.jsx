import { Box, Center, Heading, Stack, Image, Flex } from "@chakra-ui/react";

import IMAGE from "../../../assets/speciality.jpeg";

import { useNavigate } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";

export default function SpecialityCard(props) {
  const navigate = useNavigate();

  console.log(props);

  return (
    <Center
      border={"1px solid"}
      borderColor={"gray.300"}
      p={"3"}
      rounded={"5px"}
    >
      <Box
        as={Flex}
        w={"full"}
        rounded={"lg"}
        pos={"relative"}
        flexDirection={"column"}
        transition={"all .5s ease"}
        _hover={{
          transform: "scale(1.02)",
          transition: "all .5s ease",
          boxShadow: "2xl",
        }}
        onClick={() =>
          navigate("/specialist", {
            state: {
              hospital: props.hospital,
              specialist: props.name,
            },
          })
        }
      >
        <Image
          rounded={"lg"}
          height={150}
          width={150}
          objectFit={"cover"}
          src={IMAGE}
        />
        <Stack pt={2} align={"center"}>
          <Heading fontSize={"lg"} fontFamily={"body"} fontWeight={500}>
            {props.name}
          </Heading>
        </Stack>
      </Box>
    </Center>
  );
}
