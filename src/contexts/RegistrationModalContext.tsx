import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type OpenRegistrationModal = (eventId?: string) => void;

interface RegistrationModalContextType {
  isOpen: boolean;
  openRegistrationModal: OpenRegistrationModal;
  closeRegistrationModal: () => void;
  /** When set, after successful sign-up we'll register for this event (and sign in). */
  eventIdForRegistration: string | null;
}

const RegistrationModalContext = createContext<RegistrationModalContextType | undefined>(undefined);

export const useRegistrationModal = () => {
  const context = useContext(RegistrationModalContext);
  if (!context) {
    throw new Error("useRegistrationModal must be used within a RegistrationModalProvider");
  }
  return context;
};

interface RegistrationModalProviderProps {
  children: ReactNode;
}

export const RegistrationModalProvider = ({ children }: RegistrationModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [eventIdForRegistration, setEventIdForRegistration] = useState<string | null>(null);

  const openRegistrationModal = useCallback((eventId?: string) => {
    setEventIdForRegistration(eventId ?? null);
    setIsOpen(true);
  }, []);

  const closeRegistrationModal = useCallback(() => {
    setIsOpen(false);
    setEventIdForRegistration(null);
  }, []);

  return (
    <RegistrationModalContext.Provider
      value={{
        isOpen,
        openRegistrationModal,
        closeRegistrationModal,
        eventIdForRegistration,
      }}
    >
      {children}
    </RegistrationModalContext.Provider>
  );
};
