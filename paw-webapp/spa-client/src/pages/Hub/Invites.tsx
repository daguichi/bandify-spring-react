import { Accordion, Avatar, Box, Button, Center, Flex, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useDisclosure, VStack } from "@chakra-ui/react"
import { useTranslation } from "react-i18next"
import SidenavLayout from "./SidenavLayout"
import {TiTick, TiCancel} from 'react-icons/ti'
import { useContext, useEffect, useState } from "react"
import AuthContext from "../../contexts/AuthContext"
import { useMembershipService } from "../../contexts/MembershipService"
import { serviceCall } from "../../services/ServiceManager"
import { useNavigate } from "react-router-dom"
import Membership from "../../models/Membership"
import User from "../../models/User"
import { useUserService } from "../../contexts/UserService"


enum inviteStatuses {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

function InviteInfo({membership}:{membership:Membership}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {t} = useTranslation();

  return (
    <>
      <Button onClick={onOpen}>{t("Invites.MoreInfo")}</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("Invites.ModalTitle")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{t("Invites.Subtitle")} {' '}{membership.band.name}{' '} {t("Invites.Subtitle2")}</Text>
            <Text>{t("Invites.Subtitle3")}</Text>
            <Text as='i'>
              {membership.description}
            </Text>
            <Text>{t("Invites.Subtitle4")}</Text>
            
          </ModalBody>

          <ModalFooter>
            <Button leftIcon={<TiTick />} colorScheme='blue' mr={3} onClick={onClose}>
              {t("Invites.Accept")}
            </Button>
            <Button leftIcon={<TiCancel />} colorScheme='red'>{t("Invites.Reject")}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

const InviteItem = ({membership}:{membership:Membership}) => {

  return (
    <Box borderWidth='1px' borderRadius='lg' p="4" w={'full'}>
      <Flex alignItems={'center'} justify="space-between">
        <HStack>
          <Avatar src={membership.band.profileImage} //TODO: revisar ALT?
                    _dark={{
                      backgroundColor: "white",
                    }} />
          <Box ml='3'>
            <Text fontWeight='bold'>
              {membership.band.name}
            </Text>
          </Box>
        </HStack>
        <InviteInfo membership={membership}/>

      </Flex>
    </Box>
  )
}

const InvitesList = ({memberships, inviteStatus}:{memberships: Membership[], inviteStatus: inviteStatuses}) => {
  const { t } = useTranslation();
  const [membershipAux, setMembershipAux] = useState<Membership[]>(memberships);
  useEffect(()=>{
    setMembershipAux(memberships)
  },[inviteStatus])

  if(memberships.length === 0) return (<Text>{t("Invites.noInvites")}</Text>)
  return (<VStack width={'full'}>
    {membershipAux.map((membership) => {
      // if(membership.state === inviteStatus)
      
        return <InviteItem key={membership.id} membership={membership}/>
    })}

  </VStack>)
}

const Invites = () => {
  const { t } = useTranslation();
  const {userId} = useContext(AuthContext);
  const membershipService = useMembershipService();
  const navigate = useNavigate();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(()=>{
    if(!userId) return;
    serviceCall(
      membershipService.getUserMemberships({user: userId, state: inviteStatuses.PENDING}),
      navigate,
      ).then((response) => {
        if(!response.hasFailed()) {
          setIsLoading(false);
          setMemberships(response.getData().getContent());
          console.log(memberships)
        }
      })
    },[]
  )
  return (
    <SidenavLayout>
      <Text fontSize='2xl' fontWeight='bold' mb='4'>{t("Invites.Title")}</Text>
      {isLoading ? <Center mt={'15%'}><span className="loader"></span></Center> :
      <>  
        <InvitesList memberships={memberships} inviteStatus={inviteStatuses.PENDING} />
      </>}
    </SidenavLayout>
  )
}

export default Invites