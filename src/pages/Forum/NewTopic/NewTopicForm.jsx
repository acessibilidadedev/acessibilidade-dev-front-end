import React, { useState } from "react";
import { useForm } from "react-hook-form";

//titulo
import { Heading } from "@chakra-ui/react";

import { NEWTOPIC } from "../../../utils/constants/api";

import styles from "./styles.module.css";

import errorValidation from "../../../utils/validations/ErrorValidation";

import {
  Box,
  Flex,
  Card,
  CardBody,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Select,
} from "@chakra-ui/react";
import CustomButton from "../../../components/CustomButton";
import Editor from "../../../components/Markdown/Editor";
import Preview from "../../../components/Markdown/Preview";
import InputTags from "../../../components/InputTags";

import { useAuth0 } from "@auth0/auth0-react";

import { useNavigate } from "react-router-dom";

const NewTopicForm = () => {
  const { user } = useAuth0();

  const [mdText, setMdText] = useState("");
  const [isInvalidMD, setIsInvalidMD] = useState(false);

  const [tags, setTags] = useState([]);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit, //Esta função receberá os dados do formulário se a validação do formulário for bem sucedida.
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
    },
  });

  const handleTextMD = (newValue) => {
    if (newValue.trim().length >= 20) {
      setIsInvalidMD(false);
    }
    setMdText(newValue);
  };

  const onSubmit = async (formData) => {
    if (mdText.trim().length < 20) {
      setIsInvalidMD(true);
      return;
    }
    const body = {
      title: formData.title,
      description: mdText,
      authorId: user.id,
      categoryId: parseInt(formData.category),
      tags,
    };

    const res = await fetch(NEWTOPIC, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (data.success) {
      navigate("/forum", { replace: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box className="container py-5">
        <Heading className="title-color">Novo tópico</Heading>
        <br />
        <Card>
          <CardBody className="shadow bg-white rounded">
            <FormControl isRequired isInvalid={errors.title}>
              <FormLabel htmlFor="title" className="title-color">
                Título
              </FormLabel>
              <Input
                id="title"
                placeholder="Digite o título do tópico"
                isInvalid={errors.title ? true : false}
                {...register("title", {
                  ...errorValidation.title,
                  ...errorValidation.filled,
                })}
                className="bg-white"
              />
              {!errors.title ? (
                <FormHelperText>
                  O campo deve possuir no mínimo 20 caracteres.
                </FormHelperText>
              ) : (
                <FormErrorMessage>{errors.title.message}</FormErrorMessage>
              )}
            </FormControl>
          </CardBody>
        </Card>
        <Tabs my={10}>
          <TabList>
            <Tab>Editor</Tab>
            <Tab>Visualização</Tab>
          </TabList>
          <TabPanels className="shadow bg-white rounded">
            <TabPanel>
              <FormControl isRequired isInvalid={isInvalidMD}>
                <FormLabel htmlFor="title" className="title-color">
                  Descrição
                </FormLabel>
                <Editor text={mdText} handleText={handleTextMD} />
                {!isInvalidMD ? (
                  <FormHelperText>
                    O campo deve possuir no mínimo 20 caracteres.{" "}
                    <i>
                      Observação: Para adicionar uma quebra de linha é
                      necessário 2 espaços no final da linha.
                    </i>
                  </FormHelperText>
                ) : (
                  <FormErrorMessage>
                    O descrição do tópico não possui o mínimo de 20 caracteres
                  </FormErrorMessage>
                )}
              </FormControl>
            </TabPanel>
            <TabPanel>
              <Preview text={mdText} />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Box className="shadow bg-white rounded">
          <InputTags onAddTag={setTags} tags={tags} textLabel={"Tags"} />
        </Box>
        <Box className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-5 shadow bg-white rounded py-4 px-4">
          <FormControl isRequired isInvalid={errors.category}>
            <FormLabel className="title-color">Categoria</FormLabel>
            <Select
              size={"md"}
              id="SelectOption"
              maxWidth="510px"
              width="100%"
              {...register("category", {
                ...errorValidation.filled,
              })}
              className="bg-white"
              placeholder="Selecione uma categoria"
            >
              <option value="1">Deficiência Auditiva</option>
              <option value="2">Deficiência Motora</option>
              <option value="3">Deficiência Visual</option>
            </Select>
            {errors.category ? (
              <FormErrorMessage>{errors.category.message}</FormErrorMessage>
            ) : null}
          </FormControl>
          <CustomButton className="mt-4 mt-sm-0 ms-sm-5">Publicar</CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default NewTopicForm;
