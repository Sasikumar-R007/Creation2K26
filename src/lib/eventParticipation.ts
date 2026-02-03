import { EVENT_PARTICIPATION_RULES, EVENT_NAME_TO_RULE_KEY } from "@/lib/constants";
import { EventData } from "@/hooks/useEvents";

/** Normalize event name for rule lookup (uppercase, trim, apply aliases) */
export function normalizeEventName(name: string): string {
  const normalized = name.toUpperCase().trim();
  return EVENT_NAME_TO_RULE_KEY[normalized] ?? normalized;
}

/** Get rule key for an event; returns null if no rule (e.g. unknown event) */
export function getRuleKeyForEvent(eventName: string): string | null {
  const key = normalizeEventName(eventName);
  return key in EVENT_PARTICIPATION_RULES ? key : null;
}

/** Check if two events conflict (only one can be chosen from their conflict group) */
export function eventsConflict(nameA: string, nameB: string): boolean {
  const keyA = getRuleKeyForEvent(nameA);
  const keyB = getRuleKeyForEvent(nameB);
  if (!keyA || !keyB) return false;
  if (keyA === keyB) return true;
  const ruleA = EVENT_PARTICIPATION_RULES[keyA];
  const ruleB = EVENT_PARTICIPATION_RULES[keyB];
  if (!ruleA || !ruleB) return false;
  return ruleA.cannot.includes(keyB) || ruleB.cannot.includes(keyA);
}

/** Given an event and all events, return which events the user CAN and CANNOT participate in if they choose this event */
export function getParticipationForEvent(
  eventName: string,
  allEvents: EventData[]
): { can: EventData[]; cannot: EventData[] } {
  const key = getRuleKeyForEvent(eventName);
  const rule = key ? EVENT_PARTICIPATION_RULES[key] : null;

  const can: EventData[] = [];
  const cannot: EventData[] = [];

  for (const ev of allEvents) {
    const evKey = normalizeEventName(ev.name);
    if (evKey === key) continue; // skip self
    if (!rule) {
      can.push(ev);
      continue;
    }
    if (rule.can.includes(evKey)) can.push(ev);
    else if (rule.cannot.includes(evKey)) cannot.push(ev);
  }

  return { can, cannot };
}

/** Check if registering for this event would conflict with any of the user's already registered event names */
export function conflictsWithRegistered(
  eventName: string,
  registeredEventNames: string[]
): boolean {
  return registeredEventNames.some((name) => eventsConflict(eventName, name));
}
