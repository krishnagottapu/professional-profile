import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/contact/ContactForm";

// Mock the API module so we don't make real network calls
vi.mock("@/lib/api/contact", () => ({
  submitContact: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("ContactForm validation", () => {
  it("shows error when name is missing", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitBtn = screen.getByRole("button", { name: /send message/i });

    await user.type(emailInput, "test@example.com");
    await user.type(messageInput, "This is a valid message for testing.");
    await user.click(submitBtn);

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
  });

  it("shows error when email is missing", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitBtn = screen.getByRole("button", { name: /send message/i });

    await user.type(nameInput, "John Doe");
    await user.type(messageInput, "This is a valid message for testing.");
    await user.click(submitBtn);

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
  });

  it("shows error for invalid email format", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitBtn = screen.getByRole("button", { name: /send message/i });

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "not-an-email");
    await user.type(messageInput, "This is a valid message for testing.");
    await user.click(submitBtn);

    expect(
      await screen.findByText("Enter a valid email address")
    ).toBeInTheDocument();
  });

  it("shows error when message is missing", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitBtn = screen.getByRole("button", { name: /send message/i });

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "test@example.com");
    await user.click(submitBtn);

    expect(await screen.findByText("Message is required")).toBeInTheDocument();
  });

  it("submits successfully with valid form data", async () => {
    const user = userEvent.setup();
    const { submitContact } = await import("@/lib/api/contact");
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitBtn = screen.getByRole("button", { name: /send message/i });

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "test@example.com");
    await user.type(messageInput, "This is a valid message for testing purposes.");
    await user.click(submitBtn);

    // No error messages should appear
    expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Email is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Message is required")).not.toBeInTheDocument();

    // submitContact should have been called
    expect(submitContact).toHaveBeenCalledWith({
      name: "John Doe",
      email: "test@example.com",
      message: "This is a valid message for testing purposes.",
    });
  });
});
