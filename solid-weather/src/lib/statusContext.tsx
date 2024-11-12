import {
  Accessor,
  Component,
  createContext,
  createSignal,
  ParentProps,
  Setter,
  useContext,
} from "solid-js";

export type StatusType = "searching" | "selected";

type StatusContextType = [
  stats: Accessor<StatusType>,
  setStatus: Setter<StatusType>,
];

const StatusContext = createContext<StatusContextType>();

export const StatusProvider: Component<
  ParentProps & { initial: StatusType }
> = (props) => {
  const ctxData = createSignal(props.initial);

  return (
    <StatusContext.Provider value={ctxData}>
      {props.children}
    </StatusContext.Provider>
  );
};

export const useStatus = () => useContext(StatusContext)!;
