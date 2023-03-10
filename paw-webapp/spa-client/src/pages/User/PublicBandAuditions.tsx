import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/welcome.css";
import "../../styles/auditions.css";
import { Audition, User } from "../../models";
import {
  Avatar,
  Button, ButtonGroup, Card,
  CardBody, CardFooter, Divider,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  useToast,
  VStack
} from "@chakra-ui/react";
import { FiCalendar, FiMusic, FiShare2 } from "react-icons/fi";
import { AiOutlineInfoCircle } from "react-icons/ai";
import dayjs from "dayjs";
import { serviceCall } from "../../services/ServiceManager";
import { useAuditionService } from "../../contexts/AuditionService";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { BiBullseye } from "react-icons/bi";
import GenreTag from "../../components/Tags/GenreTag";
import RoleTag from "../../components/Tags/RoleTag";
import { useUserService } from "../../contexts/UserService";
import {PaginationWrapper} from "../../components/Pagination/pagination";
import {getQueryOrDefault, useQuery} from "../../hooks/useQuery";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import CopyToClipboard from 'react-copy-to-clipboard';

const PublicBandAudition = (
  {
    audition,
  }: {
    audition: Audition
  }
) => {
  const { t } = useTranslation();
  const date = dayjs(audition.creationDate).format('DD/MM/YYYY')
  const toast = useToast();

  return (
    <Card maxW="md" margin={5} boxShadow={"2xl"} w={"2xl"}>
      <CardBody>
        <Stack spacing="3">
          <Heading size="md" noOfLines={2}>{audition.title}</Heading>
          <HStack spacing={4}>
            <FiCalendar />
            <HStack wrap={'wrap'}>
              <Text>{date}</Text>
            </HStack>
          </HStack>
          <HStack spacing={4}>
            <BiBullseye />
            <HStack spacing="2" wrap={"wrap"}>
              {audition.lookingFor.map((role) => (
                <RoleTag role={role} />
              ))}
            </HStack>
          </HStack>
          <HStack spacing={4}>
            <FiMusic />
            <HStack spacing="2" wrap={"wrap"}>
              {audition.musicGenres.map((genre) => (
                <GenreTag genre={genre} />
              ))}
            </HStack>
          </HStack>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup>
          <Link to={"/audition/" + audition.id.toString()}>
            <Button variant="solid" colorScheme="blue" leftIcon={<AiOutlineInfoCircle />}>
              {t("PostCard.more")}
            </Button>
          </Link>
        <CopyToClipboard text={window.location.href + "/" + audition.id.toString()} onCopy={() => {
            toast({
                title: t("Register.success"),
                status: "success",
                description: t("Clipboard.message"),
                isClosable: true,
            });
        }}>
            <Button variant="ghost" colorScheme="blue" leftIcon={<FiShare2 />}>
                {t("PostCard.share")}
            </Button>
        </CopyToClipboard>
        </ButtonGroup>
      </CardFooter>
    </Card>
  )
}


const PublicBandAuditions = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [auditions, setAuditions] = useState<Audition[]>([]);
  const [band, setBand] = useState<User>();
  const auditionService = useAuditionService();
  const userService = useUserService();
  const navigate = useNavigate();
  const query = useQuery();
  const [currentPage, setCurrentPage] = useState(parseInt(getQueryOrDefault(query, "page", "1")));
  const [maxPage, setMaxPage] = useState(1);
  const [previousPage, setPreviousPage] = useState("");
  const [nextPage, setNextPage] = useState("");
  const location = useLocation();

  useEffect(() => {
    serviceCall(
      auditionService.getAuditionsByBandId(currentPage, Number(id)),
      navigate,
      (auditions) => {
        setAuditions(auditions ? auditions.getContent() : []);
        setMaxPage(auditions ? auditions.getMaxPage() : 1);
      }
    )

    serviceCall(
      userService.getUserById(Number(id)),
      navigate,
      (user) => {
        setBand(user);
      }
    )
  }, [navigate, auditionService, userService])

  return (
  <>

    <VStack pt={'10'}>
      <HStack>
          <Heading as='h1'
            size='2xl'
            mb={'4'}
            fontWeight="bold">{t("PublicBandAuditions.Title")}</Heading>
      </HStack>
      <Flex
        as="a"
        onClick={() => {
          navigate("/user/" + id);
        }}
        flex="1"
        gap="4"
        alignItems="center"
        justifyContent={"start"}
        cursor={'pointer'}
      >
        <Avatar
          src={band?.profileImage}
          _dark={{
              backgroundColor: "white",
          }}
        />
        <Heading size="md" noOfLines={2}>{band?.name}</Heading>
      </Flex>
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
            return <PublicBandAudition audition={audition} key={index} />
          }) : <Text as='h3' fontSize={'lg'}>{t("PublicBandAuditions.NoAuditions")}</Text>
        }
      </Flex>
      <Flex
        w="full"
        p={50}
        alignItems="center"
        justifyContent="center"
      >
          <PaginationWrapper>
              {currentPage > 1 && (
                  <button
                      onClick={() => {
                          serviceCall(
                              auditionService.getAuditionsByUrl(previousPage),
                              navigate,
                              (response) => {
                                  setAuditions(response ? response.getContent() : []);
                                  setPreviousPage(response ? response.getPreviousPage() : "");
                                  setNextPage(response ? response.getNextPage() : "");
                              },
                              location
                          )
                          setCurrentPage(currentPage - 1)
                          const url = new URL(window.location.href);
                          url.searchParams.set('page', String(currentPage - 1));
                          window.history.pushState(null, '', url.toString());
                      }}
                      style={{ background: "none", border: "none" }}
                  >
            <ChevronLeftIcon mr={4}/>

                  </button>
              )}
              {t("Pagination.message", {
                  currentPage: currentPage,
                  maxPage: maxPage,
              })}
              {currentPage < maxPage && (
                  <button
                      onClick={() => {
                          serviceCall(
                              auditionService.getAuditionsByUrl(nextPage),
                              navigate,
                              (response) => {
                                  setAuditions(response ? response.getContent() : []);
                                  setPreviousPage(response ? response.getPreviousPage() : "");
                                  setNextPage(response ? response.getNextPage() : "");
                              },
                              location
                          )
                          setCurrentPage(currentPage + 1)
                          const url = new URL(window.location.href);
                          url.searchParams.set('page', String(currentPage + 1));
                          window.history.pushState(null, '', url.toString());
                      }}
                      style={{ background: "none", border: "none" }}
                  >
            <ChevronRightIcon ml={4}/>

                  </button>
              )}
          </PaginationWrapper>
      </Flex>
    </VStack>
  </>
  )
}

export default PublicBandAuditions;
