import { useRef, useState } from "react";
import FormWizard from "./FormWizard.jsx";
import CallbackForm from "./CallbackForm.jsx";

/**
 * SurveyWithGate
 * -----------------------------------------------------------------------
 * Wires the reusable FormWizard to a CMS-driven survey and adds the
 * constant lead-capture gate in front of the results. Phase transitions
 * (survey -> gate -> results) reuse the same view-transition-name so the
 * whole flow animates consistently, not just the in-wizard steps.
 *
 * `survey` is whatever your DatoCMS query returns for one Survey record,
 * already mapped to FormWizard's question shape (see mapDatoQuestions
 * below for the mapping from raw DatoCMS blocks).
 * -----------------------------------------------------------------------
 */
export default function SurveyWithGate({ survey, onLeadSubmit }) {
  const [phase, setPhase] = useState("survey"); // "survey" | "gate" | "results"
  const [answers, setAnswers] = useState({});
  const containerRef = useRef(null);

  function transitionTo(nextPhase) {
    const run = () => setPhase(nextPhase);
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      document.startViewTransition(run);
    } else {
      run();
    }
  }

  function handleSurveyComplete(finalAnswers) {
    setAnswers(finalAnswers);
    transitionTo("gate");
  }

  async function handleLeadSubmit(leadDetails) {
    // Send the lead + their survey answers to your Worker/D1 endpoint here.
    await onLeadSubmit?.({ lead: leadDetails, answers });
    transitionTo("results");
  }

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-lg">
      {phase === "survey" && (
        <FormWizard
          questions={survey.questions}
          onComplete={handleSurveyComplete}
          showCompletion={false}
          submitLabel="See my results"
        />
      )}

      {phase === "gate" && (
        <CallbackForm
          onSubmit={handleLeadSubmit}
          heading={survey.gateHeading ?? "One last step"}
          description={
            survey.gateDescription ??
            "Pop in your details and we'll unlock your results."
          }
        />
      )}

      {phase === "results" && (
        <div className="fw-step rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            {survey.resultsHeading ?? "Your results"}
          </h2>
          <ul className="mt-4 space-y-3">
            {survey.questions.map((q) => (
              <li key={q.id} className="text-sm">
                <span className="block font-medium text-slate-700">
                  {q.label}
                </span>
                <span className="text-slate-500">
                  {Array.isArray(answers[q.id])
                    ? answers[q.id].join(", ")
                    : String(answers[q.id] ?? "—")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Maps a raw DatoCMS `survey.questions` array (SurveyQuestionRecord blocks,
 * each possibly with nested SurveyOptionRecord blocks) into the shape
 * FormWizard expects. Adjust the `__typename` checks to match your project
 * prefix if you rename the models.
 */
export function mapDatoQuestions(rawQuestions) {
  return rawQuestions.map((q) => ({
    id: q.id,
    type: q.type, // "text" | "textarea" | "radio" | "checkbox" | "select"
    label: q.label,
    description: q.description ?? undefined,
    placeholder: q.placeholder ?? undefined,
    required: q.required ?? false,
    options: q.options?.map((opt) => ({
      label: opt.label,
      value: opt.value,
    })),
  }));
}
