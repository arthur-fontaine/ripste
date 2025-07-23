export type { IEmailService } from "./domain/ports/IEmailService.ts";
export type { IEmailTemplate } from "./domain/models/IEmailTemplate.ts";
export type { IPlatformAcceptanceData } from "./domain/models/IPlatformAcceptanceData.ts";
export type { IPlatformRejectionData } from "./domain/models/IPlatformRejectionData.ts";
export type { IRegistrationConfirmationData } from "./domain/models/IRegistrationConfirmationData.ts";

export { ResendEmailService } from "./adapters/ResendEmailService.ts";
export type { ResendEmailServiceConfig } from "./adapters/ResendEmailService.ts";
