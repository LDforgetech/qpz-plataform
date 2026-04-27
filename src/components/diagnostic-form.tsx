"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface DiagnosticFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export type Option = {
  id: number;
  text_option: string;
  question_id: number;
  assessment_type_id: number;
};

export type Question = {
  id: number;
  form_section_id: number;
  text_question: string;
  assessment_group_id: number;
  options: Option[];
};

export type FormSection = {
  id: number;
  section_title: string;
  description: string | null;
  questions: Question[];
};

const DiagnosticForm = ({ open, onOpenChange }: DiagnosticFormProps) => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // States para a API
  const [sections, setSections] = useState<FormSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Zod Schema dinâmico
  const [schema, setSchema] = useState<z.ZodObject<any, any>>(z.object({}));

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  // Função para buscar dados da API
  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Aqui você substitui pela chamada da sua API real
      const res = await fetch("http://localhost:8000/api/form");
      const data = await res.json();

      setSections(data);

      // Gerar schema do Zod baseado nas perguntas retornadas
      const schemaShape: Record<string, z.ZodTypeAny> = {};
      const defaultValues: Record<string, string> = {};

      data.forEach((section) => {
        section.questions.forEach((q) => {
          const fieldName = `question_${q.id}`;
          schemaShape[fieldName] = z
            .string({
              required_error: "Por favor, selecione uma opção.",
            })
            .min(1, "Por favor, selecione uma opção.");
          defaultValues[fieldName] = "";
        });
      });

      setSchema(z.object(schemaShape));
      reset(defaultValues); // Inicializar o formulário com campos vazios
    } catch (err) {
      setError("Falha ao carregar o formulário. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open && sections.length === 0) {
      fetchQuestions();
    }
  }, [open, sections.length]);

  const totalSteps = sections.length;
  const progress = totalSteps > 0 ? ((step + 1) / totalSteps) * 100 : 0;

  const handleNext = async () => {
    const currentSection = sections[step];
    // Validar apenas os campos da seção atual antes de avançar
    const fieldsToValidate = currentSection.questions.map(
      (q) => `question_${q.id}`,
    );
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      if (step < totalSteps - 1) {
        setStep(step + 1);
      } else {
        // Se for o último passo, o form submete através do handleSubmit(onSubmit)
        handleSubmit(onSubmit)();
      }
    } else {
      toast.error("Por favor, responda a todas as perguntas desta seção.");
    }
  };

  const handleBack = () => step > 0 && setStep(step - 1);

  const handleClose = (next: boolean) => {
    if (!next) {
      setTimeout(() => {
        setStep(0);
        setSubmitted(false);
      }, 300);
    }
    onOpenChange(next);
  };

  const onSubmit = (data: any) => {
    console.log("Respostas do Usuário:", data);
    setSubmitted(true);
    toast.success("Formulário concluído!", {
      description: "Suas respostas foram registradas com sucesso.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-black/60" />
      <DialogContent className="sm:max-w-[70vw] max-w-[90vw] p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-accent mb-4" />
            <p className="text-muted-foreground font-medium">
              Carregando perguntas...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h3 className="font-bold text-lg mb-2">Ops, algo deu errado</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchQuestions} variant="outline">
              Tentar novamente
            </Button>
          </div>
        ) : !submitted && sections.length > 0 ? (
          <>
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-6 shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-accent" />
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Avaliação
                </span>
              </div>
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-primary-foreground font-display text-xl text-left">
                  {sections[step].section_title}
                </DialogTitle>
                {sections[step].description && (
                  <DialogDescription className="text-primary-foreground/70 text-left">
                    {sections[step].description}
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-primary-foreground/70">
                  <span>
                    Página {step + 1} de {totalSteps}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress
                  value={progress}
                  className="h-1.5 bg-primary-foreground/20"
                />
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      SEÇÃO {sections[step].id}
                    </Badge>
                  </div>

                  {/* Renderizando as perguntas dinamicamente */}
                  {sections[step].questions.map((question) => {
                    const fieldName = `question_${question.id}`;
                    return (
                      <div
                        key={question.id}
                        className="space-y-4 bg-card/50 p-4 rounded-xl border border-border"
                      >
                        <Label className="text-base font-medium flex items-start gap-2">
                          <span className="text-accent font-bold">
                            {question.text_question}
                          </span>
                        </Label>

                        <Controller
                          name={fieldName}
                          control={control}
                          render={({ field }) => (
                            <RadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                              className="grid sm:grid-cols-2 gap-3"
                            >
                              {question.options.map((opt) => (
                                <Label
                                  key={opt.id}
                                  className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:border-accent transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/5"
                                >
                                  <RadioGroupItem value={opt.id.toString()} />
                                  <span className="text-sm font-normal">
                                    {opt.text_option}
                                  </span>
                                </Label>
                              ))}
                            </RadioGroup>
                          )}
                        />
                        {errors[fieldName] && (
                          <p className="text-sm text-destructive font-medium mt-1">
                            {errors[fieldName]?.message as string}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t border-border p-4 flex items-center justify-between gap-3 bg-card shrink-0">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={step === 0}
                className="text-muted-foreground"
              >
                <ArrowLeft size={16} />
                Voltar
              </Button>
              <Button
                onClick={handleNext}
                className="bg-accent text-accent-foreground hover:bg-gold-dark font-semibold"
              >
                {step === totalSteps - 1 ? "Finalizar" : "Continuar"}
                <ArrowRight size={16} />
              </Button>
            </div>
          </>
        ) : (
          // Tela de sucesso
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-10 text-center"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-accent/15 flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="text-accent" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Respostas enviadas!
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
              Recebemos seus dados com sucesso. (Confira o console do
              navegador).
            </p>
            <Button
              size="lg"
              onClick={() => handleClose(false)}
              className="bg-primary text-primary-foreground hover:bg-navy-light w-full sm:w-auto"
            >
              Fechar
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DiagnosticForm;
