import { AiOutlineLoading } from "solid-icons/ai";
import { FaSolidLocationArrow } from "solid-icons/fa";
import { createSignal } from "solid-js";
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
} from "~/components/ui/text-field";

export function App() {
  const [status, setStatus] = createSignal("base");

  const [locationInput, setLocationInput] = createSignal("");

  async function searchLocation(e: SubmitEvent) {
    e.preventDefault();

    setStatus("loading");
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${locationInput()}&count=1&language=en&format=json`,
    );
    if (res.ok) {
      const body = (await res.json()) as {
        results: {
          name: string;
          latitude: number;
          longtitude: number;
          country: string;
          country_code: string;
          elevation: number;
        }[];
      };
      await new Promise((res) => setTimeout(res, 700)); //! remove later
      if (!body?.results) {
        console.log("npt found");
        setStatus("notFound");
        return;
      }
      console.log(body.results);
      setStatus("found");
    }
  }

  return (
    <form
      onSubmit={searchLocation}
      class="flex h-screen w-full items-center justify-center gap-4 bg-gradient-to-b from-blue-500 to-orange-500 text-3xl"
    >
      <TextField
        value={locationInput()}
        onChange={setLocationInput}
        class="transition-all"
      >
        <TextFieldLabel class="relative flex items-center gap-4 rounded-2xl border border-white/35 bg-white/[.075] shadow-xl shadow-black/[.02] focus-within:border-2">
          <FaSolidLocationArrow class="ml-4 text-white/35" size={20} />
          <TextFieldInput
            type="text"
            placeholder="Search for a place..."
            class="border-none p-0 py-6 pr-4 text-xl placeholder:text-white/65 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </TextFieldLabel>
      </TextField>

      <AiOutlineLoading
        class="w-0 max-w-12 flex-[.0001] basis-0 animate-spin text-white/35 opacity-0 transition-[flex,_opacity] duration-700 [animation-duration:1s]"
        classList={{
          "flex-1 !opacity-100": status() === "loading",
        }}
      />
    </form>
  );
}
