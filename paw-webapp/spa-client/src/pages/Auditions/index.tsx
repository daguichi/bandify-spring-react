import PostCard from "../../components/PostCard/PostCard";
import { useTranslation } from "react-i18next";
import AuditionSearchBar from "../../components/SearchBars/AuditionSearchBar";
import { Audition } from "../../models";
import { Center, Divider, Flex, Heading, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { serviceCall } from "../../services/ServiceManager";
import { usePagination} from "../../hooks/usePagination";
import {
    PaginationArrow,
    PaginationWrapper,
} from "../../components/Pagination/pagination";
// import { auditionService } from "../../services";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuditionService } from "../../contexts/AuditionService";

export default function AuditionsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [auditions, setAuditions] = useState<Audition[]>([]);
  const auditionService = useAuditionService();
  const [currentPage] = usePagination();
  const [maxPage, setMaxPage] = useState(1);

  const location = useLocation();
  useEffect(() => {
    serviceCall(
      auditionService.getAuditions(currentPage),
      navigate,
      (response) => {
        setAuditions(response ? response.getContent() : []);
        setMaxPage(response ? response.getMaxPage() : 1); //TODO revisar esto
      },
      location
    )
  }, [currentPage, navigate, auditionService])

  return (
    <>
      <Center marginY={10} flexDirection="column">
        <VStack spacing={5} >
          <Heading fontSize={40}>{t("Auditions.header")}</Heading>
          <AuditionSearchBar />
        </VStack>
      </Center>
      <Divider />
      <VStack marginY={10} alignItems={"center"} spacing={4}>
        <Heading>{t("Auditions.latest")}</Heading>

        <Flex
          direction={"row"}
          wrap={"wrap"}
          margin={2}
          justifyContent={"space-around"}
        >
          {auditions.length > 0 ? auditions.map((audition) => (
            <PostCard {...audition} />
          )) : <Heading>No auditions found</Heading>  
          }
        </Flex>
      </VStack>
    <PaginationWrapper>
        {currentPage > 1 && (
            <Link
                to={`/auditions?page=${
                    currentPage - 1
                }`}
            >
                <PaginationArrow
                    xRotated={true}
                    src="../../images/page-next.png"
                    alt={t("Pagination.alt.beforePage")}
                />
            </Link>
        )}
        {t("Pagination.message", {
            currentPage: currentPage,
            maxPage: maxPage,
        })}
        {currentPage < maxPage && (
            <Link
                to={`/auditions?page=${
                    currentPage + 1
                }`}
            >
                <PaginationArrow
                    src="../../images/page-next.png"
                    alt={t("Pagination.alt.nextPage")}
                />
            </Link>
        )}
    </PaginationWrapper>
    </>
  );
}
