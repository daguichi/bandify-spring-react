import { createContext, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import MembershipService from "../services/MembershipService";
import MembershipApiTest from "../api/MembershipApi";
import UserApi from "../api/UserApi";

const MembershipServiceContext = createContext<MembershipService>(null!);

export const useMembershipService = () => useContext(MembershipServiceContext);

export const MembershipServiceProvider = ( { children }: { children: React.ReactNode }) => {
    const axiosPrivate = useAxiosPrivate();

    const membershipApi = new MembershipApiTest(axiosPrivate);
    const userApi = new UserApi(axiosPrivate);
    const membershipService = new MembershipService(membershipApi, userApi);

    return (
        <MembershipServiceContext.Provider value={membershipService} >
            {children}
        </MembershipServiceContext.Provider>
    )
}