"use client";

import { useCallback } from "react";
import {
  getAllUsers,
  createUser,
  updateUserRole,
  deleteUser,
} from "@/app/actions/user.action";
import type {
  Profile,
  RolUsuario,
  ProfileDB,
  CreateUserPayload,
  ProfileWithEmail,
} from "@/types";

export function useUserData() {
  const getUsers = useCallback(async (): Promise<ProfileWithEmail[]> => {
    const data = await getAllUsers();
    return data ?? [];
  }, []);

  const create = useCallback(
    async (input: CreateUserPayload): Promise<{ message: string }> => {
      const created = await createUser(input);
      return created;
    },
    []
  );

  const update = useCallback(
    async (
      id: string,
      input: { role: RolUsuario; is_active: boolean }
    ): Promise<Profile> => {
      const updated = await updateUserRole(id, input);
      return updated;
    },
    []
  );

  const remove = useCallback(async (id: string): Promise<void> => {
    await deleteUser(id);
  }, []);

  return {
    getUsers,
    create,
    update,
    remove,
  };
}
