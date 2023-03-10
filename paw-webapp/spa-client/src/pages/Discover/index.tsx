import { Center, Heading, VStack } from "@chakra-ui/react";
import React from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import SearchForm from "../../components/SearchBars/DiscoverSearchBar";
import "../../styles/usersDiscover.css";

const Discover = () => {
  const { t } = useTranslation()
  return (
    <>
      <Helmet>
        <title>{t("Discover.discover")}</title>
      </Helmet>
      <Center paddingTop={12}>
          <VStack spacing={4}>
          <Heading fontSize={"4xl"} fontWeight={"bold"}>
              {t("Discover.discover")}
          </Heading>
          <SearchForm />
          </VStack>
      </Center>
    </>
  );
};

export default Discover;
