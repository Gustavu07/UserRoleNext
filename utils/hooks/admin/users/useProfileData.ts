// @/utils/hooks/useProfilesData.ts
"use client";

import { useCallback } from "react";
import {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
} from "@/app/actions/profile/profiles.actions";
import type { Profile } from "@/types";

export type ProfileInput = Omit<Profile, "id" | "created_at">;
export function useProfilesData() {
  const getProfiles = useCallback(async (): Promise<Profile[]> => {
    try {
      const data = await getAllProfiles();
      return data ?? [];
    } catch (error) {
      console.error("Error al obtener perfiles:", error);
      return [];
    }
  }, []);

  const createUserProfile = useCallback(
    async (input: ProfileInput): Promise<Profile | null> => {
      try {
        const created = await createProfile(input);
        return created;
      } catch (error) {
        console.error("Error al crear perfil:", error);
        return null;
      }
    },
    []
  );

  const updateUserProfile = useCallback(
    async (
      id: string,
      input: Partial<ProfileInput>
    ): Promise<Profile | null> => {
      try {
        const updated = await updateProfile(id, input);
        return updated;
      } catch (error) {
        console.error("Error al actualizar perfil:", error);
        return null;
      }
    },
    []
  );

  const deleteUserProfile = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await deleteProfile(id);
        return true;
      } catch (error) {
        console.error("Error al eliminar perfil:", error);
        return false;
      }
    },
    []
  );

  const getProfileByIdClient = useCallback(
    async (id: string): Promise<Profile | null> => {
      try {
        const profile = await getProfileById(id);
        return profile;
      } catch (error) {
        console.error("Error al obtener perfil por ID:", error);
        return null;
      }
    },
    []
  );

  return {
    getProfiles,
    getProfileByIdClient,
    createUserProfile,
    updateUserProfile,
    deleteUserProfile,
  };
}
