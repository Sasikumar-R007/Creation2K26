import { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  User,
  Building,
  GraduationCap,
  Phone,
  Loader2,
  Sparkles,
  CheckCircle2,
  Calendar,
  MapPin,
  BookOpen,
  ArrowLeft,
  CalendarDays,
  Users,
  CreditCard,
  Upload,
  ImageIcon,
  Download,
  MessageCircle,
  X,
  Utensils,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NeonButton } from "@/components/ui/neon-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  EVENT_DATE,
  VENUE,
  MAX_EVENTS_PER_PARTICIPANT,
  getEventTeamSize,
} from "@/lib/constants";
import { useEvents } from "@/hooks/useEvents";
import { useSubmitGuestRegistration } from "@/hooks/useRegistrations";
import { eventsConflict } from "@/lib/eventParticipation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const nameSchema = z.string().min(2, "Name must be at least 2 characters");
const phoneSchema = z.string().min(10, "Please enter a valid phone number (at least 10 digits)");
const departmentSchema = z.string().min(1, "Department is required");
const collegeSchema = z.string().min(1, "College is required");

export type TeamMember = { name: string; email: string; whatsapp_phone: string };

const initialForm = {
  name: "",
  email: "",
  whatsapp_phone: "",
  department: "",
  college: "",
  food_preference: "",
  event_1_id: "",
  event_2_id: "",
  event_1_team_size: 1,
  event_2_team_size: 1,
  event_1_team_name: "",
  event_2_team_name: "",
  event_1_team_members: [] as TeamMember[],
  event_2_team_members: [] as TeamMember[],
  payment_screenshot: null as File | null,
  upi_transaction_id: "",
};

const STEPS = [
  { id: "registration", label: "Registration", number: 1 },
  { id: "payment", label: "Payment", number: 2 },
] as const;

const conflictGroups = [
  {
    title: "Group A (choose one)",
    events: ["Quiz", "Personality Contest", "Memory Matrix", "AI Prompt Engineering", "Paper Presentation", "Debugging"],
  },
  {
    title: "Group B (choose one)",
    events: ["Web Design", "IPL Auction", "Ad Zap", "Movie Spoofing"],
  },
];

const EMPTY_VALUE = "__none__";

// Single user registration - fixed amount
const PAYMENT_AMOUNT = 250;
const PAYMENT_QR_IMAGE = "/250.png";

interface RegistrationSuccessModalProps {
  form: typeof initialForm;
  events: any[];
  event1: any;
  event2: any;
  registrationId: string | null;
  onClose: () => void;
}

const RegistrationSuccessModal = ({ form, events, event1, event2, registrationId, onClose }: RegistrationSuccessModalProps) => {
  const { toast } = useToast();

  const downloadPDF = async () => {
    const element = document.getElementById("registration-form");
    if (!element) return;

    try {
      // Dynamic import to avoid build issues
      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `CN2K26_Registration_${registrationId || "form"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "PDF Generation Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const registrationDate = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-2xl text-center">Registration Successful! 🎉</DialogTitle>
        <DialogDescription className="text-center">
          Your registration has been confirmed. Please download your registration form.
        </DialogDescription>
      </DialogHeader>

      <div id="registration-form" className="bg-white text-black p-8 space-y-6" style={{ fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif" }}>
        {/* Header with Logo */}
        <div className="flex flex-col items-center border-b-2 border-gray-800 pb-4 mb-6">
          <img src="/form logo.png" alt="CREATION 2K26" className="h-28 w-auto mb-3" />
          <p className="text-base text-center font-medium text-gray-700 mt-2">BCA Department, Bishop Heber College</p>
          <p className="text-sm text-center mt-1 text-gray-600">Trichy - 620 017, Tamil Nadu</p>
        </div>

        {/* Registration ID */}
        {registrationId && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200 mb-6">
            <p className="text-center">
              <span className="font-medium text-sm text-gray-700">Registration ID: </span>
              <span className="font-bold text-lg text-blue-600 tracking-wider">{registrationId}</span>
            </p>
          </div>
        )}

        {/* Personal Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 text-gray-800">Personal Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
              <p className="text-base text-gray-800 font-medium">{form.name}</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
              <p className="text-base text-gray-800 font-medium">{form.email}</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-1">WhatsApp Phone</p>
              <p className="text-base text-gray-800 font-medium">{form.whatsapp_phone}</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-1">Department</p>
              <p className="text-base text-gray-800 font-medium">{form.department}</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-1">College</p>
              <p className="text-base text-gray-800 font-medium">{form.college}</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-1">Food Preference</p>
              <p className="text-base text-gray-800 font-medium">{form.food_preference ? (form.food_preference === 'veg' ? 'Veg' : 'Non-Veg') : 'Not specified'}</p>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 text-gray-800">Event Details</h2>

          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-4 bg-blue-50/50 py-2 rounded-r">
              <p className="font-semibold text-base text-gray-800">Event 1: {event1?.name || "N/A"}</p>
              <p className="text-sm text-gray-600 mt-1">Number of Participants: <span className="font-medium">{form.event_1_team_size}</span></p>
              {form.event_1_team_size > 1 && form.event_1_team_name && (
                <p className="text-sm text-gray-600 mt-1">Team Name: <span className="font-medium">{form.event_1_team_name}</span></p>
              )}
            </div>

            {form.event_2_id && event2 && (
              <div className="border-l-4 border-indigo-500 pl-4 bg-indigo-50/50 py-2 rounded-r">
                <p className="font-semibold text-base text-gray-800">Event 2: {event2.name}</p>
                <p className="text-sm text-gray-600 mt-1">Number of Participants: <span className="font-medium">{form.event_2_team_size}</span></p>
                {form.event_2_team_size > 1 && form.event_2_team_name && (
                  <p className="text-sm text-gray-600 mt-1">Team Name: <span className="font-medium">{form.event_2_team_name}</span></p>
                )}
              </div>
            )}
          </div>
        </div>


        {/* Payment Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 text-gray-800">Payment Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-1">UPI Transaction ID</p>
              <p className="text-base text-gray-800 font-medium">{form.upi_transaction_id || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-1">Payment Status</p>
              <p className="text-base text-green-600 font-semibold">✓ Confirmed</p>
            </div>
          </div>
        </div>

        {/* Registration Date */}
        <div className="space-y-2 border-t-2 border-gray-300 pt-4">
          <p className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-1">Registration Date & Time</p>
          <p className="text-base text-gray-800 font-medium">{registrationDate}</p>
        </div>

        {/* WhatsApp Group Link */}
        <div className="border-t-2 border-gray-300 pt-4 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-sm font-semibold text-gray-800 mb-2">📱 Stay Connected!</p>
            <p className="text-xs text-gray-600 mb-3">
              Join our WhatsApp group for important updates, event schedules, and announcements.
            </p>
            <a
              href="https://chat.whatsapp.com/LuCiaJ1znph5KAWrT0gsMJ?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
              style={{ textDecoration: "none" }}
            >
              <MessageCircle className="w-4 h-4" />
              Join WhatsApp Group
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-300 pt-4 mt-6 text-center">
          <p className="text-sm text-gray-600 font-medium">This is an official registration confirmation document.</p>
          <p className="text-xs text-gray-500 mt-2">Please keep this document safe for your records.</p>
        </div>
      </div>

      {/* WhatsApp Group Notice */}
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <p className="font-semibold text-foreground">Important Notice</p>
        </div>
        <p className="text-sm text-muted-foreground">
          This page will be shown only once. Please download your registration form now.
        </p>
        <p className="text-sm text-muted-foreground">
          Join our WhatsApp group for further updates. <span className="text-primary font-medium">Click the button below to join:</span>
        </p>
        <a
          href="https://chat.whatsapp.com/LuCiaJ1znph5KAWrT0gsMJ?mode=gi_t"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-100"
        >
          <MessageCircle className="w-5 h-5" />
          Join WhatsApp Group
        </a>
      </div>

      {/* Action Buttons */}
      <DialogFooter className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={downloadPDF}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
        >
          Close
        </button>
      </DialogFooter>
    </div>
  );
};

export default function Register() {
  const { data: events = [], isLoading: loadingEvents, error: eventsError } = useEvents();
  const submitRegistration = useSubmitGuestRegistration();

  // Debug: Log events loading state (only on mount and error)
  useEffect(() => {
    if (eventsError) {
      console.error("Error loading events:", eventsError);
    }
  }, [eventsError]);

  const [form, setForm] = useState(initialForm);
  const [activeTab, setActiveTab] = useState("registration");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showRegistrationAlert, setShowRegistrationAlert] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const { toast } = useToast();

  const formattedDate = EVENT_DATE.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const event1 = useMemo(
    () => events.find((e) => e.id === form.event_1_id),
    [events, form.event_1_id]
  );
  const event2 = useMemo(
    () => (form.event_2_id ? events.find((e) => e.id === form.event_2_id) : null),
    [events, form.event_2_id]
  );

  /** Events that conflict with Event 1 (for Event 2 dropdown: show but disable with TIME CONFLICT) */
  const conflictsWithEvent1 = useMemo(() => {
    if (!event1) return new Set<string>();
    const set = new Set<string>();
    events.forEach((ev) => {
      if (ev.id !== event1.id && eventsConflict(event1.name, ev.name)) set.add(ev.id);
    });
    return set;
  }, [event1, events]);

  /** Events that conflict with Event 2 (for Event 1 dropdown: show but disable with TIME CONFLICT) */
  const conflictsWithEvent2 = useMemo(() => {
    if (!event2) return new Set<string>();
    const set = new Set<string>();
    events.forEach((ev) => {
      if (ev.id !== event2.id && eventsConflict(event2.name, ev.name)) set.add(ev.id);
    });
    return set;
  }, [event2, events]);

  const maxTeamSize1 = event1 ? getEventTeamSize(event1.name) : 1;
  const maxTeamSize2 = event2 ? getEventTeamSize(event2.name) : 1;


  const validateField = (field: string, value: string) => {
    try {
      if (field === "email") emailSchema.parse(value);
      else if (field === "name") nameSchema.parse(value);
      else if (field === "whatsapp_phone") phoneSchema.parse(value);
      else if (field === "department") departmentSchema.parse(value);
      else if (field === "college") collegeSchema.parse(value);
      setErrors((prev) => ({ ...prev, [field]: "" }));
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: err.errors[0].message }));
      }
      return false;
    }
  };


  const validateRegistrationStep = () => {
    setErrors({});
    let isValid = true;

    const nameValid = validateField("name", form.name);
    const emailValid = validateField("email", form.email);
    const phoneValid = validateField("whatsapp_phone", form.whatsapp_phone);
    const departmentValid = validateField("department", form.department);
    const collegeValid = validateField("college", form.college);

    if (!nameValid || !emailValid || !phoneValid || !departmentValid || !collegeValid) {
      isValid = false;
    }

    if (!form.event_1_id) {
      setErrors((prev) => ({ ...prev, event_1_id: "Please select Event 1." }));
      isValid = false;
    }

    // Validate team names if team size > 1
    if (form.event_1_team_size > 1 && !form.event_1_team_name.trim()) {
      setErrors((prev) => ({ ...prev, event_1_team_name: "Team name is required for Event 1." }));
      isValid = false;
    }

    if (form.event_2_id && form.event_2_team_size > 1 && !form.event_2_team_name.trim()) {
      setErrors((prev) => ({ ...prev, event_2_team_name: "Team name is required for Event 2." }));
      isValid = false;
    }

    return isValid;
  };


  const validatePaymentStep = () => {
    // Payment screenshot is now REQUIRED
    if (!form.payment_screenshot) {
      setErrors((prev) => ({ ...prev, payment_screenshot: "Payment screenshot is required. Please upload your payment confirmation." }));
      return false;
    }

    // UPI Transaction ID validation - required for payment tracking
    if (!form.upi_transaction_id.trim()) {
      setErrors((prev) => ({ ...prev, upi_transaction_id: "Please enter your UPI Transaction ID." }));
      return false;
    }
    // Validate UPI transaction ID is numeric
    if (!/^\d+$/.test(form.upi_transaction_id.trim())) {
      setErrors((prev) => ({ ...prev, upi_transaction_id: "UPI Transaction ID must contain only numbers." }));
      return false;
    }
    return true;
  };

  // Check if registration step is complete WITHOUT updating errors (to avoid infinite re-renders)
  const isRegistrationStepComplete = useCallback(() => {
    // Just check form fields without calling setErrors
    if (!form.name || !form.email || !form.whatsapp_phone || !form.department || !form.college) {
      return false;
    }
    if (!form.event_1_id) {
      return false;
    }
    if (form.event_1_team_size > 1 && !form.event_1_team_name.trim()) {
      return false;
    }
    if (form.event_2_id && form.event_2_team_size > 1 && !form.event_2_team_name.trim()) {
      return false;
    }
    return true;
  }, [form]);

  const handleRegistrationSubmit = () => {
    if (!validateRegistrationStep()) return;
    setShowRegistrationAlert(true);
  };

  const handleProceedToPayment = () => {
    setShowRegistrationAlert(false);
    if (isRegistrationStepComplete()) {
      setActiveTab("payment");
    }
  };

  const handleTabClick = useCallback((tabId: string) => {
    if (tabId === "payment" && !isRegistrationStepComplete()) {
      toast({
        title: "Complete Registration First",
        description: "Please complete the registration step before proceeding to payment.",
        variant: "destructive",
      });
      return;
    }
    setActiveTab(tabId);
  }, [isRegistrationStepComplete, toast]);

  const handlePaymentSubmit = () => {
    if (!validatePaymentStep()) return;
    setShowPaymentConfirm(true);
  };

  const handleFinalSubmit = async () => {
    setShowPaymentConfirm(false);
    setIsSubmitting(true);
    try {
      // Payment screenshot is now REQUIRED
      if (!form.payment_screenshot) {
        throw new Error("Payment screenshot is required. Please upload your payment confirmation.");
      }

      let paymentUrl: string | null = null;
      try {
        // Upload the screenshot (bucket should already exist - created manually in Supabase)
        const ext = form.payment_screenshot.name.split(".").pop() || "png";
        const path = `${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("payment-screenshots")
          .upload(path, form.payment_screenshot, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Screenshot upload failed:", uploadError);
          throw new Error("Failed to upload payment screenshot. Please try again or contact support.");
        }

        const { data: urlData } = supabase.storage.from("payment-screenshots").getPublicUrl(path);
        paymentUrl = urlData.publicUrl;
      } catch (uploadErr: any) {
        console.error("Upload error:", uploadErr);
        throw new Error(uploadErr.message || "Failed to upload payment screenshot. Please try again.");
      }

      // Build insert object conditionally to avoid schema cache errors
      const insertData: any = {
        name: form.name,
        email: form.email,
        whatsapp_phone: form.whatsapp_phone,
        department: form.department,
        college: form.college,
        food_preference: form.food_preference || null,
        event_1_id: form.event_1_id,
        event_2_id: form.event_2_id || null,
        event_1_team_size: form.event_1_team_size,
        event_2_team_size: form.event_2_id ? form.event_2_team_size : null,
        team_members: null,
        payment_screenshot_url: paymentUrl,
      };

      // Only include team_name fields if team_size > 1 (to avoid schema errors if columns don't exist)
      if (form.event_1_team_size > 1 && form.event_1_team_name?.trim()) {
        insertData.event_1_team_name = form.event_1_team_name;
      }
      if (form.event_2_id && form.event_2_team_size > 1 && form.event_2_team_name?.trim()) {
        insertData.event_2_team_name = form.event_2_team_name;
      }

      // Include UPI transaction ID if provided
      if (form.upi_transaction_id?.trim()) {
        insertData.upi_transaction_id = form.upi_transaction_id;
      }

      // Try to insert - handle errors gracefully
      // Select both id and registration_id (registration_id is auto-generated by trigger)
      let result = await supabase.from("guest_registrations").insert(insertData).select("id, registration_id").single();

      // If error is about missing column (schema cache issue), retry without optional fields
      if (result.error && (
        result.error.message?.includes("upi_transaction_id") ||
        result.error.message?.includes("schema cache") ||
        result.error.message?.includes("column") ||
        result.error.code === "PGRST204"
      )) {
        console.warn("Schema cache issue detected, retrying without optional fields:", result.error);

        // Create minimal insert data without optional fields that might cause cache issues
        const insertDataMinimal: any = {
          name: form.name,
          email: form.email,
          whatsapp_phone: form.whatsapp_phone,
          department: form.department,
          college: form.college,
          food_preference: form.food_preference || null,
          event_1_id: form.event_1_id,
          event_2_id: form.event_2_id || null,
          event_1_team_size: form.event_1_team_size,
          event_2_team_size: form.event_2_id ? form.event_2_team_size : null,
          team_members: null,
        };

        // Only add payment_screenshot_url if we have it (this column should exist)
        if (paymentUrl) {
          insertDataMinimal.payment_screenshot_url = paymentUrl;
        }

        // Retry with minimal fields (no upi_transaction_id, no team names)
        result = await supabase.from("guest_registrations").insert(insertDataMinimal).select("id, registration_id").single();

        if (result.error) {
          // If still failing, show detailed error
          console.error("Registration insert error:", result.error);

          // Check if it's an RLS error
          if (result.error.code === "42501" || result.error.message?.includes("row-level security")) {
            throw new Error(`Registration failed: Row-level security policy is blocking inserts. Please run the RLS policy fix SQL in your Supabase dashboard. See FIX_RLS_ERROR.sql for the SQL to run.`);
          } else {
            throw new Error(`Registration failed: ${result.error.message || "Unknown error"}. Please check: 1) Database migrations are run, 2) RLS policies allow inserts, 3) All required fields are present.`);
          }
        } else {
          // Success but warn about missing optional data
          toast({
            title: "Registration saved! ⚠️",
            description: "Registration completed. Some optional fields (team names, UPI ID) may not have been saved due to schema cache. Please run migrations and try again.",
            variant: "default",
          });
        }
      } else if (result.error) {
        // Other errors (not schema cache related)
        console.error("Registration insert error:", result.error);

        // Check if it's an RLS error
        if (result.error.code === "42501" || result.error.message?.includes("row-level security")) {
          throw new Error(`Registration failed: Row-level security policy is blocking inserts. Please run the RLS policy fix SQL in your Supabase dashboard. See FIX_RLS_ERROR.sql for the SQL to run.`);
        } else {
          throw new Error(`Registration failed: ${result.error.message || "Unknown error"}. Please check: 1) Database migrations are run, 2) RLS policies allow inserts, 3) All required fields are present.`);
        }
      }

      if (result.error) {
        throw result.error;
      }

      const { data } = result;

      // Use registration_id if available, otherwise fallback to id
      const displayId = data.registration_id || data.id;
      setRegistrationId(displayId);
      setShowSuccessModal(true);
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "registration") {
      handleRegistrationSubmit();
    } else if (activeTab === "payment") {
      handlePaymentSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-background dark relative">

      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[hsl(260,25%,6%)] to-background opacity-100" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-t from-secondary/5 to-transparent" />
      </div>

      <Navbar />

      <main className="relative min-h-[calc(100vh-4rem)] w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Redesigned Header Section - Centered & Compact */}
          <div className="mb-8 sm:mb-10 relative">
            <div className="relative bg-background/80 backdrop-blur-xl rounded-xl p-6 sm:p-8 overflow-hidden border border-primary/20 shadow-lg">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

              {/* Content - Centered */}
              <div className="relative z-10 text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  <span className="gradient-text">CREATION 2K26</span>
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  BCA Department, Bishop Heber College. Register for up to two events.
                </p>
                {/* Red Badge - Not for Bishop Heber College Students */}
                <div className="mt-4 flex justify-center">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-red-600 text-white font-bold text-sm shadow-lg border-2 border-red-700">
                    ⚠️ Not for Bishop Heber College Students
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Techy Stepper */}
          <div className="mb-8 sm:mb-10">
            <div className="relative">
              {/* Connecting line - full width background */}
              <div className="absolute top-6 left-0 right-0 h-0.5 z-0">
                {/* Inactive line (full width, muted) */}
                <div className="absolute inset-0 bg-muted/20" />
                {/* Active line (gradient, fills based on progress) */}
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary via-secondary to-primary transition-all duration-500 ease-out"
                  style={{
                    width: activeTab === "payment" ? "100%" : "50%",
                  }}
                />
              </div>

              <div className="relative flex items-start justify-between">
                {STEPS.map((step, index) => {
                  const isActive = activeTab === step.id;
                  const isCompleted = index === 0 && isRegistrationStepComplete();
                  const isDisabled = index === 1 && !isRegistrationStepComplete();

                  return (
                    <div key={step.id} className="flex flex-col items-center flex-1 relative z-10">
                      {/* Step Circle */}
                      <button
                        type="button"
                        onClick={() => !isDisabled && handleTabClick(step.id)}
                        disabled={isDisabled}
                        className={`
                          relative w-12 h-12 rounded-full flex items-center justify-center
                          transition-all duration-300
                          ${isActive
                            ? "bg-gradient-to-b from-primary to-secondary shadow-[0_0_20px_hsl(var(--primary)/0.5)] scale-110"
                            : isDisabled
                              ? "bg-muted/30 border border-muted/40 cursor-not-allowed"
                              : "bg-muted/50 border border-muted/60"
                          }
                        `}
                      >
                        {/* Number */}
                        <span
                          className={`text-lg font-bold relative z-10 ${isActive
                            ? "text-foreground"
                            : isDisabled
                              ? "text-muted-foreground/40"
                              : "text-muted-foreground"
                            }`}
                        >
                          {step.number}
                        </span>

                        {/* Glow ring for active */}
                        {isActive && (
                          <div className="absolute inset-[-2px] rounded-full border-2 border-primary/30 animate-pulse" />
                        )}
                      </button>

                      {/* Label */}
                      <div className="mt-3 text-center">
                        <span
                          className={`text-sm font-medium block ${isActive
                            ? "text-primary"
                            : isDisabled
                              ? "text-muted-foreground/50"
                              : "text-muted-foreground"
                            }`}
                        >
                          {step.label}
                        </span>
                        {isDisabled && (
                          <span className="text-xs text-muted-foreground/60 mt-1 block">
                            Complete Step 1
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Full-width registration form */}
          <GlassPanel className="p-6 sm:p-8 lg:p-10 border-primary/20 w-full min-h-[400px]" glow="cyan">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays className="w-5 h-5 text-primary shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold">Event registration</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Choose up to two events. Options that conflict with your first choice will show <span className="text-destructive font-medium">TIME CONFLICT</span> and cannot be selected.
            </p>
            <details className="mb-6 rounded-lg border border-primary/20 bg-muted/10 p-4">
              <summary className="cursor-pointer text-sm font-medium text-foreground">View participation rules & conflict groups</summary>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <p>• Maximum of {MAX_EVENTS_PER_PARTICIPANT} events. Within each conflict group, choose only one.</p>
                <p><strong className="text-foreground">Group A:</strong> {conflictGroups[0].events.join(", ")}</p>
                <p><strong className="text-foreground">Group B:</strong> {conflictGroups[1].events.join(", ")}</p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formattedDate} · {VENUE.name}
                </p>
              </div>
            </details>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs value={activeTab} onValueChange={handleTabClick} className="w-full">
                <TabsContent value="registration" className="space-y-4 mt-0">
                  {/* Event 1 Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Event 1</Label>
                      <Select
                        value={form.event_1_id || EMPTY_VALUE}
                        onValueChange={(v) => {
                          const evId = v === EMPTY_VALUE ? "" : v;
                          const ev = events.find((e) => e.id === evId);
                          const maxSize = ev ? getEventTeamSize(ev.name) : 1;
                          const newTeamSize1 = Math.min(form.event_1_team_size, maxSize) || 1;
                          setForm((f) => ({
                            ...f,
                            event_1_id: evId,
                            event_2_id: evId === "" ? "" : f.event_2_id,
                            event_1_team_size: newTeamSize1,
                            event_1_team_name: newTeamSize1 === 1 ? "" : (newTeamSize1 > 1 ? f.event_1_team_name : ""),
                          }));
                        }}
                      >
                        <SelectTrigger className="w-full bg-muted/50 border-primary/20">
                          <SelectValue placeholder="Select first event" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={EMPTY_VALUE} className="hidden" />
                          {loadingEvents ? (
                            <SelectItem value="loading" disabled>Loading events...</SelectItem>
                          ) : eventsError ? (
                            <SelectItem value="error" disabled>Error loading events. Please refresh the page.</SelectItem>
                          ) : events.length === 0 ? (
                            <SelectItem value="empty" disabled>No events available. Please contact support.</SelectItem>
                          ) : (
                            events.map((ev) => {
                              const conflictWith2 = event2 && eventsConflict(ev.name, event2.name);
                              return (
                                <SelectItem
                                  key={ev.id}
                                  value={ev.id}
                                  disabled={conflictWith2}
                                  className={conflictWith2 ? "opacity-80 cursor-not-allowed" : ""}
                                >
                                  {ev.name}
                                  {conflictWith2 ? (
                                    <span className="text-destructive font-medium ml-1">— TIME CONFLICT</span>
                                  ) : null}
                                </SelectItem>
                              );
                            })
                          )}
                        </SelectContent>
                      </Select>
                      {errors.event_1_id && <p className="text-destructive text-sm">{errors.event_1_id}</p>}
                    </div>

                    {form.event_1_id && (
                      <div className="space-y-2">
                        <Label>Number of Participants — Event 1</Label>
                        <Select
                          value={String(form.event_1_team_size)}
                          onValueChange={(v) => {
                            const n = parseInt(v, 10);
                            setForm((f) => ({
                              ...f,
                              event_1_team_size: n,
                              event_1_team_name: n === 1 ? "" : f.event_1_team_name,
                            }));
                          }}
                        >
                          <SelectTrigger className="w-full bg-muted/50 border-primary/20">
                            <SelectValue placeholder="SELECT NUMBER OF TEAM MEMBERS" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: maxTeamSize1 }, (_, i) => i + 1).map((n) => (
                              <SelectItem key={n} value={String(n)}>
                                {n} {n === 1 ? "member" : "members"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Team Name for Event 1 */}
                  {form.event_1_id && form.event_1_team_size > 1 && (
                    <div className="space-y-2">
                      <Label>Team Name — Event 1</Label>
                      <Input
                        placeholder="Enter team name"
                        className="bg-muted/50 border-primary/20"
                        value={form.event_1_team_name}
                        onChange={(e) => setForm({ ...form, event_1_team_name: e.target.value })}
                        required
                      />
                      {errors.event_1_team_name && <p className="text-destructive text-sm">{errors.event_1_team_name}</p>}
                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 mt-2">
                        <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                          ⚠️ Important: All other team members have to register separately.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Event 2 Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Event 2</Label>
                      <Select
                        value={form.event_2_id || EMPTY_VALUE}
                        onValueChange={(v) => {
                          const evId = v === EMPTY_VALUE ? "" : v;
                          const ev = evId ? events.find((e) => e.id === evId) : null;
                          const maxSize = ev ? getEventTeamSize(ev.name) : 1;
                          const newTeamSize2 = evId ? (Math.min(form.event_2_team_size, maxSize) || 1) : 1;
                          setForm((f) => ({
                            ...f,
                            event_2_id: evId,
                            event_2_team_size: newTeamSize2,
                            event_2_team_name: newTeamSize2 === 1 ? "" : (newTeamSize2 > 1 ? f.event_2_team_name : ""),
                          }));
                        }}
                      >
                        <SelectTrigger className="w-full bg-muted/50 border-primary/20">
                          <SelectValue placeholder="Select second event" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={EMPTY_VALUE}>None</SelectItem>
                          {loadingEvents ? (
                            <SelectItem value="loading" disabled>Loading events...</SelectItem>
                          ) : eventsError ? (
                            <SelectItem value="error" disabled>Error loading events</SelectItem>
                          ) : events.length === 0 ? (
                            <SelectItem value="empty" disabled>No events available</SelectItem>
                          ) : (
                            events.map((ev) => {
                              const conflictWith1 = event1 && eventsConflict(ev.name, event1.name);
                              const isEvent1 = ev.id === form.event_1_id;
                              const disabled = conflictWith1 || isEvent1;
                              return (
                                <SelectItem
                                  key={ev.id}
                                  value={ev.id}
                                  disabled={disabled}
                                  className={disabled ? "opacity-80 cursor-not-allowed" : ""}
                                >
                                  {ev.name}
                                  {isEvent1 ? (
                                    <span className="text-muted-foreground ml-1">(same as Event 1)</span>
                                  ) : conflictWith1 ? (
                                    <span className="text-destructive font-medium ml-1">— TIME CONFLICT</span>
                                  ) : null}
                                </SelectItem>
                              );
                            })
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {form.event_2_id && (
                      <div className="space-y-2">
                        <Label>Number of Participants — Event 2</Label>
                        <Select
                          value={String(form.event_2_team_size)}
                          onValueChange={(v) => {
                            const n = parseInt(v, 10);
                            setForm((f) => ({
                              ...f,
                              event_2_team_size: n,
                              event_2_team_name: n === 1 ? "" : f.event_2_team_name,
                            }));
                          }}
                        >
                          <SelectTrigger className="w-full bg-muted/50 border-primary/20">
                            <SelectValue placeholder="SELECT NUMBER OF TEAM MEMBERS" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: maxTeamSize2 }, (_, i) => i + 1).map((n) => (
                              <SelectItem key={n} value={String(n)}>
                                {n} {n === 1 ? "member" : "members"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Team Name for Event 2 */}
                  {form.event_2_id && form.event_2_team_size > 1 && (
                    <div className="space-y-2">
                      <Label>Team Name — Event 2</Label>
                      <Input
                        placeholder="Enter team name"
                        className="bg-muted/50 border-primary/20"
                        value={form.event_2_team_name}
                        onChange={(e) => setForm({ ...form, event_2_team_name: e.target.value })}
                        required
                      />
                      {errors.event_2_team_name && <p className="text-destructive text-sm">{errors.event_2_team_name}</p>}
                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 mt-2">
                        <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                          ⚠️ Important: All other team members have to register separately.
                        </p>
                      </div>
                    </div>
                  )}

                  <hr className="border-border my-6" />

                  <p className="text-sm font-medium text-muted-foreground">Your details</p>

                  {/* Row 1: Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="page-reg-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="page-reg-name"
                          type="text"
                          placeholder="John Doe"
                          className="pl-10 bg-muted/50 border-primary/20 focus:border-primary/50"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                        />
                      </div>
                      {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="page-reg-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="page-reg-email"
                          type="email"
                          placeholder="your@email.com"
                          className="pl-10 bg-muted/50 border-primary/20 focus:border-primary/50"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          required
                        />
                      </div>
                      {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Row 2: WhatsApp Phone and Department */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="page-reg-whatsapp">WhatsApp Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="page-reg-whatsapp"
                          type="tel"
                          placeholder="+91 98765 43210"
                          className="pl-10 bg-muted/50 border-primary/20 focus:border-primary/50"
                          value={form.whatsapp_phone}
                          onChange={(e) => setForm({ ...form, whatsapp_phone: e.target.value })}
                          required
                        />
                      </div>
                      {errors.whatsapp_phone && <p className="text-destructive text-sm">{errors.whatsapp_phone}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="page-reg-department">Department</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="page-reg-department"
                          type="text"
                          placeholder="BCA"
                          className="pl-10 bg-muted/50 border-primary/20 focus:border-primary/50"
                          value={form.department}
                          onChange={(e) => setForm({ ...form, department: e.target.value })}
                          required
                        />
                      </div>
                      {errors.department && <p className="text-destructive text-sm">{errors.department}</p>}
                    </div>
                  </div>

                  {/* Row 3: College and Food Preference */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="page-reg-college">College</Label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="page-reg-college"
                          type="text"
                          placeholder="Bishop Heber College"
                          className="pl-10 bg-muted/50 border-primary/20 focus:border-primary/50"
                          value={form.college}
                          onChange={(e) => setForm({ ...form, college: e.target.value })}
                          required
                        />
                      </div>
                      {errors.college && <p className="text-destructive text-sm">{errors.college}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Food Preference</Label>
                      <RadioGroup
                        value={form.food_preference}
                        onValueChange={(value) => setForm({ ...form, food_preference: value })}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="veg" id="food-veg" />
                          <Label htmlFor="food-veg" className="font-normal cursor-pointer">Veg</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="non-veg" id="food-non-veg" />
                          <Label htmlFor="food-non-veg" className="font-normal cursor-pointer">Non-Veg</Label>
                        </div>
                      </RadioGroup>
                      {errors.food_preference && <p className="text-destructive text-sm">{errors.food_preference}</p>}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="payment" className="space-y-4 mt-0">
                  {/* Back Arrow */}
                  <button
                    type="button"
                    onClick={() => handleTabClick("registration")}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Edit Details
                  </button>

                  {/* UPI ID Message */}
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                    <p className="text-sm font-medium text-foreground mb-2">
                      Having trouble with payment?
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      Use this UPI ID:
                    </p>
                    <p className="text-lg font-mono font-bold text-primary break-all">
                      chitrasathish1979-2@okicici
                    </p>
                  </div>

                  <div className="rounded-lg border border-primary/20 bg-muted/10 p-6 flex flex-col items-center">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Registration Fee — ₹{PAYMENT_AMOUNT}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Scan the QR code to complete payment
                    </p>
                    <div className="flex justify-center">
                      <img
                        src={PAYMENT_QR_IMAGE}
                        alt={`Payment QR - ₹${PAYMENT_AMOUNT}`}
                        className="w-44 h-44 sm:w-52 sm:h-52 object-contain rounded-lg border border-border/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="upi-transaction-id">UPI Transaction ID</Label>
                    <Input
                      id="upi-transaction-id"
                      type="text"
                      placeholder="Enter UPI Transaction ID"
                      className="bg-muted/50 border-primary/20"
                      value={form.upi_transaction_id}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setForm({ ...form, upi_transaction_id: value });
                      }}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Enter the transaction ID from your payment confirmation</p>
                    {errors.upi_transaction_id && (
                      <p className="text-destructive text-sm">{errors.upi_transaction_id}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-upload">Payment Screenshot <span className="text-destructive">*</span></Label>
                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="payment-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        {form.payment_screenshot ? (
                          <div className="flex flex-col items-center gap-2 p-2">
                            <ImageIcon className="w-10 h-10 text-primary" />
                            <span className="text-sm font-medium">{form.payment_screenshot.name}</span>
                            <span className="text-xs text-muted-foreground">Click to change</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 p-2">
                            <Upload className="w-10 h-10 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Click to upload (PNG, JPG, WebP)</span>
                            <span className="text-xs text-muted-foreground">Max file size: 2MB</span>
                            <span className="text-xs text-destructive font-medium">Required - Please upload your payment confirmation</span>
                          </div>
                        )}
                        <input
                          id="payment-upload"
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          required
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Check file size (2MB = 2 * 1024 * 1024 bytes)
                              const maxSize = 2 * 1024 * 1024; // 2MB
                              if (file.size > maxSize) {
                                toast({
                                  title: "File too large",
                                  description: "Payment screenshot must be 2MB or smaller. Please compress the image and try again.",
                                  variant: "destructive",
                                });
                                return;
                              }
                              setForm((f) => ({ ...f, payment_screenshot: file }));
                              // Clear error if file is selected
                              setErrors((prev) => ({ ...prev, payment_screenshot: "" }));
                            }
                          }}
                        />
                      </label>
                    </div>
                    {errors.payment_screenshot && (
                      <p className="text-destructive text-sm">{errors.payment_screenshot}</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-8">
                <NeonButton type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : activeTab === "payment" ? (
                    "Submit Registration"
                  ) : (
                    "Proceed to Payment"
                  )}
                </NeonButton>
              </div>
            </form>
          </GlassPanel>
        </div>
      </main>

      <Footer />

      {/* Registration Alert Modal */}
      <AlertDialog open={showRegistrationAlert} onOpenChange={setShowRegistrationAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Registration Details</AlertDialogTitle>
            <AlertDialogDescription>
              Please review your registration details. You will proceed to the payment page after confirming.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Edit Details</AlertDialogCancel>
            <AlertDialogAction onClick={handleProceedToPayment}>Proceed to Payment</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Payment Confirmation Modal */}
      <AlertDialog open={showPaymentConfirm} onOpenChange={setShowPaymentConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your registration? Please ensure all payment details are correct.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Confirm & Submit"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Modal with Registration Form */}
      <Dialog open={showSuccessModal} onOpenChange={() => { }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto [&>button]:hidden sm:[&>button]:hidden">
          {/* Mobile close button - visible on mobile only, with high z-index */}
          <button
            onClick={() => {
              setShowSuccessModal(false);
              setForm(initialForm);
              window.location.href = "/";
            }}
            className="mobile-close-btn absolute right-4 top-4 z-[100] rounded-sm opacity-90 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-background/90 backdrop-blur-sm p-2.5 border-2 border-border/60 shadow-lg"
            aria-label="Close"
            style={{ display: 'block' }}
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
          <RegistrationSuccessModal
            form={form}
            events={events}
            event1={event1}
            event2={event2}
            registrationId={registrationId}
            onClose={() => {
              setShowSuccessModal(false);
              setForm(initialForm);
              window.location.href = "/";
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
