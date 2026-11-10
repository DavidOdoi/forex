"use client";

import { useState } from "react";
import { PatternDiagram } from "./pattern-diagram";
import { patterns, triangleKinds, scenarios, revealSteps, exercises, measuredMove, type TriangleKind, type Scenario } from "@/lib/education/triangles";

export function PatternExplorer() {
  const [kind, setKind] = useState<TriangleKind>("ascending");
  const [scenario, setScenario] = useState<Scenario>("up");
  const [step, setStep] = useState(0);
  const result = scenarios.find(item => item.id === scenario)!;
  return <div className="tp-lab" data-explorer>
    <div className="tp-lab-controls"><div><label htmlFor="triangle-pattern">Pattern</label><select id="triangle-pattern" value={kind} onChange={event => { setKind(event.target.value as TriangleKind); setStep(0); }}>{triangleKinds.map(item => <option key={item} value={item}>{patterns[item].name}</option>)}</select></div>
      <div><label htmlFor="triangle-scenario">Scenario</label><select id="triangle-scenario" value={scenario} onChange={event => { setScenario(event.target.value as Scenario); setStep(0); }}>{scenarios.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
    </div>
    <div className="tp-lab-grid"><div className="tp-chart-panel"><PatternDiagram kind={kind} scenario={scenario} step={step} /><p className="tp-chart-key"><span>━ Completed illustration</span><span>┄ Gold: hypothetical next segment</span></p></div>
      <div className="tp-step-panel"><p className="tp-eyebrow">Manual reveal · Step {step + 1} of 5</p><div aria-live="polite" aria-atomic="true" className="tp-step-copy"><h3>{revealSteps[step].title}</h3><p>{revealSteps[step].text}</p>{step >= 3 && <div data-scenario-explanation><h4>What the drawing shows</h4><p>{result.observation}</p>{step === 4 && <><h4>How to interpret it</h4><p>{result.interpretation}</p></>}</div>}</div>
        <div className="tp-actions"><button type="button" className="tp-primary" disabled={step === 4} onClick={() => setStep(previous => previous + 1)}>Next step <span aria-hidden="true">→</span></button><button type="button" onClick={() => setStep(0)}>Reset reveal</button></div>
        <p className="tp-muted">Changing either selection hides the next segment again. No autoplay, live prices or prediction model.</p>
      </div>
    </div>
    <noscript><p>JavaScript is needed for the controls. The static comparison and annotated breakout examples below cover the same core ideas.</p></noscript>
  </div>;
}

export function MeasuredMoveCalculator() {
  const [upper, setUpper] = useState("1.1000"), [lower, setLower] = useState("1.0950"), [reference, setReference] = useState("1.1020");
  const [direction, setDirection] = useState("up");
  const [submitted, setSubmitted] = useState({ upper, lower, reference, direction });
  const [result, setResult] = useState(() => measuredMove(upper, lower, reference, direction));
  const dirty = upper !== submitted.upper || lower !== submitted.lower || reference !== submitted.reference || direction !== submitted.direction;
  const fields = [{ id: "upper" as const, label: "Upper measurement price", value: upper, set: setUpper }, { id: "lower" as const, label: "Lower measurement price", value: lower, set: setLower }, { id: "reference" as const, label: "Breakout reference price", value: reference, set: setReference }];
  return <div className="tp-measure" data-measured-move><form noValidate onSubmit={event => { event.preventDefault(); setSubmitted({ upper, lower, reference, direction }); const next = measuredMove(upper, lower, reference, direction); setResult(next); if (!next.ok) document.getElementById(`measure-${next.field}`)?.focus(); }}>
    <p id="price-units">All inputs and results use the same quoted price units. Enter decimal prices, not pips or percentages. Up to 8 decimal places; no automatic rounding. This checks arithmetic, not whether a chart breakout occurred.</p>
    <div className="tp-input-grid">{fields.map(field => <label key={field.id} htmlFor={`measure-${field.id}`}>{field.label}<input id={`measure-${field.id}`} inputMode="decimal" type="text" autoComplete="off" value={field.value} aria-describedby={`price-units${!result.ok && result.field === field.id ? " measure-error" : ""}`} aria-invalid={!dirty && !result.ok && result.field === field.id} onChange={event => field.set(event.target.value)} /></label>)}
      <label htmlFor="measure-direction">Projection direction<select id="measure-direction" value={direction} onChange={event => setDirection(event.target.value)}><option value="up">Upward</option><option value="down">Downward</option></select></label></div>
    <button className="tp-primary" type="submit">Calculate reference</button>
  </form><div className="tp-measure-result" aria-live="polite" aria-atomic="true">{dirty ? <p>Inputs changed. Calculate again to update the reference.</p> : result.ok ? <><dl><div><dt>Vertical height</dt><dd data-height>{result.height}</dd></div><div><dt>{submitted.direction === "up" ? "Upward" : "Downward"} reference price</dt><dd data-target>{result.target}</dd></div></dl><p>Height = {submitted.upper} − {submitted.lower}. Reference = {submitted.reference} {submitted.direction === "up" ? "+" : "−"} {result.height}.</p><strong>Hypothetical measured-move reference—not a forecast.</strong></> : <p id="measure-error" role="alert">{result.error}</p>}</div>
    <noscript><p>Interactive calculations require JavaScript. The worked example and formulas below remain readable.</p></noscript>
  </div>;
}

export function PatternExercise() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const exercise = exercises[index];
  const options = ["Ascending triangle", "Descending triangle", "Symmetrical triangle", "Wedge", "Rectangle", "Unclear / insufficient evidence"];
  const answer = answers[index];
  return <div className="tp-exercise" data-exercise>
    <div className="tp-exercise-top"><p className="tp-eyebrow">Example {index + 1} of {exercises.length} · Recognition, not a trading score</p><button type="button" onClick={() => { setIndex(0); setAnswers({}); }}>Reset exercise</button></div>
    <div className="tp-lab-grid"><PatternDiagram kind={exercise.kind} neutral title={`Recognition exercise ${index + 1}: illustrated price swings`} step={2} />
      <div><fieldset><legend>Which structure is supported by this drawing?</legend><div className="tp-answer-options">{options.map(option => <label key={option}><input type="radio" name={`recognition-${index}`} value={option} checked={answer === option} onChange={() => setAnswers(previous => ({ ...previous, [index]: option }))} />{option}</label>)}</div></fieldset>
        <div className="tp-answer-feedback" aria-live="polite" aria-atomic="true">{answer ? <><strong>{answer === exercise.answer ? "That matches this drawing." : `This example is best described as: ${exercise.answer}.`}</strong><p>{exercise.explanation}</p></> : <p>Choose an answer to see the reasoning. “Unclear” is a valid option when evidence is insufficient.</p>}</div>
        <div className="tp-actions"><button type="button" disabled={index === 0} onClick={() => setIndex(previous => previous - 1)}>Previous example</button><button type="button" className="tp-primary" disabled={index === exercises.length - 1} onClick={() => setIndex(previous => previous + 1)}>Next example</button></div>
      </div>
    </div><noscript><p>The exercise needs JavaScript. Read the static pattern and lookalike comparisons above for the same geometry distinctions.</p></noscript>
  </div>;
}
