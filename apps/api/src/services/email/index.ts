export type { IEmailService } from "./domain/ports/IEmailService.ts";
export type { IEmailTemplate } from "./domain/ports/IEmailTemplate.ts";
export type { IPlatformAcceptanceData } from "./domain/ports/IPlatformAcceptanceData.ts";
export type { IPlatformRejectionData } from "./domain/ports/IPlatformRejectionData.ts";
export type { IRegistrationConfirmationData } from "./domain/ports/IRegistrationConfirmationData.ts";

export { ResendEmailService } from "./adapters/ResendEmailService.ts";
export type { ResendEmailServiceConfig } from "./adapters/ResendEmailService.ts";
