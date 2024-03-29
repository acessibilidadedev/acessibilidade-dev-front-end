import React, { useState } from "react";
import { Menu } from "react-feather";
import CustomButton from "../CustomButton";

import {
  Box,
  Button,
  Drawer,
  DrawerBody, //centro afastado do outro
  DrawerFooter, //deixa para baixo na direita
  DrawerHeader, //deixa com negrito
  DrawerOverlay, //escurece tudo
  DrawerContent, //some com tudo
  DrawerCloseButton,
  Link,
  Text,
  useDisclosure,
  Divider,
  Heading,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";

import { Link as LinkRouter } from "react-router-dom";

const index = () => {
  const { user, isAuthenticated, error, loginWithRedirect, logout } =
    useAuth0();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <>
      <Button ref={btnRef} color="#8A8A8A" variant="ghost" onClick={onOpen}>
        <Menu />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent bgColor="#DDDDDD" color="#696666">
          <DrawerHeader className="d-flex align-items-start">
            {isAuthenticated ? (
              <Text>{user.nickname}</Text>
            ) : (
              <>
                <br />
                <Link onClick={() => loginWithRedirect()}>
                  Entrar/Cadastrar
                </Link>
                <br />
              </>
            )}
            <DrawerCloseButton size="lg" />
          </DrawerHeader>

          <DrawerBody as="b" textAlign="center">
            {isAuthenticated && !user.completedProfile ? (
              <>
                <Box position="relative" className="px-1 py-3 mt-3">
                  <Divider borderColor="#696666" />
                  <AbsoluteCenter bg="#DDD" px="4">
                    Perfil
                  </AbsoluteCenter>
                </Box>
                <LinkRouter onClick={onClose} to="/completarCadastro">
                  Completar cadastro
                </LinkRouter>
                <br />
              </>
            ) : null}
            <Box position="relative" className="px-1 py-3 mt-3">
              <Divider borderColor="#696666" />
              <AbsoluteCenter bg="#DDD" px="4">
                Seções
              </AbsoluteCenter>
            </Box>
            <LinkRouter onClick={onClose} to="/forum">
              Fórum
            </LinkRouter>
            <br />
            <LinkRouter onClick={onClose} to="/chat">
              Sala Virtual
            </LinkRouter>
            <br />
            <LinkRouter onClick={onClose} to="/openIA">
              Dúvidas
            </LinkRouter>
          </DrawerBody>

          <DrawerFooter justifyContent="center">
            {isAuthenticated ? (
              <CustomButton
                onClick={() => logout({ returnTo: window.location.origin })}
                type="button"
                bg="red"
                bgHover="red.500"
              >
                Sair
              </CustomButton>
            ) : null}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default index;
