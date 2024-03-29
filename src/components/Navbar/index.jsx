import React, { useState } from "react";

import MenuSideBar from "../MenuSideBar/";

import { Search } from "react-feather";

import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  InputGroup,
  Input,
  InputLeftAddon,
  InputRightElement,
  Select,
  Spacer,
  Tab,
  Tabs,
  TabList,
  Link,
  Text,
} from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Outlet,
  Link as LinkRouter,
  useMatches,
  useNavigate,
} from "react-router-dom";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  const matches = useMatches();
  const navigate = useNavigate();
  const activeTab = ["forum", "chat", "openIA"];

  return (
    <>
      <Box className="bg-white container-fluid ps-0 shadow-sm " id="navbar">
        <Box className="row pt-2 border-bottom">
          <Heading as="h4" size="lg" className="col-12 text-center">
            Acessibilidade Dev
          </Heading>
        </Box>
        <Box className="row ps-2 ps-lg-0 justify-content-end justify-content-sm-between">
          <Tabs
            className="d-none d-sm-flex col-auto align-items-end"
            index={
              matches.length > 1
                ? activeTab.findIndex((a) => matches[1].pathname.includes(a))
                : null
            }
          >
            <TabList style={{ width: "fit-content" }}>
              <LinkRouter to="forum">
                <Tab color="#0070BB" fontWeight="bold">
                  Fórum
                </Tab>
              </LinkRouter>
              <LinkRouter to="chat">
                <Tab color="#C05746" fontWeight="bold">
                  Sala Virtual
                </Tab>
              </LinkRouter>
              <LinkRouter to="openIA">
                <Tab color="#5A9A08" fontWeight="bold">
                  Dúvidas
                </Tab>
              </LinkRouter>
            </TabList>
          </Tabs>
          <Box className="col-auto d-flex mb-1 justify-content-end align-items-center">
            <Box
              className="text-end me-3 d-none d-sm-none d-md-none d-lg-block"
              style={{ width: "fit-content" }}
            >
              {isAuthenticated ? (
                <Text as="p" size="sm">
                  Olá, {user.nickname}
                </Text>
              ) : (
                <Link style={{ textDecoration: "none" }}>
                  <Text as="p" size="sm" onClick={() => loginWithRedirect()}>
                    Olá, faça Login/Cadastro
                  </Text>
                </Link>
              )}
            </Box>
            <Box style={{ width: "fit-content" }}>
              <MenuSideBar />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box>
        {!isAuthenticated || !user?.completedProfile ? (
          <div className="alert alert-warning m-1">
            Para ter acesso a todas as funcionalidades do Portal Acessibilidade
            Dev é preciso estar logado e ter completado seu cadastro,{" "}
            {!user?.completedProfile && isAuthenticated ? (
              <Link onClick={() => navigate("/completarCadastro")}>
                Completar cadastro.
              </Link>
            ) : (
              <Link onClick={() => loginWithRedirect()}>Realizar login.</Link>
            )}
          </div>
        ) : null}
        <Outlet />
      </Box>
    </>
  );
};

export default Navbar;
