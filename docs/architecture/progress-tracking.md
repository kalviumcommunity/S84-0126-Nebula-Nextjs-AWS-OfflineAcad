# Progress Tracking Architecture

This document details the architectural implementation of the lesson completion and progress tracking system within OfflineAcademy.

## Overview

The progress tracking system utilizes a simplified boolean model to ensure reliability and user trust, particularly in low-connectivity environments. This approach avoids complex time-based tracking mechanisms in favor of explicit user confirmation.

## Core Concepts

### Boolean Completion Logic

Lesson completion is tracked as a binary state (`completed: true` or `completed: false`). This design prioritizes data integrity and synchronization efficiency over granular time tracking.

- **Explicit Action**: Students manually mark lessons as complete.
- **Immediate Feedback**: The UI updates instantly, storing the state locally before syncing.
- **Offline First**: Completion events are queued and synced when connectivity is restored.

### Experience Points (XP) Calculation

Experience points are awarded based on lesson duration to incentivize completion.

- **Calculation**: 1 XP per minute of estimated lesson duration.
- **One-Time Award**: XP is granted only upon the *first* completion of a specific lesson. Subsequent toggles of the completion status do not affect the total XP.

## Data Model

The `UserProgress` model in the Prisma schema persists completion status.

```prisma
model UserProgress {
  id               String   @id @default(uuid())
  completed        Boolean  @default(false)
  progressPercent  Int      @default(0)        // Reserved for future use
  timeSpent        Int      @default(0)        // Reserved for future use
  startedAt        DateTime @default(now())
  lastWatched      DateTime @updatedAt
  completedAt      DateTime?                   // Reserved for future use

  userId    String
  lessonId  String

  @@unique([userId, lessonId])
}
```

## API Specification

The backend exposes RESTful endpoints to manage lesson state.

### Mark as Complete

Updates the lesson status to completed and triggers the XP award logic.

- **Endpoint**: `POST /api/lessons/[id]/complete`
- **Response**: JSON object confirming the status update and detailing any XP awarded.

### Mark as Incomplete

Reverts the lesson status to incomplete. Previously awarded XP is retained.

- **Endpoint**: `DELETE /api/lessons/[id]/complete`
- **Response**: JSON object confirming the status update.

## Frontend Integration

The frontend implementation leverages React state and API interactions to provide a responsive user experience.

- **Component**: `LessonDetailPage` handles the completion toggle logic.
- **State Management**: Updates are optimistic, reflecting immediately in the UI while the API request processes.
- **Feedback**: Toast notifications inform users of successful updates and XP gains.
