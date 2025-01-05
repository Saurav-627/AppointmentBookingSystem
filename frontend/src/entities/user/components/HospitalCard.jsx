import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
} from "@chakra-ui/react";

import { useNavigate, useLocation } from "react-router-dom";

export default function HospitalCard(props) {
  const navigate = useNavigate();
  console.log(props);

  return (
    <Center py={12}>
      <Box
        role={"group"}
        p={6}
        maxW={"330px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        transition={"all .5s ease"}
        zIndex={1}
        _hover={{
          transform: "scale(1.02)",
          transition: "all .5s ease",
          boxShadow: "2xl",
        }}
        onClick={() => navigate(`/hospital/${props.id}`, { state: props })}
      >
        <Box
          rounded={"lg"}
          mt={-12}
          pos={"relative"}
          height={"230px"}
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            pos: "absolute",
            top: 5,
            left: 0,
            backgroundImage: `url(${props.image})`,
            filter: "blur(20px)",
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)",
            },
          }}
        >
          <Image
            rounded={"lg"}
            height={230}
            width={282}
            objectFit={"cover"}
            src={props.image}
          />
        </Box>
        <Stack pt={10} align={"center"}>
          <Heading fontSize={"lg"} fontFamily={"body"} fontWeight={500}>
            {props.name}
          </Heading>
          <Text color={"gray.500"} fontSize={"sm"}>
            {props.address}
          </Text>
        </Stack>
      </Box>
    </Center>
  );
}
