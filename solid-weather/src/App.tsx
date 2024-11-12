import { createSignal } from "solid-js";
import { TextField, TextFieldInput } from "~/components/ui/text-field";

export function App() {
  const [seledted, setSeledted] = createSignal(false);

  const [locationInput, setLocationInput] = createSignal("");

  return (
    <div class="flex h-screen w-full flex-col items-center justify-center gap-4 text-3xl">
      Solid Weather
      <TextField value={locationInput()} onChange={setLocationInput}>
        <TextFieldInput type="text" placeholder="Search for a place..." />
      </TextField>
    </div>
  );
}
