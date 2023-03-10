import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    GridItem,
    Heading,
    HStack,
    Input,
    SimpleGrid,
    Stack,
    Text,
    Textarea,
    useColorModeValue,
    Center,
    useToast, Image
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {editOptions, editOptionsES} from "./validations"
import {
  Select,
  GroupBase,
} from "chakra-react-select";
import { LocationGroup, GenreGroup, RoleGroup, AvailableGroup } from "./EntitiesGroups";
import React, {useContext, useEffect, useState} from "react";
import { serviceCall } from "../../services/ServiceManager";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import {User} from "../../models";
import {useUserService} from "../../contexts/UserService";
import {useGenreService} from "../../contexts/GenreService";
import {useRoleService} from "../../contexts/RoleService";
import {useLocationService} from "../../contexts/LocationService";
import {UserUpdateInput} from "../../api/types/User";
import { Helmet } from "react-helmet";

interface FormData {
  name: string;
  surname: string;
  description: string;
  location: string;
  genres: string[];
  roles: string[];
  available: boolean;
  image: FileList;
}

const EditArtist = () => {
  const { t } = useTranslation();
  const locationService = useLocationService();
  const roleService = useRoleService();
  const genreService = useGenreService();
  const userService = useUserService();
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const [locationOptions, setLocationOptions] = useState<LocationGroup[]>([]);
  const [genreOptions, setGenreOptions] = useState<GenreGroup[]>([]);
  const [roleOptions, setRoleOptions] = useState<RoleGroup[]>([]);
  const navigate = useNavigate();
  const [location, setLocation] = useState<LocationGroup>();
  const [genres, setGenres] = useState<GenreGroup[]>([]);
  const [roles, setRoles] = useState<RoleGroup[]>([]);
  const [available, setAvailable] = useState<AvailableGroup>();
  const { userId } = useContext(AuthContext);
  const [userImg, setUserImg] = useState<string | undefined>(undefined);
  const bg19=useColorModeValue("white", "gray.900");
  const bg27 = useColorModeValue("gray.200", "gray.700");
  const toast = useToast();
  const options = localStorage.getItem('i18nextLng') === 'es' ? editOptionsES : editOptions;
  const filterAvailable = require(`../../images/available.png`);


  const onCancel = () => {
    navigate(-1);
  };

  const availableOptions = [
    { value: true, label: t("Edit.availableTrue") },
    { value: false, label: t("Edit.availableFalse")},
  ];

  useEffect(() => {
    serviceCall(
      genreService.getGenres(),
      navigate,
      (genres) => {
        const genreAux: GenreGroup[] = genres.map((genre) => {
          return { value: genre.name, label: genre.name };
        });
        setGenreOptions(genreAux);
      }

    )

    serviceCall(
      roleService.getRoles(),
      navigate,
      (roles) => {
        const roleAux: RoleGroup[] = roles.map((role) => {
          return { value: role.name, label: role.name };
        });
        setRoleOptions(roleAux);
      }
    )

    serviceCall(
      locationService.getLocations(),
      navigate,
      (locations) => {
        const locationAux: LocationGroup[] = locations.map((location) => {
          return { value: location.name, label: location.name };
        });
        setLocationOptions(locationAux);
      }
    )
  }, []);

  useEffect(() => {
    serviceCall(
          userService.getUserById(Number(userId)),
          navigate,
          (user) => {
              setUser(user)
              setUserImg(user.profileImage)
              setLocation({label:user.location, value:user.location} as LocationGroup)
              setGenres(user.genres.map(r => {return {value: r, label: r}}))
              setRoles(user.roles.map(r => {return {value: r, label: r}}))
              setAvailable(user.available ? {value:true, label:t("Edit.availableTrue")} as AvailableGroup : {value:false, label:t("Edit.availableFalse")} as AvailableGroup)
              setIsLoading(false)
          }
    )
  }, [userService]);

    const handlePicture = (image: Blob) => {
        setUserImg(URL.createObjectURL(image));
    };


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

    const isValidForm = (data: FormData) => {
        if (!location || !location.value) {
            toast({
                title: t("EditAudition.locationRequired"),
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            return false;
        }

        if (roles.length > 15) {
            toast({
                title: t("EditAudition.maxRoles"),
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            return false;
        }

        if(genres.length > 15) {
            toast({
                title: t("EditAudition.maxGenres"),
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            return false;
        }

        return true;
    }


  const onSubmit = async (data: FormData) => {
      if (!isValidForm(data)) return;
      const userInput: UserUpdateInput = {
          name: data.name,
          surname: data.surname,
          description: data.description,
          location: location!.value,
          genres: genres.map((genre) => genre.value),
          roles: roles.map((role) => role.value),
          available: available!.value,
      }
      if(data.image && data.image[0]) {
          serviceCall(
              userService.updateUserProfileImage(Number(userId), data.image[0]),
              navigate,
              () => {
              }
          ).then((response) => {
              if(response.hasFailed()){
                  toast({
                      title: t("Register.error"),
                      status: "error",
                      description: t("Edit.error"),
                      isClosable: true,
                  })
              }
          })
      }
      serviceCall(
          userService.updateUser(Number(userId), userInput),
          navigate,
          () => {
          }
      ).then((response) => {
          if(response.hasFailed()){
              toast({
                  title: t("Register.error"),
                  status: "error",
                  description: t("Edit.error"),
                  isClosable: true,
              })
          } else {
              toast({
                  title: t("Register.success"),
                  status: "success",
                  description: t("Edit.success"),
                  isClosable: true,
              })
              navigate("/profile");
          }
      })
  };

  return (
    <>
    <Helmet>
          <title>{t("Profile.edit")}</title>
    </Helmet>
    <Box
    rounded={"lg"}
    bg={bg19}
    p={10}
    m={10}
  >
        {isLoading ? <Center mt={'15%'}><span className="loader"></span></Center> :(
    <Box>
      <SimpleGrid
        display={{
          base: "initial",
          md: "grid",
        }}
        columns={{
          md: 3,
        }}
        spacing={{
          md: 6,
        }}
      >
        <GridItem
            colSpan={{
              md: 1,
            }}
        >
          <Box px={[4, 0]}>
            <Heading fontSize={'x-large'} fontWeight="bold" lineHeight="6">
              {t("Edit.title")}
            </Heading>
            <Text
                mt={1}
                fontSize="lg"
                color="gray.600"
                _dark={{
                  color: "gray.400",
                }}
            >
              {t("Edit.subtitle")}
            </Text>
          </Box>
        </GridItem>
        <GridItem
          mt={[5, null, 0]}
          colSpan={{
            md: 2,
          }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
          >
            <Stack
              bg={bg19}
              border={'1px'}
              borderColor={bg27}
              px={4}
              py={5}
              roundedTop={'md'}
              spacing={6}
              p={{
                sm: 6,
              }}
            >

              <HStack>
                <Box flex={1}>
                  <FormControl
                    id="name"
                    isRequired
                    isInvalid={Boolean(errors.name)}
                  >
                    <FormLabel fontSize={16} fontWeight="bold">
                      {t("Edit.name")}
                    </FormLabel>
                    <Input
                      type="text"
                      maxLength={options.name.maxLength.value}
                      placeholder={t("EditAudition.titlePlaceholder")}
                      defaultValue={user?.name}
                      {...register("name", options.name)}
                    />
                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                  </FormControl>
                </Box>
                <Box flex={1}>
                  <FormControl
                    id="surname"
                    isRequired
                    isInvalid={Boolean(errors.surname)}
                  >
                    <FormLabel fontSize={16} fontWeight="bold">
                      {t("Edit.surname")}
                    </FormLabel>
                    <Input
                      type="text"
                      maxLength={options.surname.maxLength.value}
                      placeholder={t("EditAudition.titlePlaceholder")}
                      defaultValue={user?.surname}
                      {...register("surname", options.surname)}
                    />
                    <FormErrorMessage>{errors.surname?.message}</FormErrorMessage>
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="description" mt={1} isInvalid={Boolean(errors.description)}>
                <FormLabel
                  fontSize={16} fontWeight="bold"
                >
                  {t("Edit.description")}
                </FormLabel>
                <Textarea
                  mt={1}
                  rows={3}
                  maxLength={options.description.maxLength.value}
                  shadow="sm"
                  defaultValue={user?.description}
                  placeholder={t("Edit.descriptionPlaceholder")}
                  {...register("description", options.description)}
                />
                  <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
              </FormControl>

              <FormControl id="image" isInvalid={Boolean(errors.image)}>
                <FormLabel
                  fontSize={16} fontWeight="bold"
                >
                  {t("Edit.picture")}
                </FormLabel>
                <Flex alignItems="center" mt={1}>
                    <Flex>
                    <Image
                        src={userImg}
                        alt={t("Alts.profilePicture")}
                        borderRadius="full"
                        boxSize={40}
                        mr={8}
                        objectFit={'cover'}
                        shadow="lg"
                        _dark={{
                            borderColor: "gray.200",
                            backgroundColor: "white"
                        }}
                    />
                    {available!.value ? <Image
                        src={filterAvailable}
                        alt={t("Alts.available")}
                        boxSize="150px"
                        ml={0.7}
                        mt={1.4}
                        borderRadius="full"
                        position={"absolute"}
                        /> : <></>
                    }
                    </Flex>
                    <Flex>
                        <Stack>
                            <Input
                                variant="unstyled"
                                type="file"
                                style={{cursor: "pointer"}}
                                accept='image/png, image/jpeg'
                                onInput={(event) => {
                                    if(event.currentTarget.files)
                                        handlePicture(event.currentTarget.files[0]);
                                }}
                                {...register('image',  {
                                    validate: {
                                        size: (image) =>
                                            image && image[0] && image[0].size / (1024 * 1024) < 1,
                                    },
                                })}
                            />
                            {errors.image?.type === 'size' && (
                                <FormErrorMessage>{options.image?.size.message}</FormErrorMessage>
                            )}
                        </Stack>
                    </Flex>
                </Flex>
              </FormControl>
              <FormControl>
                <FormLabel fontSize={16} fontWeight="bold">{t("Edit.available")}</FormLabel>
                <Select
                    name="available"
                    options={availableOptions}
                    closeMenuOnSelect={false}
                    variant="filled"
                    tagVariant="solid"
                    defaultValue={available}
                    onChange={(selection) => {
                      if(selection)
                        setAvailable(selection);
                    }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize={16} fontWeight="bold">{t("Edit.location")}</FormLabel>
                <Select<LocationGroup, false, GroupBase<LocationGroup>>
                  name="locations"
                  options={locationOptions}
                  placeholder={t("AuditionSearchBar.locationPlaceholder")}
                  closeMenuOnSelect={true}
                  variant="filled"
                  tagVariant="solid"
                  defaultValue={location}
                  onChange={(loc) => {
                    setLocation(loc!);
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize={16} fontWeight="bold" >{t("Edit.genreArtist")}</FormLabel>
                <Select<GenreGroup, true, GroupBase<GenreGroup>>
                  isMulti
                  name="genres"
                  options={genreOptions}
                  placeholder={t("Edit.genrePlaceholder")}
                  closeMenuOnSelect={false}
                  variant="filled"
                  tagVariant="solid"
                  defaultValue={genres}
                  onChange={(event) => {
                    setGenres(event.flatMap((e) => e));
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize={16} fontWeight="bold" >{t("Edit.roleArtist")}</FormLabel>
                <Select<RoleGroup, true, GroupBase<RoleGroup>>
                  isMulti
                  name="roles"
                  options={roleOptions}
                  placeholder={t("Edit.rolePlaceholder")}
                  closeMenuOnSelect={false}
                  variant="filled"
                  tagVariant="solid"
                  defaultValue={roles}
                  onChange={(event) => {
                    setRoles(event.flatMap((e) => e));
                  }}
                />
              </FormControl>
            </Stack>
            <Box
              bg={bg19}
              border={'1px'}
              borderColor={bg27}
              roundedBottom={'md'}
              px={{
                base: 4,
                sm: 6,
              }}
              py={3}

              textAlign="right"
            >
              <Button
                type="submit"
                mr={4}
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                _focus={{
                  shadow: "",
                }}
                fontWeight="md"
              >
                {t("Button.save")}
              </Button>
              <Button
                  bg={"gray.400"}
                  color={"white"}
                  _hover={{
                    bg: "gray.500",
                  }}
                  _focus={{
                    shadow: "",
                  }}
                  fontWeight="md"
                  onClick={onCancel}
              >
                {t("Button.cancel")}
              </Button>
            </Box>
          </form>
        </GridItem>
      </SimpleGrid>

    </Box>
        )}
  </Box>
  </>);
}

export default EditArtist