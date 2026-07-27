import { GlassPanel } from "../common/GlassPanel";
import { SpeechToTextPanel } from "./SpeechToTextPanel";
import { TextToSpeechPanel } from "./TextToSpeechPanel";
import { useT } from "../../hooks/useT";

export function VoiceStudio({ editorRef }) {
  const az = useT();

  return (
    <GlassPanel className="p-5">
      <div className="mb-5">
        <h1 className="font-heading font-bold text-xl text-heading">{az.voice.title}</h1>
        <p className="text-sm text-muted">{az.voice.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <SpeechToTextPanel editorRef={editorRef} />
        <div className="border-t md:border-t-0 md:border-l border-border-glass pt-5 md:pt-0 md:pl-6">
          <TextToSpeechPanel editorRef={editorRef} />
        </div>
      </div>
    </GlassPanel>
  );
}
