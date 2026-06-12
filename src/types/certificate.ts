// types/certificate.ts — Tipagens do endpoint de certificados e progresso

export type CertificateInfo = {
  uuid: string;
  validation_code: string;
  pdf_url: string;
};

export type CertificateAndProgress = {
  id: string;
  courseTitle: string;
  courseId: number;
  progress: number;
  issuedAt: string | null;
  status: "completed" | "in_progress" | "not_started";
  certificate: CertificateInfo | null;
};

export type CertificatesResponse = {
  data: CertificateAndProgress[];
};
