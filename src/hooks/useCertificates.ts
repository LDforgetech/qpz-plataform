import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  CertificateAndProgress,
  CertificatesResponse,
} from "@/types/certificate";

export function useCertificates() {
  return useQuery<CertificateAndProgress[]>({
    queryKey: ["certificates"],
    queryFn: async () => {
      const res = await api.get<CertificatesResponse>(
        "student/certificates-and-progress",
      );
      return res.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}
