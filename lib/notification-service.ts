/**
 * Notification Service
 * Handles sending notifications to family members when tasks are accepted/completed
 */

import { usePetStore } from "@/store/PetStore";
import type { Task, FamilyMember } from "@/store/types";

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
}

/**
 * Send notification to family members when a task is accepted
 */
export async function notifyFamilyTaskAccepted(
  petId: string,
  task: Task,
  acceptedBy: string
): Promise<void> {
  const store = usePetStore.getState();
  const pet = store.getPet(petId);

  if (!pet) return;

  // Get family members (excluding the person who accepted the task)
  const familyMembers = store.getFamilyMembers(petId);
  const recipientMembers = familyMembers.filter((m) => m.name !== acceptedBy);

  if (recipientMembers.length === 0) return;

  const notification: NotificationPayload = {
    title: `${acceptedBy} wird sich kümmern`,
    body: `${acceptedBy} hat angeboten, ${pet.name} heute ${getTaskLabel(task.type)} zu ${getTaskVerb(task.type)}.`,
    data: {
      taskId: task.id,
      petId: petId,
      type: "task_accepted",
      acceptedBy: acceptedBy,
    },
  };

  // Send notification to each family member
  for (const member of recipientMembers) {
    await sendNotification(member, notification);
  }
}

/**
 * Send notification to family members when a task is completed
 */
export async function notifyFamilyTaskCompleted(
  petId: string,
  task: Task,
  completedBy: string
): Promise<void> {
  const store = usePetStore.getState();
  const pet = store.getPet(petId);

  if (!pet) return;

  // Get family members (excluding the person who completed the task)
  const familyMembers = store.getFamilyMembers(petId);
  const recipientMembers = familyMembers.filter((m) => m.name !== completedBy);

  if (recipientMembers.length === 0) return;

  const notification: NotificationPayload = {
    title: `${pet.name} wurde versorgt`,
    body: `${completedBy} hat ${pet.name} gerade ${getTaskLabel(task.type)} gegeben.`,
    data: {
      taskId: task.id,
      petId: petId,
      type: "task_completed",
      completedBy: completedBy,
    },
  };

  // Send notification to each family member
  for (const member of recipientMembers) {
    await sendNotification(member, notification);
  }
}

/**
 * Internal: Send notification to a specific family member
 * In production, this would integrate with a push notification service
 */
async function sendNotification(
  member: FamilyMember,
  payload: NotificationPayload
): Promise<void> {
  // TODO: Integrate with push notification service (Firebase Cloud Messaging, etc.)
  // For now, log to console in development
  if (__DEV__) {
    console.log(`[NOTIFICATION] To ${member.name} (${member.email}):`, payload);
  }

  // In production, send via:
  // - Firebase Cloud Messaging (FCM)
  // - Apple Push Notification service (APNs)
  // - Custom backend API

  // Example implementation (placeholder):
  // await fetch('/api/notifications/send', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     recipientId: member.id,
  //     recipientEmail: member.email,
  //     ...payload,
  //   }),
  // });
}

/**
 * Helper: Get readable task label
 */
function getTaskLabel(taskType: string): string {
  const labels: Record<string, string> = {
    feeding: "Fütterung",
    walking: "Gassi",
    medication: "Medikament",
    care: "Pflege",
  };
  return labels[taskType] || taskType;
}

/**
 * Helper: Get task verb (infinitive form)
 */
function getTaskVerb(taskType: string): string {
  const verbs: Record<string, string> = {
    feeding: "füttern",
    walking: "gassi gehen",
    medication: "geben",
    care: "pflegen",
  };
  return verbs[taskType] || "kümmern";
}

/**
 * Send a custom notification to family members
 */
export async function notifyFamily(
  petId: string,
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<void> {
  const store = usePetStore.getState();
  const familyMembers = store.getFamilyMembers(petId);

  if (familyMembers.length === 0) return;

  const notification: NotificationPayload = {
    title,
    body,
    data,
  };

  for (const member of familyMembers) {
    await sendNotification(member, notification);
  }
}
