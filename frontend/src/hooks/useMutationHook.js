import { useMutation } from "@tanstack/react-query";
import * as UserSerVice from "../services/UserService"

export const useMutationHook = (fnCallback) => {
    const mutation = useMutation({
        mutationFn: fnCallback
      });
    return mutation
};
