import type { UseFetchOptions } from "nuxt/app";
import type { UserItem } from "~/data/users";
import { useResource, type ResourceResponse } from "./useResource";
import type { QueryParams } from "./useTableQuery";

export { type UpdateSortPayload } from "./useResource";

export const useUsers = (
  initialParams?: Partial<QueryParams<UserItem>>,
  options?: UseFetchOptions<ResourceResponse<UserItem>>
) => {
  return useResource("/api/users", initialParams, options);
};

