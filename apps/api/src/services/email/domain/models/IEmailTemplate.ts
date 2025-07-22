export interface IEmailTemplate {
	to: string;
	subject: string;
	htmlContent: string;
	textContent?: string;
}
