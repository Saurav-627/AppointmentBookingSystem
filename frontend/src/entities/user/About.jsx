import {
  Container,
  SimpleGrid,
  Image,
  Flex,
  Heading,
  Text,
  Stack,
  StackDivider,
  Icon,
  useColorModeValue,
  Box,
  chakra,
  Avatar,
} from "@chakra-ui/react";
import {
  IoTimeOutline,
  IoCardOutline,
  IoSearchSharp,
  IoStarOutline,
  IoHelpOutline,
} from "react-icons/io5";
import AboutImage from "../../assets/about-bg.jpg";

const Feature = ({ text, icon, iconBg }) => {
  return (
    <Stack direction={"row"} align={"center"}>
      <Flex
        w={8}
        h={8}
        align={"center"}
        justify={"center"}
        rounded={"full"}
        bg={iconBg}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{text}</Text>
    </Stack>
  );
};
export default function SplitWithImage() {
  return (
    <Container maxW={"5xl"} py={12}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Stack spacing={4}>
          <Text
            textTransform={"uppercase"}
            color={"blue.400"}
            fontWeight={600}
            fontSize={"sm"}
            bg={useColorModeValue("blue.50", "blue.900")}
            p={2}
            alignSelf={"flex-start"}
            rounded={"md"}
          >
            Know About Us
          </Text>
          <Heading>Online Doctor Appointment Booking App</Heading>
          <Text color={"gray.500"} fontSize={"lg"}>
            Now in the tip of your fingers - Get an Appointment with your
            desired Medical Expert in the time feasible for you. Learn some
            features of Doctor Sahab.
          </Text>
          <Stack
            spacing={4}
            divider={
              <StackDivider
                borderColor={useColorModeValue("gray.100", "gray.700")}
              />
            }
          >
            <Feature
              icon={
                <Icon as={IoTimeOutline} color={"yellow.500"} w={5} h={5} />
              }
              iconBg={useColorModeValue("yellow.100", "yellow.900")}
              text={"Scheduling Appointments"}
            />
            <Feature
              icon={<Icon as={IoCardOutline} color={"green.500"} w={5} h={5} />}
              iconBg={useColorModeValue("green.100", "green.900")}
              text={"Online Payments"}
            />
            <Feature
              icon={
                <Icon as={IoSearchSharp} color={"purple.500"} w={5} h={5} />
              }
              iconBg={useColorModeValue("purple.100", "purple.900")}
              text={"Search Hospitals and Doctors"}
            />
            <Feature
              icon={
                <Icon as={IoStarOutline} color={"orange.500"} w={5} h={5} />
              }
              iconBg={useColorModeValue("orange.100", "orange.900")}
              text={"Review Doctors"}
            />
            <Feature
              icon={<Icon as={IoHelpOutline} color={"pink.500"} w={5} h={5} />}
              iconBg={useColorModeValue("pink.100", "pink.900")}
              text={"Discussion Forum"}
            />
          </Stack>
        </Stack>
        <Flex>
          <Image
            rounded={"md"}
            alt={"About Image"}
            src={AboutImage}
            objectFit={"cover"}
          />
          {/* <Image
            rounded={'md'}
            alt={'About Image'}
            src={
              alt={"Login Image"}
              
              src={AboutImage}
              objectFit={'cover'}

            }
          /> */}
        </Flex>
      </SimpleGrid>
    </Container>
  );
}
