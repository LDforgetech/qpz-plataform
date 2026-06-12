"use client";
import { Calendar, Eye, FileCheck, Loader2, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCertificates } from "@/hooks/useCertificates";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function buildLinkedInUrl(cert: {
  courseTitle: string;
  issuedAt: string | null;
  certificate: { validation_code: string; pdf_url: string } | null;
}): string | null {
  if (!cert.certificate || !cert.issuedAt) return null;

  const d = new Date(cert.issuedAt);
  const params = new URLSearchParams({
    startTask: "quatropontozero-rh",
    name: cert.courseTitle,
    organizationId: "80841152",
    issueMonth: String(d.getMonth() + 1),
    issueYear: String(d.getFullYear()),
    certId: cert.certificate.validation_code,
    certUrl: cert.certificate.pdf_url,
  });

  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

const Certificates = () => {
  const { data: certificates, isLoading, isError } = useCertificates();

  const completed = certificates?.filter((c) => c.status === "completed") ?? [];
  const inProgress =
    certificates?.filter((c) => c.status === "in_progress") ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl w-full mx-auto p-4 md:p-8">
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Não foi possível carregar seus certificados. Tente novamente mais
            tarde.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          Meus Certificados
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-xl">
          Acompanhe seu progresso e baixe os certificados dos cursos concluídos.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <FileCheck size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {completed.length}
                </p>
                <p className="text-xs text-muted-foreground">Concluídos</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <FileCheck size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {inProgress.length}
                </p>
                <p className="text-xs text-muted-foreground">Em andamento</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Completed certificates */}
      {completed.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <FileCheck size={18} className="text-emerald-500" />
                Certificados concluídos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completed.map((cert) => (
                <div
                  key={cert.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl border border-border p-4 bg-card/50 hover:bg-card transition-colors"
                >
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground truncate">
                        {cert.courseTitle}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10"
                      >
                        Concluído
                      </Badge>
                      {cert.certificate && (
                        <Badge
                          variant="outline"
                          className="text-xs text-muted-foreground"
                        >
                          {cert.certificate.validation_code}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        Emitido em {formatDate(cert.issuedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {cert.certificate?.pdf_url && (
                      <>
                        <Button size="sm" variant="outline" className="">
                          <Link
                            href={cert.certificate.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-2 flex items-center"
                          >
                            <Eye size={14} />
                            Visualizar
                          </Link>
                        </Button>
                      </>
                    )}
                    {(() => {
                      const linkedInUrl = buildLinkedInUrl(cert);
                      return linkedInUrl ? (
                        <Button size="sm" variant="outline" className="gap-2">
                          <a
                            href={linkedInUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <svg
                              height="14"
                              width="14"
                              viewBox="0 0 72 72"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g fill="none" fillRule="evenodd">
                                <path
                                  d="M8,72 L64,72 C68.418278,72 72,68.418278 72,64 L72,8 C72,3.581722 68.418278,-8.11624501e-16 64,0 L8,0 C3.581722,8.11624501e-16 -5.41083001e-16,3.581722 0,8 L0,64 C5.41083001e-16,68.418278 3.581722,72 8,72 Z"
                                  fill="#007EBB"
                                />
                                <path
                                  d="M62,62 L51.315625,62 L51.315625,43.8021149 C51.315625,38.8127542 49.4197917,36.0245323 45.4707031,36.0245323 C41.1746094,36.0245323 38.9300781,38.9261103 38.9300781,43.8021149 L38.9300781,62 L28.6333333,62 L28.6333333,27.3333333 L38.9300781,27.3333333 L38.9300781,32.0029283 C38.9300781,32.0029283 42.0260417,26.2742151 49.3825521,26.2742151 C56.7356771,26.2742151 62,30.7644705 62,40.051212 L62,62 Z M16.349349,22.7940133 C12.8420573,22.7940133 10,19.9296567 10,16.3970067 C10,12.8643566 12.8420573,10 16.349349,10 C19.8566406,10 22.6970052,12.8643566 22.6970052,16.3970067 C22.6970052,19.9296567 19.8566406,22.7940133 16.349349,22.7940133 Z M11.0325521,62 L21.769401,62 L21.769401,27.3333333 L11.0325521,27.3333333 L11.0325521,62 Z"
                                  fill="#FFF"
                                />
                              </g>
                            </svg>
                            Linkedin
                          </a>
                        </Button>
                      ) : null;
                    })()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.section>
      )}

      {/* In progress */}
      {inProgress.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <FileCheck size={18} className="text-amber-500" />
                Em andamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {inProgress.map((cert) => (
                <div
                  key={cert.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-border p-4 bg-card/50"
                >
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground truncate">
                        {cert.courseTitle}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/10"
                      >
                        {cert.progress}%
                      </Badge>
                    </div>
                    <Progress value={cert.progress} className="h-2" />
                  </div>
                  <Button size="sm" className="shrink-0 gap-2">
                    <Link
                      href={`/curso/${cert.courseId}/aulas`}
                      className="flex items-center gap-2"
                    >
                      <Play size={14} />
                      Continuar
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.section>
      )}
    </div>
  );
};
export default Certificates;
