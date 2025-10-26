import { useState } from "react";
import Container from "../components/ui/Container.jsx";
import Card from "../components/ui/Card.jsx";
import PillButton from "../components/ui/PillButton.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STEPS = [
  { title: "By Air",   body: "Fly into Phuket International Airport (HKT). Direct connections from many Asian hubs. Grab a taxi or minivan to your hotel." },
  { title: "By Bus",   body: "Buses run from Bangkok’s Southern Terminal to Phuket (11–13h). Book VIP or first-class for more comfort." },
  { title: "By Train", body: "No direct train. Take a train to Surat Thani and transfer to a bus to Phuket." },
];

export default function HowToGetIn() {
  const [idx, setIdx] = useState(0);
  const step = STEPS[idx];
  return (
    <Container>
      <Card className="p-6 mt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">How to Get In</h3>
          <div className="flex items-center gap-2">
            <button aria-label="Prev" className="p-2 rounded-full border border-slate-200 disabled:opacity-40"
              onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}><ChevronLeft /></button>
            <button aria-label="Next" className="p-2 rounded-full border border-slate-200 disabled:opacity-40"
              onClick={() => setIdx(Math.min(STEPS.length - 1, idx + 1))} disabled={idx === STEPS.length - 1}><ChevronRight /></button>
          </div>
        </div>
        <div className="mt-3 text-slate-700 leading-relaxed">
          <p className="font-semibold mb-1">{step.title}</p>
          <p>{step.body}</p>
        </div>
        <div className="mt-4"><PillButton className="bg-teal-600 hover:bg-teal-700">Download plan</PillButton></div>
      </Card>
    </Container>
  );
}
