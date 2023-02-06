import MembershipApi from "../api/MembershipApi";
import RoleApi from "../api/RoleApi";
import ApiResult from "../api/types/ApiResult";
import PostResponse from "../api/types/PostResponse";
import { User } from "../api/types/User";
import UserApi from "../api/UserApi";
import Membership from "../models/Membership";
import { ErrorService } from "./ErrorService";

interface Params {
    userId: number;
    state?: string;
    preview?: boolean;
}


interface PostParams {
    userId: number;
    roles: string[];
    description: string;
}

export default class MembershipService {

    private membershipApi: MembershipApi;
    private roleApi: RoleApi;
    private userApi: UserApi;

    constructor(membershipApi: MembershipApi, roleApi: RoleApi,
        userApi: UserApi) {
        this.membershipApi = membershipApi;
        this.roleApi = roleApi;
        this.userApi = userApi;
    }

    public async getMembershipById(id: number): Promise<ApiResult<Membership>> {
        try {
            const currentMembership = await this.membershipApi.getMembershipById(id);
            const membershipRoles = await this.roleApi.getRoles({ membershipId: currentMembership.id });
            const roles: string[] = membershipRoles.map((role) => role.roleName);
            const artist: User = await this.userApi.getUserById(currentMembership.artistId);
            const band: User = await this.userApi.getUserById(currentMembership.bandId);

            return new ApiResult(
                {
                    id: currentMembership.id,
                    artist: artist,
                    band: band,
                    description: currentMembership.description,
                    roles: roles,
                    state: currentMembership.state
                } as Membership,
                false,
                null as any
            );
        } catch (error: any) {
            return ErrorService.returnApiError(error);
        }
    }

    public async getUserMemberships(params: Params): Promise<ApiResult<Membership[]>> {
        try {
            const membershipList = await this.membershipApi.getUserMemberships(params);
            let memberships: Membership[] = [];
            for await (const membership of membershipList) {
                const membershipRoles = await this.roleApi.getRoles({ membershipId: membership.id });
                const roles: string[] = membershipRoles.map((role) => role.roleName);
                const artist: User = await this.userApi.getUserById(membership.artistId);
                const band: User = await this.userApi.getUserById(membership.bandId);
                memberships.push(
                    {
                        id: membership.id,
                        artist: artist,
                        band: band,
                        description: membership.description,
                        roles: roles,
                        state: membership.state
                    } as Membership
                )
            }
            return new ApiResult(
                memberships,
                false,
                null as any
            )
        } catch (error: any) {
            return ErrorService.returnApiError(error);
        }
    }

    public async inviteToBand(params: PostParams): Promise<ApiResult<PostResponse>> {

        try {
            const postResponse = await this.membershipApi.inviteToBand(params);
            const url: string = postResponse.headers!.location!;
            const tokens = url.split('/')
            const id: number = parseInt(tokens[tokens.length - 1]);
            const data: PostResponse = { url: url, id: id };
            return new ApiResult(
                data,
                false,
                null as any
            );
        } catch (error: any) {
            return ErrorService.returnApiError(error);
        }

    }
}