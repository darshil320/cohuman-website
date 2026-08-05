"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  clampIndex,
  sizeLabel,
  type SeriesConfig,
  type SeriesDefinition,
  type SeriesSelection,
} from "@/lib/series";

interface SeriesState {
  configIndex: number;
  /** `"all"`, or a key from the series' `finishFilters`. */
  finish: string;
  lenIndex: number;
  depIndex: number;
  partIndex: number;
  dimensionsOn: boolean;
  quantity: string;
}

type SeriesAction =
  | { type: "pickConfig"; index: number }
  | { type: "setFinish"; finish: string }
  | { type: "setLength"; index: number }
  | { type: "setDepth"; index: number }
  | { type: "setPart"; index: number }
  | { type: "toggleDimensions" }
  | { type: "setQuantity"; quantity: string };

/** The part the anatomy section opens on — the table top, wherever it sits in the list. */
function defaultPartIndex(series: SeriesDefinition): number {
  const index = series.parts.findIndex((part) => part.group === "Surface");
  return index >= 0 ? index : 0;
}

function initialState(series: SeriesDefinition): SeriesState {
  const configIndex = series.configs.findIndex(
    (config) => config.slug === series.defaultConfigSlug,
  );
  return {
    configIndex: configIndex >= 0 ? configIndex : 0,
    finish: "all",
    lenIndex: 0,
    depIndex: 0,
    partIndex: defaultPartIndex(series),
    dimensionsOn: true,
    quantity: "12",
  };
}

// Every branch returns a new state object — no in-place mutation.
function reducer(state: SeriesState, action: SeriesAction): SeriesState {
  switch (action.type) {
    case "pickConfig":
      // Size indices are per-configuration, so a new configuration starts at its first
      // length/depth rather than carrying over an out-of-range index.
      return { ...state, configIndex: action.index, lenIndex: 0, depIndex: 0 };
    case "setFinish":
      return { ...state, finish: action.finish };
    case "setLength":
      return { ...state, lenIndex: action.index };
    case "setDepth":
      return { ...state, depIndex: action.index };
    case "setPart":
      return { ...state, partIndex: action.index };
    case "toggleDimensions":
      return { ...state, dimensionsOn: !state.dimensionsOn };
    case "setQuantity":
      return { ...state, quantity: action.quantity };
    default:
      return state;
  }
}

interface SeriesContextValue extends SeriesState {
  series: SeriesDefinition;
  config: SeriesConfig;
  selection: SeriesSelection;
  size: string;
  /** Configurations passing the current finish filter, in chart order. */
  visibleConfigs: SeriesConfig[];
  pickConfig: (index: number) => void;
  pickConfigBySlug: (slug: string) => void;
  setFinish: (finish: string) => void;
  setLength: (index: number) => void;
  setDepth: (index: number) => void;
  setPart: (index: number) => void;
  toggleDimensions: () => void;
  setQuantity: (quantity: string) => void;
}

const SeriesContext = createContext<SeriesContextValue | null>(null);

export function useSeriesConfigurator(): SeriesContextValue {
  const ctx = useContext(SeriesContext);
  if (!ctx) throw new Error("useSeriesConfigurator must be used within SeriesProvider");
  return ctx;
}

export function SeriesProvider({
  series,
  children,
}: {
  series: SeriesDefinition;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, series, initialState);

  const pickConfig = useCallback((index: number) => dispatch({ type: "pickConfig", index }), []);
  const pickConfigBySlug = useCallback(
    (slug: string) => {
      const index = series.configs.findIndex((config) => config.slug === slug);
      if (index >= 0) dispatch({ type: "pickConfig", index });
    },
    [series],
  );
  const setFinish = useCallback((finish: string) => dispatch({ type: "setFinish", finish }), []);
  const setLength = useCallback((index: number) => dispatch({ type: "setLength", index }), []);
  const setDepth = useCallback((index: number) => dispatch({ type: "setDepth", index }), []);
  const setPart = useCallback((index: number) => dispatch({ type: "setPart", index }), []);
  const toggleDimensions = useCallback(() => dispatch({ type: "toggleDimensions" }), []);
  const setQuantity = useCallback(
    (quantity: string) => dispatch({ type: "setQuantity", quantity }),
    [],
  );

  const value = useMemo<SeriesContextValue>(() => {
    const config = series.configs[clampIndex(state.configIndex, series.configs.length)];
    const selection: SeriesSelection = {
      series,
      config,
      lenIndex: clampIndex(state.lenIndex, config.lens.length),
      depIndex: clampIndex(state.depIndex, config.deps.length),
    };
    return {
      ...state,
      series,
      config,
      selection,
      size: sizeLabel(selection),
      visibleConfigs:
        state.finish === "all"
          ? series.configs
          : series.configs.filter((c) => c.finish === state.finish),
      pickConfig,
      pickConfigBySlug,
      setFinish,
      setLength,
      setDepth,
      setPart,
      toggleDimensions,
      setQuantity,
    };
  }, [
    series,
    state,
    pickConfig,
    pickConfigBySlug,
    setFinish,
    setLength,
    setDepth,
    setPart,
    toggleDimensions,
    setQuantity,
  ]);

  return <SeriesContext.Provider value={value}>{children}</SeriesContext.Provider>;
}
