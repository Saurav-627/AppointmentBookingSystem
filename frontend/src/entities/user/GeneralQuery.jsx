import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  Input,
  Stack,
  Textarea,
  Box,
  Text,
  Avatar,
} from "@chakra-ui/react";
import { Flex, Button, IconButton, Icon } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { useState } from "react";
import { useEffect } from "react";
import { BiArrowBack, BiTrashAlt } from "react-icons/bi";

import io from "socket.io-client";

import { useToast } from "@chakra-ui/react";

const socket = io("http://localhost:3002");

const GeneralQuery = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDelete,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [discussions, setDiscussions] = useState([]);
  const [isSelectedDiscussion, setIsSelectedDiscussion] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState({});
  const [comments, setComments] = useState([]);
  const [userData, setUserData] = useState();
  const [writtenComment, setWrittenComment] = useState("");
  const [deleteData, setDeleteData] = useState({});
  const toast = useToast();

  const addDisscussion = async (e) => {
    e.preventDefault();
    const phone = localStorage.getItem("phone");
    console.log(phone);
    const requestconfig = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: body,
        phone: phone,
      }),
    };
    try {
      const response = await fetch(
        "http://localhost:3000/api/user/addDiscussion",
        requestconfig
      );
      const data = await response.json();
      fetchDiscussions();
    } catch (err) {
      console.log(err);
    }
  };

  const addComment = () => {
    const phone = localStorage.getItem("phone");
    socket.emit(
      "comment",
      {
        _id: selectedDiscussion._id,
        comment: writtenComment,
        phone: phone,
        user_name: userData.name,
      },
      selectedDiscussion._id
    );

    setWrittenComment("");
  };

  const fetchDiscussions = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/user/getDiscussion"
      );
      const data = await response.json();
      setDiscussions(data.data.reverse());
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUser = async (phoneNumber) => {
    const phone = localStorage.getItem("phone");
    try {
      const response = await fetch(
        `http://localhost:3000/api/user/data/${phone}`
      );
      const data = await response.json();
      setUserData(data.user);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    socket.on("notification", (data) => {
      toast({
        title: "New Comment",
        description: data.comment,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    });

    socket.on("new-comment", (data) => {
      setComments((prev) => [...prev, data]);
      console.log(comments);
    });
  }, []);

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const searchHandler = (e) => {
    if (e.target.value === "") {
      fetchDiscussions();
    } else {
      const filtered = discussions.filter((discussion) => {
        return discussion.title
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
      setDiscussions(filtered);
    }
  };

  const deleteForum = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/user/deleteDiscussion",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: deleteData.id,
            title: deleteData.title,
          }),
        }
      );
      const data = await response.json();
      if (data.message === "Discussion Deleted") {
        toast({
          title: "Discussion Deleted",
          description: "Discussion Deleted Successfully",
          status: "success",
          duration: 3000,
        });
        fetchDiscussions();
        setIsSelectedDiscussion(false);
        onDeleteClose();
      }
    } catch (err) {
      toast({
        title: "Server Error",
        description: "Something Went Wrong",
        status: "error",
        duration: 3000,
      });
      console.log(err);
    }
  };

  return (
    <Flex minH={"500px"} direction={"column"} w={"full"} alignItems={"center"}>
      <Modal isOpen={isDelete} onClose={onDeleteClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Forum</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize={"lg"}>
              Are you sure you want to delete this forum?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme={"red"} onClick={deleteForum}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as={"form"} onSubmit={(e) => addDisscussion(e)}>
          <ModalHeader display={"flex"} justifyContent={"center"}>
            Add Discussion
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex w={"full"}>
              <Stack w={"full"}>
                <FormControl>
                  <Input
                    type={"text"}
                    variant={"flushed"}
                    placeholder="Title"
                    fontWeight={"600"}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </FormControl>
                <FormControl>
                  <Textarea
                    variant={"unstyled"}
                    placeholder="Body Text"
                    onChange={(e) => {
                      setBody(e.target.value);
                    }}
                  />
                </FormControl>
              </Stack>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose} type={"submit"}>
              Save Discussion
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex
        direction={"column"}
        bg={"gray.100"}
        borderX={"1px solid"}
        borderColor={"gray.200"}
        gap={2}
        alignItems={"center"}
        w={"65%"}
      >
        {!isSelectedDiscussion && (
          <Flex
            justifyContent={"space-between"}
            w={"full"}
            bg={"white"}
            h={"100px"}
            alignItems={"center"}
            px={"20px"}
          >
            <Flex fontWeight={"600"} fontSize={"20px"} w={"60%"}>
              <Input
                type="Search"
                placeholder="Search Title"
                onChange={(e) => {
                  searchHandler(e);
                }}
              />
            </Flex>
            <IconButton color={"white"} bg={"purple.600"} onClick={onOpen}>
              <Icon as={AiOutlinePlus} height={"22px"} width={"22px"} />
            </IconButton>
          </Flex>
        )}

        {isSelectedDiscussion && (
          <Flex direction={"column"} w={"full"}>
            <Flex w={"full"} justifyContent={"space-between"} p={"10px"}>
              <IconButton
                bg={"purple.400"}
                color={"white"}
                icon={<BiArrowBack size={"22px"} />}
                onClick={() => {
                  setIsSelectedDiscussion(false);
                  socket.emit("leave-discussion", selectedDiscussion._id);
                  selectedDiscussion({});
                }}
              ></IconButton>
              {userData.phone === selectedDiscussion.phone && (
                <IconButton
                  bg={"red"}
                  color={"white"}
                  _hover={{
                    bg: "red.600",
                  }}
                  icon={<BiTrashAlt size={"22px"} />}
                  onClick={() => {
                    setDeleteData({
                      id: selectedDiscussion._id,
                      title: selectedDiscussion.title,
                    });
                    onDeleteOpen();
                  }}
                ></IconButton>
              )}
            </Flex>
            <Flex direction={"column"} p={"10px"}>
              <Flex fontWeight={"600"} fontSize={"20px"}>
                {selectedDiscussion.title}
              </Flex>
              <Flex
                fontWeight={"400"}
                fontSize={"18px"}
                color={"gray.600"}
                wrap={"wrap"}
              >
                {selectedDiscussion.description}
              </Flex>
            </Flex>
            <Flex w={"full"}>
              <Flex
                w={"full"}
                mt={"20px"}
                justifyContent={"space-between"}
                alignItems={"center"}
                gap={"2"}
                p={"10px"}
                borderBottom={"1px solid"}
                borderColor={"gray.400"}
                as={"form"}
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log(selectedDiscussion);
                  addComment();
                }}
              >
                {" "}
                <Input
                  type={"text"}
                  variant={"flushed"}
                  value={writtenComment}
                  placeholder="Write Comments"
                  onChange={(e) => {
                    setWrittenComment(e.target.value);
                  }}
                />
                <Button bg={"purple.400"} color={"white"} type="submit">
                  Post
                </Button>
              </Flex>
            </Flex>
            <Flex direction={"column"}>
              {comments.map((comment, index) => {
                return (
                  <Flex
                    w={"full"}
                    justifyContent={"start"}
                    alignItems={"center"}
                    gap={"2"}
                    p={"10px"}
                    borderBottom={"1px solid"}
                    borderColor={"gray.400"}
                  >
                    <Avatar size={"lg"} />
                    <Flex
                      fontWeight={"400"}
                      fontSize={"18px"}
                      color={"gray.600"}
                      wrap={"wrap"}
                      direction={"Column"}
                    >
                      <Box fontSize={"18px"} fontWeight={600}>
                        {comment.user_name}
                      </Box>
                      <Box>{comment.comment}</Box>
                    </Flex>
                  </Flex>
                );
              })}
            </Flex>
          </Flex>
        )}
        {!isSelectedDiscussion && (
          <>
            {discussions.map((discussion) => {
              return (
                <Flex
                  key={discussion.phone}
                  w={"full"}
                  maxHeight={"137px"}
                  minH={"137px"}
                  cursor={"pointer"}
                  justifyContent={"center"}
                  transition={"all 0.2s ease-in-out"}
                  _hover={{
                    transform: "scale(1.01)",
                    transition: "all 0.2s ease-in-out",
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: "gray.300",
                  }}
                  onClick={() => {
                    setSelectedDiscussion(discussion);
                    setIsSelectedDiscussion(true);
                    setComments(discussion.replies);
                    console.log(discussion);
                    socket.emit("join-discussion", discussion._id);
                  }}
                >
                  <Flex w={"full"} direction={"column"} bg={"white"} p={"10"}>
                    <Flex
                      w={"full"}
                      justifyContent={"space-between"}
                      direction={"column"}
                    >
                      <Flex fontWeight={"600"} fontSize={"20px"}>
                        {discussion.title}
                      </Flex>
                      <Flex
                        fontWeight={"400"}
                        fontSize={"18px"}
                        color={"gray.600"}
                      >
                        {discussion.description}
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              );
            })}
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default GeneralQuery;
