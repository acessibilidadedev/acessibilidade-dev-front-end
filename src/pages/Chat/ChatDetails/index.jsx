import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Button, Heading, Textarea } from "@chakra-ui/react";
import { LogOut, Send, X } from "react-feather";
import {
  registerMember,
  updateData,
  TIMESTAMP,
  getChatDetails,
  getListMessages,
  unregisterMember,
  unsubscription,
  writeData,
} from "../../../services/chat.service.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import { dateTimeFormatted } from "../../../utils/formatters/datetime.js";
import SpinnerLoading from "../../../components/SpinnerLoading";

const ChatDetails = () => {
  const { chatId } = useParams();
  const textAreaRef = useRef();
  const { user, isLoading } = useAuth0();
  const navigate = useNavigate();

  const [rowsTextArea, setRowsTextArea] = useState(1);
  /*  const [heightTextArea, setHeightTextArea] = useState("");*/
  const [messageList, setMessageList] = useState([]);
  const [chatInfo, setChatInfo] = useState({});

  const handleTextAreaRows = () => {
    let height = parseInt(textAreaRef.current.scrollHeight);
    let bottom = textAreaRef;
    let lineHeight = parseInt(
      window.getComputedStyle(textAreaRef.current).lineHeight
    );
    const newRowsTextArea = Math.floor(height / lineHeight);
    //setHeightTextArea(newRowsTextArea * lineHeight + "px")
    setRowsTextArea(Math.floor(height / lineHeight));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const payload = {
      path: `messages/${chatId}`,
      data: {
        author: user.nickname,
        message: textAreaRef.current.value,
        createdAt: TIMESTAMP(),
      },
    };
    try {
      await writeData(payload);
      textAreaRef.current.value = "";
    } catch (e) {
      console.error(e.message);
    }
  };

  const searchMessage = (snapshot) => {
    setMessageList(snapshot);
  };

  const searchChatInfo = (info) => {
    setChatInfo(info);
  };

  useEffect(() => {
    if (!isLoading) {
      getListMessages(`${chatId}`, searchMessage);
      getChatDetails(`${chatId}`, searchChatInfo);
      registerMember(`members/${chatId}/${user.id}`);
      return function cleanup() {
        unsubscription();
        unregisterMember(`members/${chatId}/${user.id}`);
      };
    }
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <SpinnerLoading />
      ) : (
        <>
          <Box className="md:container mx-auto">
            <Box className="flex my-5" justifyContent="space-between">
              <Heading as="h1" className="capitalize">
                {chatInfo?.title}
              </Heading>
              <Box>
                {chatInfo?.ownerId === user.id && chatInfo.isOpen ? (
                  <Button
                    colorScheme="red"
                    rightIcon={<X />}
                    type="button"
                    onClick={() => {
                      let updates = {};
                      let oldInfos = { ...chatInfo };
                      delete oldInfos.key;
                      updates[`chats/${chatId}`] = {
                        ...oldInfos,
                        isOpen: false,
                      };
                      updateData(updates);
                      navigate("/chat", { replace: true });
                    }}
                  >
                    Encerrar discussão
                  </Button>
                ) : null}
                <Button
                  colorScheme="facebook"
                  rightIcon={<LogOut />}
                  ml="15px"
                  type="Button"
                  onClick={() => navigate("/chat", { replace: true })}
                >
                  Sair da Sala
                </Button>
              </Box>
            </Box>

            <Box
              border="1px"
              borderColor="gray.100"
              borderRadius="xl"
              padding="15px"
              my="5px"
            >
              <Box>
                <Box mx="30px" mt="5px" mb="15px">
                  <Heading as="h2" size="md">
                    Seja bem-vindo a{" "}
                    <span className="capitalize">{chatInfo.title}</span>
                  </Heading>
                </Box>
                <Box>
                  {messageList.map((m) => (
                    <Box
                      mx="30px"
                      my="5px"
                      padding="15px"
                      borderBottom="1px"
                      borderTop="1px"
                      borderColor="gray.100"
                      key={m.key}
                    >
                      <Box className="flex" justifyContent="space-between">
                        <p>{m.author}</p>
                        <p>{dateTimeFormatted(new Date(m.createdAt))}</p>
                      </Box>
                      <Box>
                        <p>{m.message}</p>
                      </Box>
                    </Box>
                  ))}

                  {!chatInfo.isOpen ? (
                    <Heading
                      as="h2"
                      size="sm"
                      textAlign="center"
                      p="5"
                      color="red"
                    >
                      A sala {chatInfo.title} foi encerrada.
                    </Heading>
                  ) : null}
                </Box>
              </Box>
              <Box p={1}>
                {/*            <Textarea h={heightTextArea} ref={textAreaRef} onChange={handleTextAreaRows} w="100%" placeholder="Conversar em <Nome da sala>"/>*/}
                <Textarea
                  ref={textAreaRef}
                  onChange={handleTextAreaRows}
                  w="100%"
                  placeholder={`Conversar em ${chatInfo.title}`}
                  rows={rowsTextArea}
                  isReadOnly={!chatInfo.isOpen}
                />
                <Button
                  mt={1}
                  aria-label="Enviar mensagem na sala <Nome da sala>"
                  rightIcon={<Send />}
                  onClick={handleSendMessage}
                  isDisabled={!chatInfo.isOpen}
                >
                  Enviar
                </Button>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

// scrollHeight / lineHeight

export default ChatDetails;
