import { useRef, useState } from "react";

/**
 * FormWizard
 * -----------------------------------------------------------------------
 * Reusable, data-driven survey/form wizard. Shows one question at a time
 * and animates between steps using the native CSS View Transitions API
 * (document.startViewTransition) — no animation library required.
 *
 * Falls back gracefully (instant swap, no animation) in browsers that
 * don't support View Transitions yet (Firefox, older Safari).
 *
 * -----------------------------------------------------------------------
 * QUESTION SHAPE
 * {
 *   id: string,                 // unique key, used to store the answer
 *   type: "text" | "textarea" | "radio" | "checkbox" | "select",
 *   label: string,               // question text
 *   description?: string,        // optional helper text
 *   placeholder?: string,        // for text/textarea
 *   required?: boolean,
 *   options?: { label: string, value: string }[], // radio/checkbox/select
 * }
 *
 * USAGE
 * <FormWizard
 *   questions={questions}
 *   onComplete={(answers) => console.log(answers)}
 * />
 * -----------------------------------------------------------------------
 */

const supportsViewTransitions =
  typeof document !== "undefined" && "startViewTransition" in document;

export default function FormWizard({
  questions,
  onComplete,
  submitLabel = "Submit",
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const containerRef = useRef(null);

  const total = questions.length;
  const question = questions[index];
  const isLast = index === total - 1;

  function setDirection(dir) {
    // Read by the CSS below to pick the right slide-in/slide-out keyframes.
    containerRef.current?.setAttribute("data-direction", dir);
  }

  function runTransition(dir, updateFn) {
    setDirection(dir);
    if (supportsViewTransitions) {
      document.startViewTransition(() => {
        updateFn();
      });
    } else {
      updateFn();
    }
  }

  function validate(q, value) {
    if (!q.required) return "";
    const empty =
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);
    return empty ? "This question needs an answer before you continue." : "";
  }

  function goNext() {
    const value = answers[question.id];
    const validationError = validate(question, value);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");

    if (isLast) {
      runTransition("forward", () => setDone(true));
      onComplete?.(answers);
      return;
    }
    runTransition("forward", () => setIndex((i) => i + 1));
  }

  function goBack() {
    if (index === 0) return;
    setError("");
    runTransition("backward", () => setIndex((i) => i - 1));
  }

  function updateAnswer(value) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    if (error) setError("");
  }

  function toggleCheckbox(value) {
    const current = Array.isArray(answers[question.id])
      ? answers[question.id]
      : [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateAnswer(next);
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <style>{`
        /* Name the step region so the browser captures before/after
           snapshots of it specifically, instead of the whole page. */
        .fw-step {
          view-transition-name: fw-step;
        }

        @keyframes fw-slide-out-back {
          to { transform: translateX(24px); opacity: 0; }
        }
        @keyframes fw-slide-in-back {
          from { transform: translateX(-24px); opacity: 0; }
        }
        @keyframes fw-slide-out-fwd {
          to { transform: translateX(-24px); opacity: 0; }
        }
        @keyframes fw-slide-in-fwd {
          from { transform: translateX(24px); opacity: 0; }
        }

        /* Forward navigation: old step exits left, new step enters from right. */
        [data-direction="forward"]::view-transition-old(fw-step) {
          animation: 260ms ease-in both fw-slide-out-fwd;
        }
        [data-direction="forward"]::view-transition-new(fw-step) {
          animation: 320ms ease-out both fw-slide-in-fwd;
        }

        /* Backward navigation: reversed. */
        [data-direction="backward"]::view-transition-old(fw-step) {
          animation: 260ms ease-in both fw-slide-out-back;
        }
        [data-direction="backward"]::view-transition-new(fw-step) {
          animation: 320ms ease-out both fw-slide-in-back;
        }

        @media (prefers-reduced-motion: reduce) {
          ::view-transition-group(*),
          ::view-transition-old(*),
          ::view-transition-new(*) {
            animation: none !important;
          }
        }
      `}</style>

      <div ref={containerRef}>
        {!done ? (
          <>
            {/* Progress */}
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                <span>
                  Question {index + 1} of {total}
                </span>
                <span>{Math.round(((index + 1) / total) * 100)}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200">
                <div
                  className="h-1.5 rounded-full bg-indigo-600 transition-[width] duration-300 ease-out"
                  style={{ width: `${((index + 1) / total) * 100}%` }}
                />
              </div>
            </div>

            {/* Step content — re-keyed per question so React unmounts/remounts,
                which gives the view transition a clean before/after snapshot. */}
            <div key={question.id} className="fw-step">
              <fieldset className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <legend className="mb-1 text-lg font-semibold text-slate-900">
                  {question.label}
                  {question.required && (
                    <span className="ml-1 text-indigo-600">*</span>
                  )}
                </legend>
                {question.description && (
                  <p className="mb-4 text-sm text-slate-500">
                    {question.description}
                  </p>
                )}

                <div className="mt-4">
                  <QuestionField
                    question={question}
                    value={answers[question.id]}
                    onChange={updateAnswer}
                    onToggleCheckbox={toggleCheckbox}
                  />
                </div>

                {error && (
                  <p role="alert" className="mt-3 text-sm text-red-600">
                    {error}
                  </p>
                )}
              </fieldset>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={goBack}
                disabled={index === 0}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goNext}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isLast ? submitLabel : "Next"}
              </button>
            </div>
          </>
        ) : (
          <div className="fw-step rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Thanks — your answers are in.
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              You completed all {total} questions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionField({ question, value, onChange, onToggleCheckbox }) {
  switch (question.type) {
    case "text":
      return (
        <input
          type="text"
          value={value ?? ""}
          placeholder={question.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />
      );

    case "textarea":
      return (
        <textarea
          value={value ?? ""}
          placeholder={question.placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />
      );

    case "select":
      return (
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <option value="" disabled>
            Choose an option
          </option>
          {question.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case "radio":
      return (
        <div className="space-y-2">
          {question.options?.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50"
            >
              <input
                type="radio"
                name={question.id}
                value={opt.value}
                checked={value === opt.value}
                onChange={(e) => onChange(e.target.value)}
                className="h-4 w-4 accent-indigo-600"
              />
              <span className="text-sm text-slate-800">{opt.label}</span>
            </label>
          ))}
        </div>
      );

    case "checkbox":
      return (
        <div className="space-y-2">
          {question.options?.map((opt) => {
            const checked = Array.isArray(value) && value.includes(opt.value);
            return (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleCheckbox(opt.value)}
                  className="h-4 w-4 accent-indigo-600"
                />
                <span className="text-sm text-slate-800">{opt.label}</span>
              </label>
            );
          })}
        </div>
      );

    default:
      return (
        <p className="text-sm text-red-600">
          Unknown question type: {question.type}
        </p>
      );
  }
}

/* -------------------------------------------------------------------------
   Example usage (delete or move to your own page):

   const questions = [
     { id: "name", type: "text", label: "What's your name?", required: true },
     {
       id: "role",
       type: "radio",
       label: "What best describes your role?",
       required: true,
       options: [
         { label: "Developer", value: "dev" },
         { label: "Designer", value: "design" },
         { label: "Product", value: "product" },
       ],
     },
     {
       id: "tools",
       type: "checkbox",
       label: "Which tools do you use weekly?",
       options: [
         { label: "React", value: "react" },
         { label: "Astro", value: "astro" },
         { label: "Tailwind", value: "tailwind" },
       ],
     },
     { id: "feedback", type: "textarea", label: "Anything else to share?" },
   ];

   <FormWizard questions={questions} onComplete={(answers) => console.log(answers)} />
------------------------------------------------------------------------- */
