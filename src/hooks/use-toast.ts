import { useState, useCallback, useEffect } from "react";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

let toastCount = 0;

const toastListeners: Array<(state: ToastState) => void> = [];

let memoryState: ToastState = { toasts: [] };

function dispatch(action: { type: string; toast?: Toast; toastId?: string }) {
  switch (action.type) {
    case "ADD_TOAST":
      if (action.toast) {
        memoryState.toasts = [action.toast, ...memoryState.toasts];
      }
      break;
    case "UPDATE_TOAST":
      if (action.toast) {
        memoryState.toasts = memoryState.toasts.map((t) =>
          t.id === action.toast!.id ? { ...t, ...action.toast } : t,
        );
      }
      break;
    case "DISMISS_TOAST":
      if (action.toastId) {
        memoryState.toasts = memoryState.toasts.filter(
          (t) => t.id !== action.toastId,
        );
      }
      break;
    case "REMOVE_TOAST":
      if (action.toastId) {
        memoryState.toasts = memoryState.toasts.filter(
          (t) => t.id !== action.toastId,
        );
      }
      break;
  }

  toastListeners.forEach((listener) => {
    listener(memoryState);
  });
}

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_VALUE;
  return toastCount.toString();
}

type ToasterToast = Toast & {
  id: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  cancel?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function reducer(state: ToastState, action: any): ToastState {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, 1),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== toastId),
        };
      } else {
        return {
          ...state,
          toasts: [],
        };
      }
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
}

function toast({ ...props }: Omit<ToasterToast, "id">) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = useState<ToastState>(memoryState);

  useEffect(() => {
    toastListeners.push(setState);
    return () => {
      const index = toastListeners.indexOf(setState);
      if (index > -1) {
        toastListeners.splice(index, 1);
      }
    };
  }, [setState]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
