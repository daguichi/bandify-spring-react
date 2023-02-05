import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/welcome.css";
import "../../styles/auditions.css";
import { Audition } from "../../models";
import { Box, Button, Flex, Heading, HStack, Link, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { FiCalendar, FiUsers } from "react-icons/fi";
import { AiOutlineInfoCircle } from "react-icons/ai";
import dayjs from "dayjs";
import { ImLocation } from "react-icons/im";
import AuthContext from "../../contexts/AuthContext";
import { serviceCall } from "../../services/ServiceManager";
import { useAuditionService } from "../../contexts/AuditionService";
import {useLocation, useNavigate} from "react-router-dom";
import { usePagination} from "../../hooks/usePagination";
import Pagination from "@choc-ui/paginator";

const BandAudition = (
  {
    audition,
  }: {
    audition: Audition
  }
) => {
  const bg = useColorModeValue("white", "gray.900")
  const { t } = useTranslation();
  const date = dayjs(audition.creationDate).format('DD/MM/YYYY')
  const navigate = useNavigate();
  return (

    <Box
      w="full"
      maxW="sm"
      mx="auto"
      my="6"
      px={4}
      py={3}
      bg={bg}
      shadow="md"
      rounded="md"
    >

      <Heading
        as='h1'
        fontSize="lg"
        fontWeight="bold"
        m={2}
        noOfLines={1}
        color="gray.800"
        _dark={{
          color: "white",
        }}
      >
        {audition.title}
      </Heading>

      <Flex justify="space-around">
        <HStack spacing={4}>
          <ImLocation />
          <Text fontSize={"lg"}>{audition.location}</Text>
        </HStack>
        <HStack spacing={4}>
          <FiCalendar />
          <HStack wrap={'wrap'}>
            <Text>{date}</Text>
          </HStack>
        </HStack>
      </Flex>


      <Flex alignItems="center" justifyContent="center" mt={4}>
        <Button colorScheme="green" mr={3} leftIcon={<FiUsers />}>
          {t("MyAuditions.applicants")}
        </Button>
        <Button colorScheme="blue" leftIcon={<AiOutlineInfoCircle />}
          onClick={() => navigate('/auditions/' + audition.id)}
        >{t("MyAuditions.moreInfo")}</Button>

      </Flex>
    </Box>

  )
}

const BandAuditions = () => {
  const { t } = useTranslation();
  const { userId } = useContext(AuthContext);
  const [auditions, setAuditions] = useState<Audition[]>([]);
  const auditionService = useAuditionService();
  const navigate = useNavigate();
  const [currentPage] = usePagination();
  const [maxPage, setMaxPage] = useState(1);
  const location = useLocation();

  useEffect(() => {
    serviceCall(
      auditionService.getAuditionsByBandId(currentPage, userId),
      navigate,
      (auditions) => {
        setAuditions(auditions ? auditions.getContent() : []);
        setMaxPage(auditions ? auditions.getMaxPage() : 1);
      }
    )
  }, [currentPage, navigate, auditionService])

  return (
    <VStack pt={'10'}>
      <Heading as='h1'
        size='2xl'
        fontWeight="bold">{t("MyAuditions.title")}</Heading>
      <Flex
        p={50}
        w="full"
        alignItems="center"
        direction={"row"}
        wrap={"wrap"}
        margin={2}
        justifyContent={"space-around"}
      >
        {auditions.length > 0 ?
        auditions.map((audition, index) => {
          return <BandAudition audition={audition} key={index} />
        }) : <Text></Text>
        }
      </Flex>
      <Flex
          w="full"
          p={50}
          alignItems="center"
          justifyContent="center"
      >
        <Pagination
            defaultCurrent={currentPage}
            total={maxPage * 9}
            pageSize={9}
            paginationProps={{
              display: "flex",
            }}
            onChange={(page) => {
              let searchParams = new URLSearchParams(location.search);
              searchParams.set('page', String(page));
              navigate({
                pathname: location.pathname,
                search: searchParams.toString()
              });
            }
            }
            colorScheme="blue"
            rounded="full"
        />
      </Flex>
    </VStack>
  )
}

export default BandAuditions;
