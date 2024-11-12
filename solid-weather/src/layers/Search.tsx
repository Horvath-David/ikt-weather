import { AiOutlineLoading } from "solid-icons/ai";
import { FaSolidLocationArrow } from "solid-icons/fa";
import { Component, createSignal } from "solid-js";
import { toast } from "solid-sonner";
import {
  TextFieldLabel,
  TextFieldInput,
  TextField,
} from "~/components/ui/text-field";
import { cn } from "~/lib/utils";

export const Search: Component<{ class?: string }> = (props) => {
  const [loading, setLoading] = createSignal(false);

  const [locationInput, setLocationInput] = createSignal("");

  async function searchLocation(e: SubmitEvent) {
    e.preventDefault();

    setLoading(true);
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
        toast.error("No location found.");
      } else {
        console.log(body.results);
      }
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={searchLocation}
      class={cn(
        "absolute inset-0 flex h-screen w-full items-center justify-center gap-4 bg-gradient-to-b from-blue-500 to-orange-500",
        props.class,
      )}
    >
      <div class="w-sm ml-2 flex items-center gap-4">
        <TextField
          value={locationInput()}
          onChange={setLocationInput}
          class="min-w-0 flex-1 basis-0"
        >
          <TextFieldLabel class="flex items-center gap-4 rounded-2xl border border-white/35 bg-white/[.075] shadow-xl shadow-black/[.02] focus-within:border-2">
            <FaSolidLocationArrow class="ml-4 text-white/35" size={20} />
            <TextFieldInput
              type="text"
              autocomplete="off"
              placeholder="Search for a place..."
              class="min-w-0 max-w-full border-none p-0 py-6 pr-4 text-xl placeholder:text-white/65 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </TextFieldLabel>
        </TextField>
        <AiOutlineLoading
          class="h-6 w-0 max-w-6 shrink-0 flex-grow-[.0001] basis-0 animate-spin text-white/65 opacity-0 transition-[flex,_opacity] duration-700 [animation-duration:1s]"
          classList={{
            "flex-grow-[1] !opacity-100": loading(),
          }}
        />
      </div>
    </form>
  );
};
