import { NextResponse } from "next/server";
import { handleError } from "@/lib/errorHandler";

/**
 * Error Handling Test Route
 * 
 * This route simulates a database failure to demonstrate how the
 * centralized error handling middleware catches, logs, and formats
 * error responses differently for development and production.
 */
export async function GET() {
  try {
    // Simulate database or API failure
    throw new Error("Database connection failed!");
  } catch (error) {
    // Centralized error handler catches and processes the error
    return handleError(error, "GET /api/error-test");
  }
}
