import type {
  IApiCredential,
  IInsertApiCredential,
} from "../models/IApiCredential.ts";

export interface IApiCredentialRepository {
  findById(id: string): Promise<IApiCredential | null>;
  findByStoreId(storeId: string): Promise<IApiCredential[]>;
  findByCreatedByUserId(userId: string): Promise<IApiCredential[]>;
  findByCredentialType(
    credentialType: "jwt" | "oauth2"
  ): Promise<IApiCredential[]>;
  findActiveCredentials(storeId?: string): Promise<IApiCredential[]>;
  findExpiredCredentials(): Promise<IApiCredential[]>;
  findByStoreAndType(
    storeId: string,
    credentialType: "jwt" | "oauth2"
  ): Promise<IApiCredential[]>;
  updateLastUsedAt(id: string): Promise<void>;
  deactivateCredential(id: string): Promise<IApiCredential>;
  create(credentialData: IInsertApiCredential): Promise<IApiCredential>;
  update(
    id: string,
    credentialData: IInsertApiCredential
  ): Promise<IApiCredential>;
  delete(id: string): Promise<void>;
  deleteByStoreId(storeId: string): Promise<void>;
}
